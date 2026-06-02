import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { plz } = req.query;

  if (!plz || typeof plz !== 'string') {
    return res.status(400).json({ error: 'missing_parameter', message: "Parameter 'plz' fehlt." });
  }

  const response = await fetch(`https://api.brewwater.de/v1/water?plz=${plz}`, {
    headers: {
      'X-API-Key': 'bw_live_test1234567890abcdef1234567890ab',
    },
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
