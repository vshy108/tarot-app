<script setup lang="ts">
import { useDeck, type CardWithId  } from "@/composables/useDeck";
import { Card } from "@/data/deck";
import { ref, computed, onMounted } from "vue";
import CardModal from "@/components/CardModal.vue";

const deck = useDeck();

const hoveredCard = ref<null | CardWithId>(null)
const isModalOpen = ref(false);

const majorArcana = computed(() => deck.filter((card) => card.type === "Major"));

const minorArcanaBySuit = computed(() => {
  const suits = ["Cups", "Swords", "Pentacles", "Wands"] as const;
  return Object.fromEntries(
    suits.map((suit) => [
      suit,
      deck.filter((card) => card.type === "Minor" && card.suit === suit),
    ])
  );
});

function openCardModal(card: CardWithId) {
  hoveredCard.value = card;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center py-10 min-h-full bg-gradient-to-b from-purple-950 to-indigo-950"
  >
    <h2 class="text-4xl font-semibold mb-2">Major Arcana</h2>
    <!-- Top Half Arc for Major Arcana -->
    <div
      class="w-full flex flex-wrap justify-center gap-x-2 gap-y-6 mt-10 mb-14 px-4 relative"
    >
      <div
        v-for="(card, index) in majorArcana"
        :key="card.id"
        class="w-20 h-32 transition-all duration-500 ease-out transform hover:scale-125 hover:z-50 cursor-pointer"
        :style="{
          transform: `translateY(${
            Math.sin((index / (majorArcana.length - 1)) * Math.PI) * 40
          }px)`,
        }"
        @click="openCardModal(card)"
      >
        <img
          :src="card.image"
          :alt="card.name"
          class="w-full h-full object-contain rounded shadow-md transition-all duration-300 box-border hover:border-4 hover:border-yellow-400"
        />
      </div>
    </div>

    <h2 class="text-4xl font-semibold mb-2">Minor Arcana</h2>

    <!-- Grid for Minor Arcana -->
    <div class="space-y-8 px-4">
      <div v-for="(cards, suit) in minorArcanaBySuit" :key="suit">
        <h2 class="text-xl font-semibold mb-2">{{ suit }}</h2>
        <div
          class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 xl:grid-cols-14 gap-2"
        >
          <div
            v-for="card in cards"
            :key="card.id"
            class="w-20 h-32 transition-transform duration-300 transform hover:scale-125 cursor-pointer"
            @click="openCardModal(card)"
          >
            <img
              :src="card.image"
              :alt="card.name"
              class="w-full h-full object-contain rounded shadow-md transition-all duration-300 box-border hover:border-4 hover:border-yellow-400"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Card Details -->
    <CardModal
      v-if="isModalOpen && hoveredCard"
      :card="hoveredCard"
      @close="closeModal"
    />
  </div>
</template>
