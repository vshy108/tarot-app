<script setup lang="ts">
import { useTarotDeck } from '@/composables/useTarotDeck'

const cardImages = useTarotDeck()
</script>

<template>
  <div class="grid grid-cols-6 gap-4 p-4">
    <div v-for="(img, index) in cardImages" :key="index" class="w-24 h-36">
      <img :src="img" alt="Tarot card" class="w-full h-full object-cover rounded shadow-md" />
    </div>
  </div>
</template>