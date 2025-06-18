

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { type TarotCardWithId, useTarotDeck } from '@/composables/useTarotDeck'
import { gsap } from 'gsap'
import TarotCardModal from '@/components/TarotCardModal.vue'
import CardBack from '../components/CardBack.vue'

const deck = useTarotDeck()
const fullDeck = ref<TarotCardWithId[]>(deck)
const drawnCards = ref<TarotCardWithId[]>([])
const revealedIndexes = ref<number[]>([])
const selectedCard = ref<TarotCardWithId | null>(null)

const numberOfCardsToDraw = 3

function drawCards() {
  const shuffled = [...fullDeck.value].sort(() => Math.random() - 0.5)
  drawnCards.value = shuffled.slice(0, numberOfCardsToDraw)
  revealedIndexes.value = []
  selectedCard.value = null

  nextTick(() => {
    gsap.from('.card', {
      opacity: 0,
      y: 60,
      stagger: 0.2,
      duration: 0.6,
      ease: 'power2.out'
    })
  })
}

function revealCard(index: number) {
  if (!revealedIndexes.value.includes(index)) {
    revealedIndexes.value.push(index)
  }
}

function openModal(card: TarotCardWithId) {
  selectedCard.value = card
}
</script>

<style scoped>
.card {
  perspective: 1000px;
}
</style>

<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-800 to-indigo-900 text-white p-8">
    <h1 class="text-3xl font-bold text-center mb-8">Draw Your Tarot Cards</h1>

    <div class="flex justify-center">
      <button
        @click="drawCards"
        class="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-lg shadow-lg transition-all"
      >
        Shuffle & Draw 3 Cards
      </button>
    </div>

    <div class="mt-10 flex justify-center gap-6">
      <div
        v-for="(card, index) in drawnCards"
        :key="card.id"
        class="card relative w-32 h-48 cursor-pointer transition-transform duration-300 hover:scale-105"
        @click="revealCard(index)"
      >
        <img
          v-if="revealedIndexes.includes(index)"
          :src="card.image"
          alt="Tarot card"
          class="w-full h-full object-cover rounded-xl shadow-md"
          @click.stop="openModal(card)"
        />
        <CardBack />
      </div>
    </div>

    <TarotCardModal
      v-if="selectedCard"
      :card="selectedCard"
      @close="selectedCard = null"
    />
  </div>
</template>