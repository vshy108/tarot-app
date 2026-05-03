<script setup lang="ts">
import { useTarotDeck } from '@/composables/useTarotDeck'
import { computed } from 'vue'

const deck = useTarotDeck()

const majorArcana = computed(() =>
  deck.filter((card) => card.type === 'Major')
)

const minorArcanaBySuit = computed(() => {
  const suits = ['Cups', 'Swords', 'Pentacles', 'Wands'] as const
  return Object.fromEntries(
    suits.map((suit) => [
      suit,
      deck.filter((card) => card.type === 'Minor' && card.suit === suit),
    ])
  )
})

// Get radial position for each card
function getCardStyle(index: number, total: number): Record<string, string> {
  const radius = 200
  const angle = (2 * Math.PI * index) / total
  const centerX = 250
  const centerY = 250
  const cardWidth = 80
  const cardHeight = 128

  const x = centerX + radius * Math.cos(angle) - cardWidth / 2
  const y = centerY + radius * Math.sin(angle) - cardHeight / 2

  return {
    left: `${x}px`,
    top: `${y}px`
  }
}
</script>

<template>
<!-- Circle layout -->
<div class="relative w-[500px] h-[500px] mx-auto my-10">
  <div
    v-for="(card, index) in majorArcana"
    :key="card.id"
    class="absolute w-20 h-32"
    :style="getCardStyle(index, majorArcana.length)"
  >
    <img
      :src="card.image"
      :alt="card.name"
      class="w-full h-full object-cover rounded shadow-md"
    />
  </div>
</div>

<!-- Grid for Minor Arcana -->
<div class="space-y-8">
  <div v-for="(cards, suit) in minorArcanaBySuit" :key="suit">
    <h2 class="text-xl font-semibold text-white mb-2">{{ suit }}</h2>
    <div class="grid grid-cols-14 gap-2">
      <div
        v-for="card in cards"
        :key="card.id"
        class="w-20 h-32"
      >
        <img
          :src="card.image"
          :alt="card.name"
          class="w-full h-full object-cover rounded shadow-md"
        />
      </div>
    </div>
  </div>
</div>
</template>