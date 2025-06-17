<script setup lang="ts">
import CardBack from './CardBack.vue'

const cards = Array.from({ length: 78 }, (_, i) => i + 1)
</script>

<template>
  <div class="grid grid-cols-6 gap-4 p-4">
    <div
      v-for="card in cards"
      :key="card"
      class="w-24 h-36"
    >
      <CardBack />
    </div>
  </div>
</template>