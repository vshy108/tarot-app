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

const cardRemarks = ref<Record<string, string>>({})
const showRemarkInputs = ref<Record<string, boolean>>({})
const spreadSummary = ref('')
const showSummaryInput = ref(false)

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
    cardRemarks.value = {}
    showRemarkInputs.value = {}
    spreadSummary.value = ''
    showSummaryInput.value = false

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

function saveSpreadToLocalStorage() {
  const payload = {
    cards: cardsToRender.value.map((card, index) => ({
      id: card.id,
      name: card.name,
      orientation: finalOrientation(card, index),
      remark: cardRemarks.value[card.id] || '',
    })),
    summary: spreadSummary.value,
    timestamp: new Date().toISOString(),
  }

  localStorage.setItem('spread-' + payload.timestamp, JSON.stringify(payload))
  alert('Spread saved locally!')
}
</script>

<template>
  <div class="text-white p-4">
    <div class="mt-10 flex flex-wrap justify-center gap-6 card-deck">
      <div
        v-for="(card, index) in cardsToRender"
        :key="card.id"
        class="card relative w-32 h-48 cursor-pointer flex flex-col items-center justify-start"
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
          <CardBack
            v-else
            :class="`card-back-${index} w-full h-full object-contain rounded-xl shadow-md`"
          />
          <ChosenOverlay
            :card="card"
            :list="cardsToRender"
            :index="index"
            :hiddenIndexes="revealedIndexes"
          />
        </div>

        <!-- Remark Button & Input -->
        <div class="mt-2 w-full text-center">
          <button
            class="text-xs bg-blue-500 px-2 py-1 rounded hover:bg-blue-400"
            @click="showRemarkInputs[card.id] = !showRemarkInputs[card.id]"
          >
            {{ showRemarkInputs[card.id] ? "Hide Remark" : "Add Remark" }}
          </button>

          <div v-if="showRemarkInputs[card.id]" class="mt-1">
            <textarea
              v-model="cardRemarks[card.id]"
              class="w-full text-black text-xs p-1 rounded"
              rows="2"
              placeholder="Enter remark for this card"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Spread Summary Input -->
    <div class="mt-10 w-full max-w-md mx-auto text-center">
      <button
        class="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
        @click="showSummaryInput = !showSummaryInput"
      >
        {{ showSummaryInput ? "Hide Summary" : "Add Spread Summary" }}
      </button>

      <div v-if="showSummaryInput" class="mt-3">
        <textarea
          v-model="spreadSummary"
          class="w-full text-black text-sm p-2 rounded"
          rows="3"
          placeholder="Write your overall interpretation of this spread..."
        />
      </div>

      <div v-if="showSummaryInput || Object.keys(cardRemarks).length" class="mt-4">
        <button
          class="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-400"
          @click="saveSpreadToLocalStorage"
        >
          Save Spread to Local DB
        </button>
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
