<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { gsap } from "gsap";
import { useDeck } from "@/composables/useDeck";
import CardBack from "@/components/CardBack.vue";

const fullDeck = ref(useDeck());

const isShuffling = ref(false);
const isStopping = ref(false);
const isAnimating = ref(false); // 🆕 new flag to keep transition class
const shuffleDirection = ref<"clockwise" | "anticlockwise" | null>(null);
let tickerCallback: (() => void) | null = null;
let stopTimeoutId: ReturnType<typeof setTimeout> | null = null

const scatteredCards = ref(
  fullDeck.value.map((card) => {
    const angle = Math.random() * 360 * (Math.PI / 180);
    const radius = 100 + Math.random() * 150;
    const speed = 0.005 + Math.random() * 0.01;
    return {
      ...card,
      angle,
      radius,
      speed,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      rotate: Math.random() * 360 - 180,
    };
  })
);

function startShuffle(direction: "clockwise" | "anticlockwise") {
  if (isShuffling.value || isStopping.value) return;

  stopShuffle(true);

  shuffleDirection.value = direction;
  isShuffling.value = true;
  isAnimating.value = true;

  tickerCallback = () => {
    scatteredCards.value.forEach((card) => {
      card.angle += direction === "clockwise" ? card.speed : -card.speed;
      card.x = Math.cos(card.angle) * card.radius;
      card.y = Math.sin(card.angle) * card.radius;
    });
  };

  gsap.ticker.add(tickerCallback);
}

function stopShuffle(immediate = false) {
  if (!isShuffling.value && !tickerCallback) return;

  isShuffling.value = false;
  shuffleDirection.value = null;

  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  if (!immediate) {
    isStopping.value = true;
    // 🔥 Wait 300ms so CSS transition completes smoothly before removing class
    stopTimeoutId = window.setTimeout(() => {
      isAnimating.value = false;
      isStopping.value = false;
    }, 10);
  } else {
    isAnimating.value = false;
    isStopping.value = false;
  }
}

onUnmounted(() => {
  stopShuffle(true)
  if (stopTimeoutId !== null) {
    clearTimeout(stopTimeoutId)
    stopTimeoutId = null
  }
})
</script>

<template>
  <div
    class="relative w-full h-full overflow-hidden bg-gradient-to-b from-purple-950 to-indigo-950"
  >
    <!-- Controls -->
    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-4">
      <button
        v-if="!isShuffling"
        :disabled="isStopping"
        @click="() => startShuffle('anticlockwise')"
        class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
      >
        Shuffle Anticlockwise
      </button>
      <button
        v-if="!isShuffling"
        :disabled="isStopping"
        @click="() => startShuffle('clockwise')"
        class="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
      >
        Shuffle Clockwise
      </button>
      <button
        v-if="isShuffling"
        @click="() => stopShuffle()"
        class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
      >
        Stop Shuffle
      </button>
    </div>

    <!-- Card orbit area -->
    <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div
        v-for="card in scatteredCards"
        :key="card.id"
        :class="[
          'absolute w-20 h-32',
          isAnimating ? 'transition-transform duration-10' : '', // duration-300 caused the card change location after stop
        ]"
        :style="{
          transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`,
        }"
      >
        <CardBack />
      </div>
    </div>
  </div>
</template>
