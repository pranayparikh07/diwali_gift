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

The page reports a best-effort campaign visit count from private Vercel Blob records. It counts requests, not verified unique people, and should be treated as an engagement estimate rather than an audit-grade metric. If the function is unavailable, the page falls back to a visit count stored only in that browser's local storage and labels it accordingly.

## Vercel Blob setup

Connect a private Blob store to the Vercel project and enable the read-write token environment variable. The deployment must provide `BLOB_READ_WRITE_TOKEN`; the token is read by `api/visitor.js` through the Blob SDK and is never placed in the repository or browser code. Do not commit `.env` files or paste the token into source code.

## Run locally

Install the Vercel CLI, then run:

```bash
npx vercel dev
```

Opening `index.html` directly as a file will not provide the IP endpoint.

## Data and privacy notes

- Browser/display values are read locally in the visitor's browser.
- `/api/visitor` returns the IP address supplied by the hosting request headers; it does not write it to an application database.
- The campaign counter stores one private empty Blob object per request under `visits/`; the unique pathname is the visit record, so no timestamp payload or displayed IP address is stored. Do not use it for security, billing, or identity decisions.
- Hosting infrastructure may process or retain request metadata in platform logs. Review Vercel's current logging and privacy settings before the campaign.
- Get college approval for posters and explain the campaign's purpose and data handling in line with institutional policy and applicable law.

## Project files

- `index.html` — responsive page, browser details, staged alert, and awareness reveal
- `api/visitor.js` — serverless endpoint for the request IP
- `vercel.json` — security headers and platform configuration
