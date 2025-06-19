<script setup lang="ts">
import { ref } from 'vue'
import { useDeck } from '@/composables/useDeck'
import CardBack from '@/components/CardBack.vue'

// Full deck of 78 cards
const fullDeck = ref(useDeck())

// Create scattered layout with random transforms
const scatteredCards = ref(
  fullDeck.value.map((card) => ({
    ...card,
    x: Math.random() * 200 - 100,         // -100px to +100px
    y: Math.random() * 100 - 50,          // -50px to +50px
    rotate: Math.random() * 360 - 180,    // -180deg to +180deg
  }))
)
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-950 to-indigo-950 p-4">
    <div class="absolute inset-0">
      <div
        v-for="(card, index) in scatteredCards"
        :key="card.id"
        class="absolute w-20 h-32 transition-transform duration-300"
        :style="{
          transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`
        }"
      >
        <CardBack />
      </div>
    </div>
  </div>
</template>