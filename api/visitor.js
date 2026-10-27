import { list, put } from '@vercel/blob';
import { randomUUID } from 'node:crypto';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel commonly supplies x-forwarded-for. Use only the first address in the chain.
  // This endpoint does not persist the address; hosting infrastructure may still keep request logs.
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = (Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket?.remoteAddress || '').split(',')[0].trim();
  const ip = rawIp.length <= 64 ? rawIp : '';

  try {
    await put(`visits/${Date.now()}-${randomUUID()}`, '', {
      access: 'private',
      addRandomSuffix: false,
      contentType: 'application/octet-stream',
    });

    let visits = 0;
    let cursor;
    do {
      const page = await list({ prefix: 'visits/', cursor, limit: 1000 });
      visits += page.blobs.length;
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    return res.status(200).json({ ip: ip || null, visits });
  } catch (error) {
    console.error('Unable to record campaign visit', error);
    return res.status(503).json({ error: 'Visit counter unavailable' });
  }
}
