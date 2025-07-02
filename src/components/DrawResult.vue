<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { type DrawnCard } from '@/composables/useDeck'
import CardModal from '@/components/CardModal.vue'
import CardBack from '@/components/CardBack.vue'
import ChosenOverlay from '@/components/ChosenOverlay.vue'
import { gsap } from 'gsap'

const props = defineProps<{
  cards: DrawnCard[]
}>()

const cardsToRender = ref<DrawnCard[]>([])
const revealedIndexes = ref<number[]>([])
const selectedCard = ref<DrawnCard | null>(null)
const rotateCounts = ref<number[]>([])

watch(
  () => props.cards,
  async (newCards, oldCards) => {
    if (oldCards?.length) {
      await gsap.to('.card', {
        x: 100,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.in'
      })
    }

    cardsToRender.value = []
    revealedIndexes.value = []
    rotateCounts.value = Array(newCards.length).fill(0)
    selectedCard.value = null

    await nextTick()

    cardsToRender.value = newCards

    await nextTick()
    gsap.fromTo(
      '.card',
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out'
      }
    )
  },
  { immediate: true }
)

function revealCard(index: number) {
  if (!revealedIndexes.value.includes(index)) {
    revealedIndexes.value.push(index)
  }
}

function openModal(card: DrawnCard) {
  selectedCard.value = card
}

function rotateOrientation(index: number) {
  rotateCounts.value[index]++

  const cardBackEl = document.querySelector(`.card-back-${index}`) as HTMLElement
  if (cardBackEl) {
    gsap.to(cardBackEl, {
      rotateZ: '+=180',
      duration: 0.6,
      ease: 'power2.inOut'
    })
  }
}

function finalOrientation(card: DrawnCard, index: number): 'upright' | 'reversed' {
  const isRotated = rotateCounts.value[index] % 2 === 1
  return isRotated
    ? card.orientation === 'reversed' ? 'upright' : 'reversed'
    : card.orientation
}
</script>

<template>
  <div class="text-white p-4">
    <div class="mt-10 flex flex-wrap justify-center gap-6 card-deck">
      <div
        v-for="(card, index) in cardsToRender"
        :key="card.id"
        class="card relative w-32 h-48 cursor-pointer flex items-center justify-center"
      >
        <!-- Rotate Orientation Button -->
        <div v-if="!revealedIndexes.includes(index)" class="absolute top-1 left-1 z-10">
          <button
            aria-label="Rotate"
            @click.stop="rotateOrientation(index)"
            class="text-sm bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-300"
          >
            Rotate
          </button>
        </div>

        <!-- Rotate Marker -->
        <div class="absolute bottom-1 right-1 text-lg z-10">
          <span v-if="rotateCounts[index] % 2 === 1">🔁</span>
        </div>

        <!-- Card Display -->
        <div class="w-full h-full" @click="revealCard(index)">
          <!-- Front -->
          <img
            v-if="revealedIndexes.includes(index)"
            :src="card.image"
            :alt="card.name"
            class="w-full h-full object-contain rounded-xl shadow-md hover:ring-4 hover:ring-yellow-300 transition-transform duration-300"
            :class="[
              `card-front-${index}`,
              {
                'rotate-180': finalOrientation(card, index) === 'reversed',
              },
            ]"
            @click.stop="openModal(card)"
          />

          <!-- Back -->
          <CardBack
            v-else
            :class="`card-back-${index} w-full h-full object-contain rounded-xl shadow-md`"
          />

          <!-- Overlay -->
          <ChosenOverlay
            :card="card"
            :list="cardsToRender"
            :index="index"
            :hiddenIndexes="revealedIndexes"
          />
        </div>
      </div>
    </div>

    <!-- Modal -->
    <CardModal
      v-if="selectedCard"
      :card="{
        ...selectedCard,
        orientation: finalOrientation(
          selectedCard,
          cardsToRender.findIndex((c) => c.id === selectedCard?.id)
        ),
      }"
      @close="selectedCard = null"
    />
  </div>
</template>

<style scoped>
.card-front {
  backface-visibility: hidden;
}
</style>
