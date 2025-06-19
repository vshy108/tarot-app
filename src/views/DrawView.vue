<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useDeck } from '@/composables/useDeck'
import { useSmoothStop } from '@/composables/useSmoothStop'
import { useGsapTicker } from '@/composables/useGsapTicker'
import CardBack from '@/components/CardBack.vue'

const fullDeck = ref(useDeck())

const { isStopping, isAnimating, triggerSmoothStop } = useSmoothStop(10)
const isShuffling = ref(false)
const shuffleDirection = ref<'clockwise' | 'anticlockwise' | null>(null)

const scatteredCards = ref(
  fullDeck.value.map((card) => {
    const angle = Math.random() * 360 * (Math.PI / 180)
    const radius = 100 + Math.random() * 150
    const speed = 0.005 + Math.random() * 0.01
    return {
      ...card,
      angle,
      radius,
      speed,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      rotate: Math.random() * 360 - 180,
    }
  })
)

// Define ticker logic once
const updatePositions = () => {
  scatteredCards.value.forEach((card) => {
    const dir = shuffleDirection.value === 'clockwise' ? 1 : -1
    card.angle += card.speed * dir
    card.x = Math.cos(card.angle) * card.radius
    card.y = Math.sin(card.angle) * card.radius
  })
}

// Reuse gsap ticker composable
const { start: startTicker, stop: stopTicker } = useGsapTicker(updatePositions)

function startShuffle(direction: 'clockwise' | 'anticlockwise') {
  if (isShuffling.value || isStopping.value) return

  stopShuffle(true)
  shuffleDirection.value = direction
  isShuffling.value = true
  startTicker()
}

function stopShuffle(immediate = false) {
  if (!isShuffling.value) return

  isShuffling.value = false
  shuffleDirection.value = null
  stopTicker()

  if (!immediate) {
    triggerSmoothStop()
  } else {
    isAnimating.value = false
  }
}

onUnmounted(() => stopShuffle(true))
</script>

<template>
  <div class="relative w-full h-full overflow-hidden bg-gradient-to-b from-purple-950 to-indigo-950">
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
          isAnimating ? 'transition-transform duration-10' : ''
        ]"
        :style="{
          transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`
        }"
      >
        <CardBack />
      </div>
    </div>
  </div>
</template>
