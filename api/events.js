// api/events.js
// Vercel serverless function — proxies the helltides.com public schedule API
// to avoid CORS restrictions in the browser.
//
// Usage: GET /api/events
// Returns: { world_boss: [...], legion: [...], helltide: [...] }

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://helltides.com/api/schedule', {
      headers: {
        // Identify as a legitimate client
        'Accept': 'application/json',
        'User-Agent': 'StatVerdict/1.0 (https://statverdict.com)',
      },
      // Revalidate at most once every 60 seconds — schedule data changes infrequently
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Upstream API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache the response for 60 seconds at the CDN edge
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json(data);
  } catch (err) {
    console.error('[/api/events] fetch error:', err);
    return res.status(502).json({ error: 'Failed to fetch event schedule. Please try again shortly.' });
  }
}
