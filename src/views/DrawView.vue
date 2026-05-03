<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { useDeck } from '@/composables/useDeck'
import { useGsapTicker } from '@/composables/useGsapTicker'
import { useSmoothStop } from '@/composables/useSmoothStop'
import CardBack from '@/components/CardBack.vue'

const fullDeck = ref(useDeck())

const { isStopping, isAnimating, triggerSmoothStop } = useSmoothStop(10)
const isShuffling = ref(false)
const shuffleDirection = ref<'clockwise' | 'anticlockwise' | null>(null)
const hasCollectedToDeck = ref(false)

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

const updatePositions = () => {
  scatteredCards.value.forEach((card) => {
    const dir = shuffleDirection.value === 'clockwise' ? 1 : -1
    card.angle += card.speed * dir
    card.x = Math.cos(card.angle) * card.radius
    card.y = Math.sin(card.angle) * card.radius
  })
}

const { start: startTicker, stop: stopTicker } = useGsapTicker(updatePositions)

function startShuffle(direction: 'clockwise' | 'anticlockwise') {
  if (isShuffling.value || isStopping.value || hasCollectedToDeck.value) return

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

const deckTarget = {
  x: 0,
  y: 0,
}

function collectCardsToDeck() {
  if (isShuffling.value) return

  const sorted = scatteredCards.value.toSorted((a, b) => {
    if (b.y !== a.y) return a.y - b.y
    return a.x - b.x
  })

  sorted.forEach((card, index) => {
    gsap.to(card, {
      x: deckTarget.x,
      y: deckTarget.y,
      rotate: 0,
      duration: 0.5,
      delay: index * 0.03,
      ease: 'power2.inOut',
    })
  })

  hasCollectedToDeck.value = true
}
</script>

<template>
  <div class="relative w-full h-full overflow-hidden bg-gradient-to-b from-purple-950 to-indigo-950">
    <!-- Controls -->
    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-4 flex-wrap justify-center">
      <!-- Shuffle Buttons (only visible before deck collected) -->
      <button
        v-if="!isShuffling && !hasCollectedToDeck"
        :disabled="isStopping"
        @click="() => startShuffle('anticlockwise')"
        class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
      >
        Shuffle Anticlockwise
      </button>
      <button
        v-if="!isShuffling && !hasCollectedToDeck"
        :disabled="isStopping"
        @click="() => startShuffle('clockwise')"
        class="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
      >
        Shuffle Clockwise
      </button>

      <!-- Stop Shuffle -->
      <button
        v-if="isShuffling"
        @click="() => stopShuffle()"
        class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
      >
        Stop Shuffle
      </button>

      <!-- Back to Deck -->
      <button
        v-if="!isShuffling && scatteredCards.length && !hasCollectedToDeck"
        @click="collectCardsToDeck"
        class="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
      >
        Back to Deck
      </button>

      <!-- Proceed / Skip Cut -->
      <button
        v-if="hasCollectedToDeck"
        class="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition"
      >
        Proceed to Cut
      </button>
      <button
        v-if="hasCollectedToDeck"
        class="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
      >
        Skip Cut
      </button>
    </div>

    <!-- Card Orbit -->
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
