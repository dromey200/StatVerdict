// Vercel Serverless Function: /api/analyze
// Proxies requests to Google Gemini API using server-side GEMINI_API_KEY

// Increase body size limit to support 10MB image uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb', // 10MB image + base64 overhead + JSON wrapper
    },
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { prompt, imageBase64, mimeType } = req.body;

    if (!prompt || !imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'Missing required fields: prompt, imageBase64, mimeType' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: imageBase64 } },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.0,
            max_output_tokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Gemini API error:', err);
      return res.status(response.status).json({
        error: err.error?.message || `Gemini API Error: ${response.status}`,
      });
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    const textContent = data.candidates[0].content.parts[0].text;
    const parsed = safeJSONParse(textContent);

    if (!parsed) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Safe JSON parser with truncation repair for Gemini responses
 */
function safeJSONParse(str) {
  try {
    let clean = str.replace(/```json/g, '').replace(/```/g, '').trim();
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start !== -1 && end !== -1) clean = clean.substring(start, end + 1);
    return JSON.parse(clean);
  } catch (_e) {
    // Attempt to repair truncated JSON
    try {
      let clean = str.replace(/```json/g, '').replace(/```/g, '').trim();
      const start = clean.indexOf('{');
      if (start === -1) return null;
      clean = clean.substring(start);

      // Close any open strings
      const quoteCount = (clean.match(/(?<!\\)"/g) || []).length;
      if (quoteCount % 2 !== 0) clean += '"';

      // Close open braces/brackets
      let braceDepth = 0;
      let bracketDepth = 0;
      for (const char of clean) {
        if (char === '{') braceDepth++;
        if (char === '}') braceDepth--;
        if (char === '[') bracketDepth++;
        if (char === ']') bracketDepth--;
      }
      while (bracketDepth > 0) { clean += ']'; bracketDepth--; }
      while (braceDepth > 0) { clean += '}'; braceDepth--; }

      return JSON.parse(clean);
    } catch (_repairError) {
      console.error('JSON repair failed');
      return null;
    }
  }
}
