let visitCount = 0;

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');

  // Vercel commonly supplies x-forwarded-for. Use only the first address in the chain.
  // This endpoint does not persist the address; hosting infrastructure may still keep request logs.
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = (Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket?.remoteAddress || '').split(',')[0].trim();
  const ip = rawIp.length <= 64 ? rawIp : '';
  visitCount += 1;
  return res.status(200).json({ ip: ip || null, visits: visitCount });
}
