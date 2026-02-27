// ====================================
// HORADRIC AI - SERVERLESS API PROXY
// Vercel Serverless Function
// Keeps Gemini API key secure server-side
// ====================================

// --- In-Memory Rate Limiting ---
// NOTE: In-memory stores reset on cold starts. For production-scale,
// replace with Vercel KV or Upstash Redis for persistent tracking.
// This provides solid protection for moderate traffic.
const rateLimitStore = new Map();

const RATE_LIMIT = {
    MAX_REQUESTS_PER_DAY: 25,    // Per-IP daily cap
    MAX_REQUESTS_PER_MINUTE: 5,  // Per-IP burst protection
    WINDOW_MS: 60 * 1000,        // 1 minute window
    DAY_MS: 24 * 60 * 60 * 1000, // 24 hour window
    MAX_BODY_SIZE: 15 * 1024 * 1024, // 15MB max payload (images can be large)
};

// Cleanup stale entries every 10 minutes to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitStore.entries()) {
        if (now - data.windowStart > RATE_LIMIT.DAY_MS) {
            rateLimitStore.delete(key);
        }
    }
}, 10 * 60 * 1000);

function getRateLimitInfo(ip) {
    const now = Date.now();
    let data = rateLimitStore.get(ip);

    if (!data || (now - data.dayStart) > RATE_LIMIT.DAY_MS) {
        // Reset daily counter
        data = {
            dayStart: now,
            dayCount: 0,
            windowStart: now,
            windowCount: 0,
            timestamps: []
        };
        rateLimitStore.set(ip, data);
    }

    // Clean up minute-window timestamps
    data.timestamps = data.timestamps.filter(t => (now - t) < RATE_LIMIT.WINDOW_MS);

    return data;
}

function checkRateLimit(ip) {
    const data = getRateLimitInfo(ip);
    const now = Date.now();

    // Check daily limit
    if (data.dayCount >= RATE_LIMIT.MAX_REQUESTS_PER_DAY) {
        const resetIn = Math.ceil((data.dayStart + RATE_LIMIT.DAY_MS - now) / 1000 / 60);
        return {
            allowed: false,
            reason: 'daily',
            remaining: 0,
            resetMinutes: resetIn,
            message: `Daily scan limit reached (${RATE_LIMIT.MAX_REQUESTS_PER_DAY}/day). Resets in ~${resetIn} minutes.`
        };
    }

    // Check per-minute burst limit
    if (data.timestamps.length >= RATE_LIMIT.MAX_REQUESTS_PER_MINUTE) {
        return {
            allowed: false,
            reason: 'burst',
            remaining: RATE_LIMIT.MAX_REQUESTS_PER_DAY - data.dayCount,
            message: 'Too many requests. Please wait a moment before scanning again.'
        };
    }

    return {
        allowed: true,
        remaining: RATE_LIMIT.MAX_REQUESTS_PER_DAY - data.dayCount - 1,
        daily_limit: RATE_LIMIT.MAX_REQUESTS_PER_DAY
    };
}

function recordRequest(ip) {
    const data = getRateLimitInfo(ip);
    data.dayCount++;
    data.timestamps.push(Date.now());
    rateLimitStore.set(ip, data);
}

// --- Allowed Origins ---
// Update these to match your actual production domains
const ALLOWED_ORIGINS = [
    'https://statverdict.com',
    'https://www.statverdict.com',
    'https://statverdict.vercel.app',
    // Add any other domains/subdomains you deploy to
];

// In development, also allow localhost
if (process.env.VERCEL_ENV !== 'production') {
    ALLOWED_ORIGINS.push('http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080');
}

function isAllowedOrigin(origin) {
    if (!origin) return false;
    return ALLOWED_ORIGINS.some(allowed => origin === allowed || origin.endsWith('.vercel.app'));
}

// --- Main Handler ---
export default async function handler(req, res) {
    const origin = req.headers.origin || req.headers.referer || '';

    // CORS headers
    if (isAllowedOrigin(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Validate origin in production
    if (process.env.VERCEL_ENV === 'production' && !isAllowedOrigin(origin)) {
        return res.status(403).json({ error: 'Forbidden: Invalid origin' });
    }

    // Validate API key is configured
    if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY environment variable is not set');
        return res.status(500).json({ error: 'Server configuration error. Please contact the site admin.' });
    }

    // --- Rate Limiting ---
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || req.headers['x-real-ip']
        || req.socket?.remoteAddress
        || 'unknown';

    const rateCheck = checkRateLimit(clientIP);
    
    // Always send rate limit headers so the frontend can display usage
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT.MAX_REQUESTS_PER_DAY);
    res.setHeader('X-RateLimit-Remaining', rateCheck.remaining ?? 0);

    if (!rateCheck.allowed) {
        return res.status(429).json({
            error: rateCheck.message,
            reason: rateCheck.reason,
            remaining: 0,
            limit: RATE_LIMIT.MAX_REQUESTS_PER_DAY
        });
    }

    // --- Validate Request Body ---
    const { prompt, imageBase64, mimeType } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid prompt' });
    }

    if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid image data' });
    }

    if (!mimeType || !['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(mimeType)) {
        return res.status(400).json({ error: 'Invalid image type. Supported: PNG, JPEG, WebP' });
    }

    // Basic size check (base64 is ~33% larger than raw)
    const estimatedSize = (imageBase64.length * 3) / 4;
    if (estimatedSize > RATE_LIMIT.MAX_BODY_SIZE) {
        return res.status(413).json({ error: 'Image too large. Maximum 10MB.' });
    }

    // --- Call Gemini API ---
    try {
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inline_data: { mime_type: mimeType, data: imageBase64 } }
                        ]
                    }],
                    generationConfig: {
                        response_mime_type: "application/json",
                        temperature: 0.0,
                        max_output_tokens: 8192
                    }
                })
            }
        );

        // Record the request AFTER successful Gemini call (don't penalize for server errors)
        recordRequest(clientIP);

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {
            console.error('Gemini API error:', data);

            // Don't leak raw Gemini error details to client
            const status = geminiResponse.status;
            if (status === 429) {
                return res.status(503).json({
                    error: 'AI service is temporarily busy. Please try again in a moment.',
                    remaining: RATE_LIMIT.MAX_REQUESTS_PER_DAY - getRateLimitInfo(clientIP).dayCount
                });
            }
            
            return res.status(502).json({
                error: 'AI analysis failed. Please try again.',
                remaining: RATE_LIMIT.MAX_REQUESTS_PER_DAY - getRateLimitInfo(clientIP).dayCount
            });
        }

        // Return the successful response with rate limit info
        return res.status(200).json({
            ...data,
            _rateLimit: {
                remaining: RATE_LIMIT.MAX_REQUESTS_PER_DAY - getRateLimitInfo(clientIP).dayCount,
                limit: RATE_LIMIT.MAX_REQUESTS_PER_DAY
            }
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({
            error: 'Internal server error. Please try again.'
        });
    }
}
