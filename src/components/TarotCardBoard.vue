<script setup lang="ts">
import { useTarotDeck } from '@/composables/useTarotDeck'

const cardImages = useTarotDeck()
</script>

<template>
  <div class="grid grid-cols-6 gap-4 p-4">
    <div
      v-for="card in cardImages"
      :key="card.id"
      class="w-24 h-36"
    >
      <img
        :src="card.image"
        :alt="card.name"
        class="w-full h-full object-cover rounded shadow-md"
      />
    </div>
  </div>
</template>