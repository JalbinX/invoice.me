const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const KEY = 'jalbinx:db';

async function redis(cmd) {
  const r = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || 'Database error');
  return j.result;
}

module.exports = async (req, res) => {
  if (!process.env.SEND_PASSCODE || req.headers['x-passcode'] !== process.env.SEND_PASSCODE) {
    return res.status(401).json({ error: 'Wrong passcode' });
  }
  if (!URL_ || !TOKEN) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    if (req.method === 'GET') {
      const v = await redis(['GET', KEY]);
      return res.json({ data: v ? JSON.parse(v) : null });
    }
    if (req.method === 'PUT') {
      const b = req.body;
      if (!b || !b.settings || !Array.isArray(b.invoices) || !Array.isArray(b.clients)) {
        return res.status(400).json({ error: 'Bad data' });
      }
      const s = JSON.stringify(b);
      if (s.length > 900000) return res.status(413).json({ error: 'Data too large. Try a smaller logo.' });
      await redis(['SET', KEY, s]);
      return res.json({ ok: true });
    }
    return res.status(405).json({ error: 'Not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Database error' });
  }
};
