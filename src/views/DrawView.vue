<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDeck } from '@/composables/useDeck'
import CardBack from '@/components/CardBack.vue'
import { gsap } from 'gsap'

const fullDeck = ref(useDeck())
const isShuffling = ref(false)
const rotationDirection = ref<'clockwise' | 'anticlockwise' | null>(null)
const angle = ref(0)
const scatterCards = ref<any[]>([])

// Compute the scatter layout centered on screen
const scatterCardsInCircle = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) / 3 // reasonable spread based on smallest dimension

  scatterCards.value = fullDeck.value.map((card, index, array) => {
    const angle = (index / array.length) * Math.PI * 2
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    return {
      ...card,
      x,
      y,
      baseAngle: angle,
      radius,
    }
  })
}

function shuffle(direction: 'clockwise' | 'anticlockwise') {
  rotationDirection.value = direction
  isShuffling.value = true
  animateShuffle()
}

let animationFrame: number
function animateShuffle() {
  const width = window.innerWidth
  const height = window.innerHeight
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) / 3

  function animate() {
    angle.value += rotationDirection.value === 'clockwise' ? 0.01 : -0.01

    scatterCards.value = scatterCards.value.map((card, index) => {
      const currentAngle = card.baseAngle + angle.value
      const cardRadius = card.radius ?? radius
      return {
        ...card,
        x: centerX + Math.cos(currentAngle) * cardRadius,
        y: centerY + Math.sin(currentAngle) * cardRadius,
      }
    })

    animationFrame = requestAnimationFrame(animate)
  }

  cancelAnimationFrame(animationFrame)
  animate()
}

function stopShuffle() {
  cancelAnimationFrame(animationFrame)
  isShuffling.value = false
  rotationDirection.value = null
}

function skipStep() {
  alert('Next step placeholder')
}

onMounted(() => {
  scatterCardsInCircle()
})
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-purple-950 to-indigo-950">
    <!-- Action Buttons -->
    <div class="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-4">
      <template v-if="!isShuffling">
        <button
          @click="shuffle('anticlockwise')"
          class="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-xl shadow"
        >
          🔄 Anticlockwise
        </button>
        <button
          @click="shuffle('clockwise')"
          class="bg-pink-500 hover:bg-pink-400 text-white font-semibold px-4 py-2 rounded-xl shadow"
        >
          🔃 Clockwise
        </button>
      </template>

      <template v-else>
        <button
          @click="stopShuffle"
          class="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl shadow"
        >
          ⏹️ Stop
        </button>
      </template>

      <button
        @click="skipStep"
        class="bg-white/20 hover:bg-white/40 text-white font-semibold px-4 py-2 rounded-xl shadow border border-white"
      >
        ⏭️ Skip
      </button>
    </div>

    <!-- Card Scatter Centered on Screen -->
    <div class="absolute inset-0">
      <div
        v-for="card in scatterCards"
        :key="card.id"
        class="absolute w-20 h-32 transition-transform duration-300"
        :style="{
          transform: `translate(${card.x - 40}px, ${card.y - 64}px)`
        }"
      >
        <CardBack />
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: all 0.3s ease;
}
</style>
