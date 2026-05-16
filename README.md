# Tarot Table

Tarot Table is a Vue 3 + Vite tarot reading app built around a local Rider-Waite-Smith image deck. It supports a focused single-card draw, a past/present/future spread, the existing advanced shuffle board, and a full card browser.

## Features

- Typed 78-card inventory in `src/data/inventory.ts` with id, title, suit/category, rank, Vite image URL, and source image path.
- Build-time inventory validation that fails when the app does not load exactly 78 unique card ids and image paths.
- Single-card draw route at `/single` with upright/reversed orientation and local prompts.
- Three-card spread route at `/spread` with stable past/present/future positions, no duplicate cards, and reset/redraw controls.
- Local reading prompts in `src/data/readingNotes.ts` for every major arcana card and each minor suit.
- Full deck browser at `/cards` and advanced shuffle/cut flow at `/draw`.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Deck Data

Card images live in `src/assets/cards/*.png` and are imported through Vite's `import.meta.glob` in `src/data/deck.ts`. The inventory layer derives each card's suit/category, rank, title, and image path from the deck ids, then validates the complete 78-card set during app startup and production build.

The card art is credited to LuciellaES Rider-Waite-Smith Tarot Cards CC0: https://luciellaes.itch.io/rider-waite-smith-tarot-cards-cc0

## Deployment

Run `pnpm build` and deploy the generated `dist/` directory to any static host such as GitHub Pages, Netlify, Vercel, or an S3 static website bucket. The app uses client-side routes, so configure the host to fall back to `index.html` for `/single`, `/spread`, `/draw`, and `/cards`.

## Proof Map

- Plan: `PLAN.md`
- Commands: `CHEATSHEET.md`
- Inventory: `src/data/inventory.ts`
- Prompts: `src/data/readingNotes.ts`
- Routes: `src/router.ts`
