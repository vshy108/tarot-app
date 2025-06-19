<script setup lang="ts">
import { ref } from 'vue'
import { useDeck } from '@/composables/useDeck'
import CardBack from '@/components/CardBack.vue'

const fullDeck = ref(useDeck())

const scatteredCards = ref(
  fullDeck.value.map((card) => ({
    ...card,
    x: Math.random() * 500 - 250,
    y: Math.random() * 300 - 150,
    rotate: Math.random() * 360 - 180,
  }))
)
</script>

<template>
  <!-- Use h-full so it fills remaining space inside App.vue layout -->
  <div class="relative w-full h-full overflow-hidden bg-gradient-to-b from-purple-950 to-indigo-950">
    <!-- Center the scatter zone -->
    <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div
        v-for="card in scatteredCards"
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