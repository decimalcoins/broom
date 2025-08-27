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
