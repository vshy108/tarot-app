<template>
  <main class="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 text-slate-100">
    <section class="grid gap-8 md:grid-cols-[1fr_18rem] md:items-center">
      <div class="space-y-6">
        <p class="text-sm uppercase tracking-[0.2em] text-pink-200">Rider-Waite-Smith deck</p>
        <h1 class="max-w-3xl text-4xl font-bold md:text-6xl">Tarot Table</h1>
        <p class="max-w-2xl text-lg leading-8 text-slate-200">
          Draw a single card, lay out a three-card spread, or browse the full 78-card inventory with local prompts and upright or reversed orientation.
        </p>
        <div class="flex flex-wrap gap-3">
          <RouterLink
            to="/single"
            class="rounded-md bg-pink-500 px-5 py-3 font-semibold text-white hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
          >
            Single card
          </RouterLink>
          <RouterLink
            to="/spread"
            class="rounded-md bg-amber-500 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
          >
            Three-card spread
          </RouterLink>
          <RouterLink
            to="/cards"
            class="rounded-md border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-200"
          >
            Browse deck
          </RouterLink>
        </div>
      </div>

      <div class="rounded-lg border border-pink-300/20 bg-slate-950/70 p-4">
        <img
          src="/src/assets/cards/maj-00-the-fool.png"
          alt="The Fool tarot card"
          class="mx-auto max-h-96 rounded-md object-contain shadow-2xl"
        >
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <RouterLink to="/single" class="rounded-lg border border-white/10 bg-white/10 p-5 hover:bg-white/15">
        <h2 class="text-xl font-semibold text-pink-100">Single Draw</h2>
        <p class="mt-2 text-sm leading-6 text-slate-200">One card with title, suit or category, rank, orientation, and a concise prompt.</p>
      </RouterLink>
      <RouterLink to="/spread" class="rounded-lg border border-white/10 bg-white/10 p-5 hover:bg-white/15">
        <h2 class="text-xl font-semibold text-pink-100">Past / Present / Future</h2>
        <p class="mt-2 text-sm leading-6 text-slate-200">Three stable positions, no duplicate cards, and reset or redraw controls.</p>
      </RouterLink>
      <RouterLink to="/cards" class="rounded-lg border border-white/10 bg-white/10 p-5 hover:bg-white/15">
        <h2 class="text-xl font-semibold text-pink-100">78-Card Inventory</h2>
        <p class="mt-2 text-sm leading-6 text-slate-200">All Rider-Waite-Smith assets are loaded through a typed inventory check.</p>
      </RouterLink>
    </section>
  </main>
</template>
