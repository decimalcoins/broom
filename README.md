# Broom Marketplace — Next.js + Tailwind

This project is a Next.js App Router conversion of your HTML prototype.
It preserves UI/flow: splash, login (buyer/admin), payment activation, admin panel, product catalog, checkout modal, chat modal, and SHU page.

## Quick Start

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Structure

- `app/` (App Router pages: `/`, `/payment`, `/admin`, `/shu`, `/privacy`, `/terms`)
- `components/` (Navbar, Footer, ProductCard, Modals, Splash)
- `context/` (AppProvider for global state)
- `lib/` (constants & dummy data)
- Tailwind already configured in `app/globals.css` and `tailwind.config.js`.

Enjoy!

# Broom Marketplace — Next.js + Tailwind

This project is a Next.js App Router conversion of your HTML prototype.
It preserves UI/flow: splash, login (buyer/admin), payment activation, admin panel, product catalog, checkout modal, chat modal, and SHU page.

## Quick Start

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Structure

- `app/` (App Router pages: `/`, `/payment`, `/admin`, `/shu`, `/privacy`, `/terms`)
- `components/` (Navbar, Footer, ProductCard, Modals, Splash)
- `context/` (AppProvider for global state)
- `lib/` (constants & dummy data)
- Tailwind already configured in `app/globals.css` and `tailwind.config.js`.

Enjoy!

## Pi Network Integration

This project now includes a minimal Pi Network integration.

### Install dependencies
```bash
npm install
# if you haven't:
# npm install @pi-network/pi-sdk
```

### Where things live
- `lib/pi.js` – Pi SDK initializer (sandbox=true by default)
- `components/PiLoginButton.jsx` – Login + demo payment button
- `app/page.jsx` – Example usage

### Run (for Pi Browser testing)
```bash
npm run build
npm start
```

Switch `sandbox: true` to `false` in `lib/pi.js` for production.


## Server-side & Platform features added

- Payment webhook endpoint (POST `/api/pi/callback`) — supports optional HMAC signature via env `PI_WEBHOOK_SECRET`.
- Auth cookie setter (POST `/api/auth/set-cookie`) — called after Pi login to set `pi_auth` cookie.
- Ads revenue endpoint (POST `/api/ads/revenue`) — distributes revenue with admin share (15% of 50%).
- Admin dashboard at `/admin` (protected by middleware) showing balances and logs (reads from `project_data`).
- Seller dashboard at `/seller` showcasing `PiAds` demo and reporting revenue.
- Middleware `middleware.js` protects `/admin`, `/seller`, `/checkout` routes and redirects unauthenticated users to `/auth`.

### Data persistence (local)
Data saved to `project_data/*.json`:
- `payments.json`
- `balances.json`
- `revenue_logs.json`

In production, replace with a proper database and secure cookie/JWT handling.
