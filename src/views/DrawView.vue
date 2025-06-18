<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { type DrawnCard, useDeck } from '@/composables/useDeck'
import { gsap } from 'gsap'
import CardModal from '@/components/CardModal.vue'
import CardBack from '../components/CardBack.vue'

const fullDeck = ref(useDeck())
const drawnCards = ref<DrawnCard[]>([])
const revealedIndexes = ref<number[]>([])
const selectedCard = ref<DrawnCard | null>(null)

const numberOfCardsToDraw = 3

function drawCards() {
  drawnCards.value = []
  revealedIndexes.value = []
  selectedCard.value = null

  gsap.to('.card-deck', {
    rotateY: 20,
    repeat: 3,
    yoyo: true,
    duration: 0.2,
    ease: 'power1.inOut',
    onComplete: () => {
      const shuffled = [...fullDeck.value].sort(() => Math.random() - 0.5)
      drawnCards.value = shuffled.slice(0, numberOfCardsToDraw).map(card => ({
        ...card,
        orientation: Math.random() > 0.5 ? 'upright' : 'reversed'
      }))

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
  })
}

function revealCard(index: number) {
  if (!revealedIndexes.value.includes(index)) {
    revealedIndexes.value.push(index)
  }
}

function openModal(card: DrawnCard) {
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
    <h1 class="text-3xl font-bold text-center mb-8">Draw Your Cards</h1>

    <div class="flex justify-center">
      <button
        @click="drawCards"
        class="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-lg shadow-lg transition-all"
      >
        Shuffle & Draw 3 Cards
      </button>
    </div>

    <div class="mt-10 flex justify-center gap-6 card-deck">
      <div
        v-for="(card, index) in drawnCards"
        :key="card.id"
        class="card relative w-32 h-48 cursor-pointer transition-transform duration-300 hover:scale-105"
        @click="revealCard(index)"
      >
        <img
          v-if="revealedIndexes.includes(index)"
          :src="card.image"
          alt="Card"
          class="w-full h-full object-cover rounded-xl shadow-md"
          :class="{ 'rotate-180': card.orientation === 'reversed' }"
          @click.stop="openModal(card)"
        />
        <CardBack v-else />
      </div>
    </div>

    <CardModal v-if="selectedCard" :card="selectedCard" @close="selectedCard = null" />
  </div>
</template>
