<script setup lang="ts">
import CardBack from './CardBack.vue'

const cards = Array.from({ length: 78 }, (_, i) => i + 1)
</script>

<template>
  <div class="w-full h-full p-2">
    <div
      class="grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] gap-1"
    >
      <div
        v-for="card in cards"
        :key="card"
        class="w-full aspect-[2/3] max-w-[4rem] mx-auto"
      >
        <CardBack />
      </div>
    </div>
  </div>
</template>