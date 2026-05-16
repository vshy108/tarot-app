<script setup lang="ts">
import { computed, ref } from 'vue'
import { readingPrompt } from '@/data/readingNotes'
import { useDeck, type DrawnCard } from '@/composables/useDeck'

const deck = computed(() => useDeck())
const drawnCard = ref<DrawnCard | null>(null)

function drawCard() {
  const shuffled = [...deck.value].sort(() => Math.random() - 0.5)
  const card = shuffled[0]
  if (!card) return

  drawnCard.value = {
    ...card,
    orientation: Math.random() > 0.5 ? 'upright' : 'reversed',
  }
}
</script>

<template>
  <main class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 text-slate-100">
    <section class="grid gap-8 md:grid-cols-[minmax(240px,360px)_1fr] md:items-center">
      <div class="flex min-h-[28rem] items-center justify-center rounded-lg border border-pink-300/20 bg-slate-950/60 p-4">
        <img
          v-if="drawnCard"
          :src="drawnCard.image"
          :alt="drawnCard.title"
          :class="['max-h-[26rem] rounded-md object-contain shadow-2xl', drawnCard.orientation === 'reversed' ? 'rotate-180' : '']"
        >
        <div v-else class="text-center text-slate-300">
          <p class="text-lg font-semibold">Single Card Draw</p>
          <p class="mt-2 text-sm">Draw one card for a focused prompt.</p>
        </div>
      </div>

      <div class="space-y-5">
        <p class="text-sm uppercase tracking-[0.2em] text-pink-200">One-card reading</p>
        <h1 class="text-3xl font-bold md:text-5xl">A clear card, a clear question.</h1>
        <button
          type="button"
          class="rounded-md bg-pink-500 px-5 py-3 font-semibold text-white shadow-lg shadow-pink-950/40 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
          aria-label="Draw one tarot card"
          @click="drawCard"
        >
          Draw one card
        </button>

        <section v-if="drawnCard" class="rounded-lg border border-white/10 bg-white/10 p-5">
          <p class="text-sm uppercase tracking-[0.18em] text-pink-200">
            {{ drawnCard.suit }} / {{ drawnCard.rank }} / {{ drawnCard.orientation }}
          </p>
          <h2 class="mt-2 text-2xl font-semibold">{{ drawnCard.title }}</h2>
          <p class="mt-3 max-w-prose text-base leading-7 text-slate-100">
            {{ readingPrompt(drawnCard) }}
          </p>
        </section>
      </div>
    </section>
  </main>
</template>
