# Campus Diwali QR Safety Simulation

A responsive, mobile-first cybersecurity awareness page built with HTML, CSS, vanilla JavaScript, and a small Vercel serverless endpoint. No framework or build step is required.

## Experience flow

1. Visitors see a simple Diwali gift promotion.
2. When they select **Reveal my gift**, the page shows browser-visible information and the public IP address observed by the server.
3. An in-page banking-style notification displays a randomly generated five-digit rupee amount. It is a simulation only; no bank is contacted and no transaction occurs.
4. The page reveals the lesson and explains QR-code risks.

The transaction alert is created inside the webpage only. The page does not request OS notification permissions, payment information, passwords, precise location, camera, microphone, or contacts. It does not write the displayed information to an application database. Hosting infrastructure may process request metadata in platform logs.

## Deploy to Vercel

1. Upload this folder to a new GitHub repository, or push it to an existing repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Select **Other** as the framework preset. No build command or output directory is required.
4. Deploy. Vercel serves `index.html` and exposes `api/visitor.js` at `/api/visitor`.
5. Test the flow on both Android and iPhone before printing QR posters.

The page reports a best-effort campaign visit count from Firebase Realtime Database at `campaign/visits`. It counts requests, not verified unique people, and should be treated as an engagement estimate rather than an audit-grade metric. If the function is unavailable, the page falls back to a visit count stored only in that browser's local storage and labels it accordingly.

## Firebase setup

Create a Realtime Database in Firebase and keep its rules locked. Configure these Vercel environment variables for the deployment: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, and `FIREBASE_DATABASE_URL`. The service-account key is read only by `api/visitor.js` through the Firebase Admin SDK and is never placed in the repository or browser code. Do not commit `.env` files or paste the key into source code.

If no value appears after a visit, check the deployed function directly at `/api/visitor`, then inspect the Vercel function logs. A successful response includes `visits`; a `503` usually means one of the Firebase environment variables is missing or incorrect. Redeploy after adding or changing environment variables.

## Run locally

Install the Vercel CLI, then run:

```bash
npx vercel dev
```

Opening `index.html` directly as a file will not provide the IP endpoint.

## Data and privacy notes

- Browser/display values are read locally in the visitor's browser.
- `/api/visitor` returns the IP address supplied by the hosting request headers; it does not write it to an application database.
- The campaign counter atomically increments one Firebase value at `campaign/visits`; it does not store the displayed IP address. Do not use it for security, billing, or identity decisions.
- Hosting infrastructure may process or retain request metadata in platform logs. Review Vercel's current logging and privacy settings before the campaign.
- Get college approval for posters and explain the campaign's purpose and data handling in line with institutional policy and applicable law.

## Project files

- `index.html` — responsive page, browser details, staged alert, and awareness reveal
- `api/visitor.js` — serverless endpoint for the request IP
- `vercel.json` — security headers and platform configuration
