<template>
  <div
    class="h-screen flex flex-col bg-gradient-to-b from-purple-950 to-indigo-950 text-white"
  >
    <!-- Navigation Header -->
    <header class="bg-purple-900 shadow-md z-10">
      <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <RouterLink
          to="/"
          class="flex items-center space-x-2 text-xl font-bold tracking-wide hover:text-pink-400 transition-transform hover:scale-105 group"
        >
          <span class="animate-pulse">🔮</span>
          <span
            class="relative after:absolute after:inset-0 after:from-white/0 after:via-white/40 after:to-white/0 after:translate-x-[-100%] group-hover:after:animate-shimmer"
          >
            Tarot App
          </span>
        </RouterLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex space-x-6 text-sm md:text-base">
          <RouterLink
            to="/"
            class="hover:text-pink-400"
            active-class="text-pink-500 font-semibold"
            exact-active-class="text-pink-500 font-semibold"
            >Home</RouterLink
          >
          <RouterLink
            to="/draw"
            class="hover:text-pink-400"
            active-class="text-pink-500 font-semibold"
            >Draw</RouterLink
          >
          <RouterLink
            to="/simple-draw"
            class="hover:text-pink-400"
            active-class="text-pink-500 font-semibold"
            >Simple Draw</RouterLink
          >
          <RouterLink
            to="/cards"
            class="hover:text-pink-400"
            active-class="text-pink-500 font-semibold"
            >All Cards</RouterLink
          >
        </nav>

        <!-- Mobile Hamburger -->
        <button @click="isOpen = !isOpen" class="md:hidden focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!isOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Dropdown -->
      <div v-if="isOpen" class="md:hidden px-4 pb-4 space-y-2">
        <RouterLink to="/" class="block hover:text-pink-400" @click="isOpen = false">
          Home
        </RouterLink>
        <RouterLink to="/draw" class="block hover:text-pink-400" @click="isOpen = false">
          Draw
        </RouterLink>
        <RouterLink
          to="/simple-draw"
          class="block hover:text-pink-400"
          @click="isOpen = false"
        >
          Simple Draw
        </RouterLink>
        <RouterLink to="/cards" class="block hover:text-pink-400" @click="isOpen = false">
          All Cards
        </RouterLink>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-grow flex">
      <RouterView class="flex-grow" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isOpen = ref(false);
</script>
