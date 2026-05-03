<template>
  <div class="flex flex-col items-center justify-center text-center py-20 px-6">
    <h1 class="text-4xl md:text-5xl font-bold text-pink-300 mb-6">
      Welcome to the Tarot Journey
    </h1>

    <p class="max-w-2xl text-lg text-white/80 mb-10 leading-relaxed">
      Explore the mysteries of the Tarot. Whether you're seeking clarity, guidance, or
      inspiration, let the cards reveal what the universe has in store for you.
    </p>

    <div class="flex flex-col sm:flex-row gap-4">
      <RouterLink
        to="/draw"
        class="inline-block bg-pink-600 hover:bg-pink-500 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
      >
        🌟 Begin Advanced Draw Journey
      </RouterLink>

      <RouterLink
        to="/simple-draw"
        class="inline-block bg-purple-600 hover:bg-purple-500 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
      >
        🃏 Simple 3 Card Draw
      </RouterLink>
    </div>

    <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
      <div class="bg-white/10 border border-white/20 p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-pink-200 mb-2">✨ About the Tarot</h2>
        <p class="text-white/70 text-sm">
          The Tarot is a deck of 78 cards, each rich with symbolism and meaning. It's used
          for divination, reflection, and personal insight.
        </p>
      </div>
      <div class="bg-white/10 border border-white/20 p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-pink-200 mb-2">🃏 Major & Minor Arcana</h2>
        <p class="text-white/70 text-sm">
          The 22 Major Arcana reveal spiritual lessons and life themes. The 56 Minor
          Arcana explore day-to-day experiences.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Static content, no logic required here
</script>
