<script setup lang="ts">
import { computed, ref } from 'vue'
import { readingPrompt } from '@/data/readingNotes'
import { useDeck, type DrawnCard } from '@/composables/useDeck'

const positions = ['Past', 'Present', 'Future'] as const
const deck = computed(() => useDeck())
const spread = ref<DrawnCard[]>([])

function drawSpread() {
  spread.value = [...deck.value]
    .sort(() => Math.random() - 0.5)
    .slice(0, positions.length)
    .map((card) => ({
      ...card,
      orientation: Math.random() > 0.5 ? 'upright' : 'reversed',
    }))
}

function resetSpread() {
  spread.value = []
}
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 text-slate-100">
    <section class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.2em] text-pink-200">Three-card spread</p>
        <h1 class="mt-2 text-3xl font-bold md:text-5xl">Past, present, future.</h1>
      </div>
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-md bg-pink-500 px-5 py-3 font-semibold text-white hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
          aria-label="Draw a new three-card spread"
          @click="drawSpread"
        >
          Draw spread
        </button>
        <button
          type="button"
          class="rounded-md border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-200"
          aria-label="Reset the three-card spread"
          @click="resetSpread"
        >
          Reset
        </button>
      </div>
    </section>

    <section class="grid gap-5 md:grid-cols-3">
      <article
        v-for="(position, index) in positions"
        :key="position"
        class="min-h-[34rem] rounded-lg border border-pink-300/20 bg-slate-950/60 p-4"
      >
        <p class="text-sm uppercase tracking-[0.18em] text-pink-200">{{ position }}</p>
        <template v-if="spread[index]">
          <img
            :src="spread[index].image"
            :alt="spread[index].title"
            :class="['mx-auto mt-4 max-h-72 rounded-md object-contain shadow-xl', spread[index].orientation === 'reversed' ? 'rotate-180' : '']"
          >
          <h2 class="mt-4 text-xl font-semibold">{{ spread[index].title }}</h2>
          <p class="mt-1 text-sm text-slate-300">
            {{ spread[index].suit }} / {{ spread[index].rank }} / {{ spread[index].orientation }}
          </p>
          <p class="mt-3 text-sm leading-6 text-slate-100">
            {{ readingPrompt(spread[index]) }}
          </p>
        </template>
        <div v-else class="mt-24 text-center text-slate-300">
          Waiting for a card.
        </div>
      </article>
    </section>
  </main>
</template>
