import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

function getFirebaseDatabase() {
  const required = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_DATABASE_URL',
  ];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing Firebase environment variables: ${missing.join(', ')}`);
  }

  const app = getApps()[0] || initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

  return getDatabase(app);
}

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
    const visitsRef = getFirebaseDatabase().ref('campaign/visits');
    const result = await visitsRef.transaction((currentValue) => {
      return (Number(currentValue) || 0) + 1;
    });
    const visits = result.snapshot.val();

    return res.status(200).json({ ip: ip || null, visits });
  } catch (error) {
    console.error('Unable to record campaign visit', error);
    return res.status(503).json({ error: 'Visit counter unavailable' });
  }
}
