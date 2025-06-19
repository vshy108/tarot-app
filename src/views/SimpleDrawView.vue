<script setup lang="ts">
import { ref } from 'vue'
import { useDeck, type DrawnCard } from '@/composables/useDeck'
import DrawResult from '@/components/DrawResult.vue'

const fullDeck = ref(useDeck())
const drawnCards = ref<DrawnCard[]>([])
const numberOfCardsToDraw = 3

function drawCards() {
  // Clear previous results
  drawnCards.value = []

  // Shuffle and pick cards
  const shuffled = [...fullDeck.value].sort(() => Math.random() - 0.5)
  drawnCards.value = shuffled.slice(0, numberOfCardsToDraw).map(card => ({
    ...card,
    orientation: Math.random() > 0.5 ? 'upright' : 'reversed'
  }))
}
</script>

<template>
  <div class="min-h-full bg-gradient-to-b from-purple-800 to-indigo-900 text-white p-8">
    <h1 class="text-3xl font-bold text-center mb-8">Simple Draw</h1>

    <div class="flex justify-center">
      <button
        @click="drawCards"
        class="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-lg shadow-lg transition-all"
      >
        Shuffle & Draw {{ numberOfCardsToDraw }} Cards
      </button>
    </div>

    <!-- Render reusable result view -->
    <DrawResult
      v-if="drawnCards.length"
      :cards="drawnCards"
    />
  </div>
</template>
