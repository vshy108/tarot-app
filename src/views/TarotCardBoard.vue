<script setup lang="ts">
import { useTarotDeck } from '@/composables/useTarotDeck'
import { TarotCard } from '@/data/tarotDeck'
import { ref, computed, onMounted } from 'vue'

const deck = useTarotDeck()

const hoveredCard = ref<null | TarotCard>(null)
const isModalOpen = ref(false)

const majorArcana = computed(() =>
  deck.filter((card) => card.type === 'Major')
)

const minorArcanaBySuit = computed(() => {
  const suits = ['Cups', 'Swords', 'Pentacles', 'Wands'] as const
  return Object.fromEntries(
    suits.map((suit) => [
      suit,
      deck.filter((card) => card.type === 'Minor' && card.suit === suit),
    ])
  )
})

function openCardModal(card: TarotCard) {
  hoveredCard.value = card
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-10">
    <h2 class="text-4xl font-semibold mb-2">Major Arcana</h2>
    <!-- Top Half Arc for Major Arcana -->
    <div class="w-full flex flex-wrap justify-center gap-x-2 gap-y-6 mt-10 mb-14 px-4 relative">
      <div
        v-for="(card, index) in majorArcana"
        :key="card.id"
        class="w-20 h-32 transition-all duration-500 ease-out transform hover:scale-125 hover:z-50 cursor-pointer"
        :style="{
          transform: `translateY(${Math.sin((index / (majorArcana.length - 1)) * Math.PI) * 40}px)`
        }"
        @click="openCardModal(card)"
      >
        <img
          :src="card.image"
          :alt="card.name"
          class="w-full h-full object-cover rounded shadow-md transition-all duration-300 box-border hover:border-4  hover:border-yellow-400"
        />
      </div>
    </div>

    <!-- Grid for Minor Arcana -->
    <div class="space-y-8 px-4">
      <div v-for="(cards, suit) in minorArcanaBySuit" :key="suit">
        <h2 class="text-xl font-semibold mb-2">{{ suit }}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 xl:grid-cols-14 gap-2">
          <div
            v-for="card in cards"
            :key="card.id"
            class="w-20 h-32 transition-transform duration-300 transform hover:scale-125 cursor-pointer"
            @click="openCardModal(card)"
          >
            <img
              :src="card.image"
              :alt="card.name"
              class="w-full h-full object-cover rounded shadow-md transition-all duration-300 box-border hover:border-4  hover:border-yellow-400"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Card Details -->
    <div
      v-if="isModalOpen && hoveredCard"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white text-black rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
          @click="closeModal"
          aria-label="Close"
        >
          ×
        </button>
        <h2 class="text-2xl font-bold mb-2">{{ hoveredCard.name }}</h2>
        <img
          :src="hoveredCard.image"
          :alt="hoveredCard.name"
          class="w-full max-h-[60vh] object-contain rounded mb-4"
        />
        <p class="text-sm">
          {{ hoveredCard.nameZh || 'No description available.' }}
        </p>
      </div>
    </div>
  </div>
</template>
