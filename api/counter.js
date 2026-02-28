// ====================================
// COUNTER PROXY - Vercel Serverless Function
// Proxies CounterAPI requests to avoid CORS issues
// ====================================

const NAMESPACE = 'statverdict';
const BASE_URL = 'https://api.counterapi.dev/v1';

// Allowed counter names to prevent abuse
const ALLOWED_COUNTERS = [
    'scans', 'users',
    'vote_poe2', 'vote_lastepoch', 'vote_d3', 'vote_d2r',
    'vote_di', 'vote_grim-dawn', 'vote_torchlight'
];

const ALLOWED_ORIGINS = [
    'https://statverdict.com',
    'https://www.statverdict.com',
    'https://statverdict.vercel.app'
];

export default async function handler(req, res) {
    // CORS headers
    const origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, action } = req.query;

    if (!name || !ALLOWED_COUNTERS.includes(name)) {
        return res.status(400).json({ error: 'Invalid counter name' });
    }

    // action can be 'up' to increment, or omitted to read
    if (action && action !== 'up') {
        return res.status(400).json({ error: 'Invalid action' });
    }

    try {
        const url = action === 'up'
            ? `${BASE_URL}/${NAMESPACE}/${name}/up`
            : `${BASE_URL}/${NAMESPACE}/${name}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            // Counter doesn't exist yet — return 0
            if (response.status === 404) {
                return res.status(200).json({ count: 0 });
            }
            throw new Error(`CounterAPI returned ${response.status}`);
        }

        const data = await response.json();
        return res.status(200).json({ count: data.count || 0 });

    } catch (error) {
        console.error('Counter proxy error:', error.message);
        return res.status(200).json({ count: 0, error: 'upstream_error' });
    }
}
