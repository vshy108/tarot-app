<script setup lang="ts">
import { ref, watch } from 'vue'
import { type DrawnCard } from '@/composables/useDeck'
import CardModal from '@/components/CardModal.vue'
import CardBack from '@/components/CardBack.vue'
import ChosenOverlay from "@/components/ChosenOverlay.vue";
import { gsap } from 'gsap';

const props = defineProps<{
  cards: DrawnCard[]
}>()

const revealedIndexes = ref<number[]>([])
const selectedCard = ref<DrawnCard | null>(null)
const rotateCounts = ref<number[]>([])

watch(
  () => props.cards,
  (newCards) => {
    revealedIndexes.value = []
    rotateCounts.value = Array(newCards.length).fill(0)
    selectedCard.value = null
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
  const card = props.cards[index]
  if (card) {
    card.orientation = card.orientation === 'upright' ? 'reversed' : 'upright'
  }
}

function finalOrientation(card: DrawnCard, index: number): 'upright' | 'reversed' {
  const isRotated = rotateCounts.value[index] % 2 === 1
  if (isRotated) {
    if (card.orientation === 'reversed') {
      return 'upright'
    }
    return 'reversed'
  }
  return card.orientation
}
</script>

<template>
  <div class="min-h-full text-white">
    <div class="mt-10 flex justify-center gap-6 card-deck">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="card relative w-32 h-48 cursor-pointer flex items-center justify-center"
      >
        <!-- Rotate Orientation Button -->
        <div v-if="!revealedIndexes.includes(index)" class="absolute top-1 left-1 z-10">
          <button
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

        <!-- Card -->
        <div class="w-full h-full" @click="revealCard(index)">
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
          <CardBack v-else :class="`card-back-${index}`" />
          <ChosenOverlay
            :card="card"
            :list="cards"
            :index="index"
            :hiddenIndexes="revealedIndexes"
          />
        </div>
      </div>
    </div>

    <CardModal
      v-if="selectedCard"
      :card="{
        ...selectedCard,
        orientation: finalOrientation(
          selectedCard,
          cards.findIndex((c) => c.id === selectedCard?.id)
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
