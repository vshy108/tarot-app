# Tarot App Improvement Plan

This plan turns the current Vue/Vite template into a focused tarot application. Keep slices small, visual, and verifiable through the production build.

## S1 — App Identity And Deck Inventory

- [ ] Replace the template README with the actual app purpose, setup commands, asset credit, and deck source.
- [ ] Add a typed tarot card inventory that maps every card image to suit, rank, title, and image path.
- [ ] Verify all 78 Rider-Waite-Smith card assets are represented exactly once.

## S2 — Single Card Draw

- [ ] Build the first usable screen around drawing one card from a shuffled deck.
- [ ] Show the card image, title, suit/category, and upright/reversed orientation.
- [ ] Verify with: `npm run build`.

## S3 — Three-Card Spread

- [ ] Add a three-card spread mode with stable positions such as past, present, and future.
- [ ] Prevent duplicate cards within one spread.
- [ ] Add reset and redraw controls with accessible button labels.

## S4 — Reading Notes

- [ ] Add concise local card meanings or prompts for major arcana and each suit.
- [ ] Keep the text editable in data files rather than hard-coded inside components.
- [ ] Verify mobile and desktop layouts so text does not cover card art.

## S5 — Polish And Deployment

- [ ] Add route-level structure for home, single draw, and spread views.
- [ ] Use GSAP only where motion improves the draw interaction and respects reduced-motion preferences.
- [ ] Add a deployment note for static hosting after `npm run build`.
