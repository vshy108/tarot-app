# Tarot App Cheatsheet

Quick reference for the Vue 3 + Vite tarot app.

## 1. Project Commands

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Start dev server | `pnpm dev` |
| Build production bundle | `pnpm build` |
| Preview production bundle | `pnpm preview` |

## 2. Tech Stack

| Layer | Version / Source |
|------|------------------|
| Vue | `vue` in `package.json` |
| TypeScript | `typescript` in `package.json` |
| Vite | `vite` in `package.json` |
| Tailwind CSS | `tailwindcss` in `package.json` |
| Tarot assets | Rider-Waite-Smith CC0 deck credit in `README.md` |

## 3. App Structure

| Area | File |
|------|------|
| App shell | `src/App.vue` |
| Routes | `src/router.ts` |
| Deck data | `src/data/deck.ts` |
| Typed inventory | `src/data/inventory.ts` |
| Reading prompts | `src/data/readingNotes.ts` |
| Deck state | `src/composables/useDeck.ts` |
| Main board | `src/components/Board.vue` |
| Draw result | `src/components/DrawResult.vue` |
| Single draw view | `src/views/SingleDrawView.vue` |
| Three-card spread view | `src/views/SpreadView.vue` |

## 4. Vue Patterns

```vue
<script setup lang="ts">
import { computed } from 'vue';

const label = computed(() => 'Draw a card');
</script>
```

Use `<script setup lang="ts">` for compact typed components. Keep deck logic in composables and card metadata in data files so views stay mostly presentational.

## 5. Tarot Data Rules

- Keep each card represented once in `src/data/deck.ts` and validated once in `src/data/inventory.ts`.
- Store title, suit/category, rank, prompt, and image path in data rather than component branches.
- Keep draw logic duplicate-safe when adding multi-card spreads.
- Credit external card assets in `README.md`.

## 6. UI Rules

- Card art should remain inspectable on mobile and desktop.
- Draw controls should use accessible button labels.
- Motion should support reduced-motion preferences when GSAP is used.
- Text overlays should not obscure important card details.

## 7. Verification

Before committing UI changes, run:

```bash
pnpm build
```

The production build imports the typed inventory and fails if the app cannot load exactly 78 unique card ids and image paths.

For behavior changes, add or update component/composable tests when a test runner is introduced.
