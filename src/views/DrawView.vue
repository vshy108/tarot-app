<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { type DrawnCard, useDeck } from '@/composables/useDeck'
import { gsap } from 'gsap'
import CardModal from '@/components/CardModal.vue'
import CardBack from '@/components/CardBack.vue'

const fullDeck = ref(useDeck())
const drawnCards = ref<DrawnCard[]>([])
const revealedIndexes = ref<number[]>([])
const selectedCard = ref<DrawnCard | null>(null)
const rotateCounts = ref<number[]>([])

const numberOfCardsToDraw = 3

function drawCards() {
  drawnCards.value = []
  revealedIndexes.value = []
  selectedCard.value = null
  rotateCounts.value = []

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
      rotateCounts.value = Array(numberOfCardsToDraw).fill(0)

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
    gsap.fromTo(
      `.card-front-${index}`,
      { rotateY: 90 },
      { rotateY: 0, duration: 0.4, ease: 'power2.out' }
    )
  }
}

function openModal(card: DrawnCard) {
  selectedCard.value = card
}

function rotateOrientation(index: number) {
  rotateCounts.value[index]++

  // Animate the card back before reveal
  const cardBackEl = document.querySelector(`.card-back-${index}`) as HTMLElement
  if (cardBackEl) {
    gsap.to(cardBackEl, {
      rotateZ: '+=180',
      duration: 0.6,
      ease: 'power2.inOut'
    })
  }

  const card = drawnCards.value[index]
  if (card) {
    card.orientation = card.orientation === 'upright' ? 'reversed' : 'upright'
  }
}

function finalOrientation(card: DrawnCard, index: number): 'upright' | 'reversed' {
  const isRotated = rotateCounts.value[index] % 2 === 1
  return (card.orientation === 'reversed') !== isRotated ? 'upright' : 'reversed'
}
</script>

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
        class="card relative w-32 h-48 cursor-pointer flex items-center justify-center"
      >
        <!-- Rotate Orientation Button (before reveal) -->
        <div
          v-if="!revealedIndexes.includes(index)"
          class="absolute top-1 left-1 z-10"
        >
          <button
            @click.stop="rotateOrientation(index)"
            class="text-sm bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-300"
          >
            Rotate
          </button>
        </div>

        <!-- Rotate Marker (shown if rotated an odd number of times) -->
        <div class="absolute bottom-1 right-1 text-lg z-10">
          <span v-if="rotateCounts[index] % 2 === 1">🔁</span>
        </div>

        <!-- Card -->
        <div class="w-full h-full" @click="revealCard(index)">
          <img
            v-if="revealedIndexes.includes(index)"
            :src="card.image"
            :alt="card.name"
            class="w-full h-full object-contain rounded-xl shadow-md hover:ring-4 hover:ring-yellow-300 transition-transform duration-300 card-front"
            :class="[
              `card-front-${index}`,
              {
                'rotate-180': finalOrientation(card, index) === 'reversed'
              }
            ]"
            @click.stop="openModal(card)"
          />
          <CardBack
            v-else
            :class="`card-back-${index}`"
          />
        </div>
      </div>
    </div>

    <!-- Modal with resolved orientation -->
    <CardModal
      v-if="selectedCard"
      :card="{
        ...selectedCard,
        orientation:
          finalOrientation(
            selectedCard,
            drawnCards.findIndex(c => c.id === selectedCard?.id)
          )
      }"
      @close="selectedCard = null"
    />
  </div>
</template>

<style scoped>
.card {
  /* no perspective needed for 2D */
}
.card-front {
  backface-visibility: hidden;
  transform-style: flat;
}
</style>
