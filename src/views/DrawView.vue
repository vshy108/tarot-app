<script setup lang="ts">
import { ref, onUnmounted, computed, watch, onMounted } from "vue";
import { gsap } from "gsap";
import { useDeck } from "@/composables/useDeck";
import { useGsapTicker } from "@/composables/useGsapTicker";
import { useSmoothStop } from "@/composables/useSmoothStop";
import CardBack from "@/components/CardBack.vue";

const fullDeck = ref(useDeck());

const { isStopping, isAnimating, triggerSmoothStop } = useSmoothStop(10);
const isShuffling = ref(false);
const shuffleDirection = ref<"clockwise" | "anticlockwise" | null>(null);
const hasCollectedToDeck = ref(false);
const hasCutFinished = ref(false);
const spreadMode = ref<"1" | "3" | null>(null);
const userQuestion = ref("");
const showQuestionInput = ref(false);
const chosenCards = ref<any[]>([]);

const cutStart = ref(1);
const cutEnd = ref(1);
const cutCount = ref(0);
const cutPosition = ref<"top" | "bottom">("top");

const showCutToast = ref(false);
const cutToastMessage = ref("");
function showCutInfoToast(start: number, end: number, position: string) {
  cutToastMessage.value = `Cut cards ${start}–${end} to the ${position}`;
  showCutToast.value = true;
  setTimeout(() => {
    showCutToast.value = false;
  }, 3000);
}

const isCutting = ref(false);
let cutCooldownTimer: ReturnType<typeof setTimeout> | null = null;

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
      isReversed: false,
      revealed: false,
    };
  })
);

const updatePositions = () => {
  scatteredCards.value.forEach((card) => {
    const dir = shuffleDirection.value === "clockwise" ? 1 : -1;
    card.angle += card.speed * dir;
    card.x = Math.cos(card.angle) * card.radius;
    card.y = Math.sin(card.angle) * card.radius;
  });
};

const { start: startTicker, stop: stopTicker } = useGsapTicker(updatePositions);

function startShuffle(direction: "clockwise" | "anticlockwise") {
  if (isShuffling.value || isStopping.value || hasCollectedToDeck.value) return;
  stopShuffle(true);
  shuffleDirection.value = direction;
  isShuffling.value = true;
  startTicker();
}

function stopShuffle(immediate = false) {
  if (!isShuffling.value) return;
  isShuffling.value = false;
  shuffleDirection.value = null;
  stopTicker();
  if (!immediate) {
    triggerSmoothStop();
  } else {
    isAnimating.value = false;
  }
}

onMounted(() => {
  updatePositions();
});

onUnmounted(() => {
  stopShuffle(true);
  if (cutCooldownTimer) clearTimeout(cutCooldownTimer);
});

const deckTarget = { x: 0, y: 0 };

function collectCardsToDeck() {
  if (isShuffling.value) return;

  const sorted = scatteredCards.value.toSorted((a, b) => {
    if (b.y !== a.y) return a.y - b.y;
    return a.x - b.x;
  });

  sorted.forEach((card, index) => {
    gsap.to(card, {
      x: deckTarget.x,
      y: deckTarget.y,
      rotate: 0,
      duration: 0.5,
      delay: index * 0.03,
      ease: "power2.inOut",
    });
  });

  hasCollectedToDeck.value = true;
}

function cutDeck() {
  if (isCutting.value) return;
  isCutting.value = true;

  const rawStart = Math.max(1, Math.min(78, cutStart.value));
  const rawEnd = Math.max(1, Math.min(78, cutEnd.value));
  const from = Math.min(rawStart, rawEnd);
  const to = Math.max(rawStart, rawEnd);

  const sorted = scatteredCards.value.toSorted((a, b) => {
    if (b.y !== a.y) return a.y - b.y;
    return a.x - b.x;
  });

  const portion = sorted.slice(from - 1, to);
  const rest = sorted.slice(0, from - 1).concat(sorted.slice(to));

  scatteredCards.value =
    cutPosition.value === "top" ? [...portion, ...rest] : [...rest, ...portion];

  cutCount.value += 1;
  showCutInfoToast(from, to, cutPosition.value);

  if (cutCooldownTimer) clearTimeout(cutCooldownTimer);
  cutCooldownTimer = setTimeout(() => {
    isCutting.value = false;
    cutCooldownTimer = null;
  }, 1000);
}

function finishCut() {
  if (cutCooldownTimer) clearTimeout(cutCooldownTimer);
  hasCutFinished.value = true;
}

function chooseCard(card: any) {
  if (chosenCards.value.includes(card)) return;
  if (spreadMode.value === "1" && chosenCards.value.length >= 1) return;
  if (spreadMode.value === "3" && chosenCards.value.length >= 3) return;
  chosenCards.value.push(card);
}

function toggleOrientation(card: any) {
  card.isReversed = !card.isReversed;
}
</script>

<template>
  <div
    class="relative w-full h-full overflow-hidden bg-gradient-to-b from-purple-950 to-indigo-950"
  >
    <div
      v-if="!hasCutFinished"
      class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-wrap gap-4 justify-center"
    >
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
      <button
        v-if="isShuffling"
        @click="() => stopShuffle()"
        class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
      >
        Stop Shuffle
      </button>
      <button
        v-if="!isShuffling && scatteredCards.length && !hasCollectedToDeck"
        @click="collectCardsToDeck"
        class="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
      >
        Back to Deck
      </button>
      <template v-if="hasCollectedToDeck">
        <input
          type="number"
          v-model.number="cutStart"
          min="1"
          max="78"
          class="w-20 px-2 py-1 rounded border"
          placeholder="Start"
        />
        <input
          type="number"
          v-model.number="cutEnd"
          min="1"
          max="78"
          class="w-20 px-2 py-1 rounded border"
          placeholder="End"
        />
        <select v-model="cutPosition" class="px-2 py-1 rounded border">
          <option value="top">To Top</option>
          <option value="bottom">To Bottom</option>
        </select>
        <button
          :disabled="isCutting"
          @click="cutDeck"
          class="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition disabled:opacity-50 flex items-center gap-2"
        >
          <svg
            v-if="isCutting"
            class="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>{{ isCutting ? "Cutting..." : `Cut (${cutCount})` }}</span>
        </button>
        <button
          @click="finishCut"
          class="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
        >
          Done Cut
        </button>
      </template>
    </div>

    <div
      v-if="hasCutFinished && !spreadMode"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center text-white text-center space-y-4"
    >
      <p>Choose your spread:</p>
      <button
        @click="
          () => {
            spreadMode = '1';
            showQuestionInput = true;
          }
        "
        class="px-4 py-2 bg-blue-600 rounded-xl"
      >
        1 Card Spread
      </button>
      <button
        @click="
          () => {
            spreadMode = '3';
            showQuestionInput = true;
          }
        "
        class="px-4 py-2 bg-blue-600 rounded-xl"
      >
        3 Cards Spread
      </button>
    </div>

    <div
      v-if="spreadMode && showQuestionInput && !userQuestion"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center text-white space-y-2"
    >
      <p class="text-center">Enter your question:</p>
      <input
        v-model="userQuestion"
        placeholder="What is your question?"
        class="w-96 px-4 py-2 rounded-xl text-black"
      />
    </div>

        <!-- Scattered display before Done Cut -->
    <div
      v-if="!hasCutFinished"
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div
        v-for="card in scatteredCards"
        :key="card.id"
        class="absolute w-20 h-32"
        :style="{
          transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`,
        }"
      >
        <CardBack />
      </div>
    </div>

    <div
      v-if="spreadMode && userQuestion && hasCutFinished"
      class="absolute inset-0 grid grid-cols-6 gap-[2px] p-2 z-0"
    >
      <div
        v-for="card in scatteredCards"
        :key="card.id"
        @click="() => chooseCard(card)"
        class="relative cursor-pointer hover:scale-105 transition-transform"
      >
        <div
          class="w-20 h-32"
          :class="{
            'ring-4 ring-yellow-400': chosenCards.includes(card),
            'rotate-180': card.isReversed,
          }"
          @dblclick.stop="() => toggleOrientation(card)"
        >
          <CardBack />
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="showCutToast"
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-2 rounded-xl shadow-lg"
      >
        {{ cutToastMessage }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
