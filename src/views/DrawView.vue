<script setup lang="ts">
import { ref, onUnmounted, computed, watch, onMounted } from "vue";
import { gsap } from "gsap";
import { useDeck } from "@/composables/useDeck";
import { useGsapTicker } from "@/composables/useGsapTicker";
import { useSmoothStop } from "@/composables/useSmoothStop";
import CardBack from "@/components/CardBack.vue";
import DrawResult from "@/components/DrawResult.vue";

const fullDeck = ref(useDeck());

const { isStopping, isAnimating, triggerSmoothStop } = useSmoothStop(10);
const isShuffling = ref(false);
const shuffleDirection = ref<"clockwise" | "anticlockwise" | null>(null);
const hasCollectedToDeck = ref(false);
const startCollectedToDeck = ref(false);
const hasCutFinished = ref(false);
const spreadMode = ref<"1" | "3" | null>(null);
const userQuestion = ref("");
const showQuestionInput = ref(false);
const questionConfirmed = ref(false);
const isConfirmed = ref(false);
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
  if (cutToastTimeout) {
    clearTimeout(cutToastTimeout);
  }
  cutToastTimeout = setTimeout(() => {
    showCutToast.value = false;
  }, 3000);
}

const isCutting = ref(false);
let cutCooldownTimer: ReturnType<typeof setTimeout> | null = null;
let cutAnimationTimeout: ReturnType<typeof setTimeout> | null = null;
let cutToastTimeout: ReturnType<typeof setTimeout> | null = null;
const cardWidth = 40;
const cardHeight = 64;
const deckTarget = { x: -cardWidth, y: -cardHeight };

const sortedCards = ref<any[]>([]); // shared reactive array

const isWaitingForCardSelection = computed(() => {
  if (
    !spreadMode.value ||
    !questionConfirmed.value ||
    !hasCutFinished.value ||
    isConfirmed.value
  ) {
    return false;
  }
  return (
    (spreadMode.value === "1" && chosenCards.value.length !== 1) ||
    (spreadMode.value === "3" && chosenCards.value.length !== 3)
  );
});

function isCardReversed(angle: number): boolean {
  const normalized = ((angle % 360) + 360) % 360;

  if (normalized >= 90 && normalized < 180 + 90) {
    return true;
  }

  return false; // Elsewhere
}

const isReadyToConfirm = computed(() => {
  if (
    !spreadMode.value ||
    !questionConfirmed.value ||
    !hasCutFinished.value ||
    isConfirmed.value
  ) {
    return false;
  }
  return (
    (spreadMode.value === "1" && chosenCards.value.length === 1) ||
    (spreadMode.value === "3" && chosenCards.value.length === 3)
  );
});

const scatteredCards = ref(
  fullDeck.value.map((card) => {
    const angle = Math.random() * 360 * (Math.PI / 180);
    const radius = 100 + Math.random() * 150;
    const speed = 0.005 + Math.random() * 0.01;
    const rotate = Math.random() * 360 - 180;
    return {
      ...card,
      angle,
      radius,
      speed,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      rotate,
      orientation: null,
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
  if (cutAnimationTimeout) clearTimeout(cutAnimationTimeout);
  if (cutToastTimeout) clearTimeout(cutToastTimeout);
});

function collectCardsToDeck() {
  if (isShuffling.value) return;

  startCollectedToDeck.value = true;

  const sorted = scatteredCards.value.toSorted((a, b) => {
    if (b.y !== a.y) return a.y - b.y;
    return a.x - b.x;
  });

  sortedCards.value = sorted;

  const lastIndex = sorted.length - 1;

  sorted.forEach((card, index) => {
    const isReversed = isCardReversed(card.rotate);
    gsap.to(card, {
      x: deckTarget.x,
      y: isReversed ? deckTarget.y + cardHeight : deckTarget.y,
      rotate: isReversed ? 180 : 0,
      orientation: isReversed ? "reversed" : "upright",
      duration: 0.5,
      delay: index * 0.03,
      ease: "power2.inOut",
      onComplete: () => {
        if (index === lastIndex) {
          hasCollectedToDeck.value = true;
        }
      },
    });
  });
}

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

function cutDeck() {
  if (isCutting.value) return;
  isCutting.value = true;

  const [from, to] = [cutStart.value, cutEnd.value]
    .map((v) => clamp(v, 1, 78))
    .toSorted((a, b) => a - b);

  const portion = sortedCards.value.slice(from - 1, to);
  const rest = sortedCards.value.slice(0, from - 1).concat(sortedCards.value.slice(to));
  const cutOffset = 80;

  const timeline = gsap.timeline({
    onComplete: () => {
      // Reassemble and animate into deck
      const reassembled =
        cutPosition.value === "top" ? [...portion, ...rest] : [...rest, ...portion];
      sortedCards.value = reassembled;

      const collectTimeline = gsap.timeline({
        onComplete: () => {
          cutCount.value += 1;
          showCutInfoToast(from, to, cutPosition.value);
          isCutting.value = false;
        },
      });

      sortedCards.value.forEach((card, index) => {
        const isReversed = isCardReversed(card.rotate);

        collectTimeline.to(
          card,
          {
            x: deckTarget.x,
            y: isReversed ? deckTarget.y + cardHeight : deckTarget.y,
            rotate: isReversed ? 180 : 0,
            orientation: isReversed ? "reversed" : "upright",
            duration: 0.5,
            delay: index * 0.03,
            ease: "power2.inOut",
          },
          0
        ); // all delays relative to the start of this timeline
      });
    },
  });

  portion.forEach((card, i) => {
    timeline.to(
      card,
      {
        y: card.y - (cutPosition.value === "top" ? cutOffset : -cutOffset),
        duration: 0.3,
        delay: i * 0.01,
        ease: "power1.out",
      },
      0
    ); // sync start
  });

  rest.forEach((card, i) => {
    timeline.to(
      card,
      {
        y: card.y + (cutPosition.value === "top" ? cutOffset : -cutOffset),
        duration: 0.3,
        delay: i * 0.005,
        ease: "power1.out",
      },
      0
    ); // sync start
  });
}

function finishCut() {
  if (cutCooldownTimer) clearTimeout(cutCooldownTimer);
  hasCutFinished.value = true;
}

function confirmQuestion() {
  if (userQuestion.value.trim()) {
    questionConfirmed.value = true;
  }
}

function chooseCard(card: any) {
  const index = chosenCards.value.indexOf(card);
  if (index !== -1) {
    // Deselect if already chosen
    chosenCards.value.splice(index, 1);
  } else {
    const limit = spreadMode.value === "1" ? 1 : 3;
    if (chosenCards.value.length < limit) {
      chosenCards.value.push(card);
    }
  }
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
        v-if="!isShuffling && !startCollectedToDeck"
        :disabled="isStopping"
        @click="() => startShuffle('anticlockwise')"
        class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
      >
        Shuffle Anticlockwise
      </button>
      <button
        v-if="!isShuffling && !startCollectedToDeck"
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
        v-if="!isShuffling && scatteredCards.length && !startCollectedToDeck"
        @click="collectCardsToDeck"
        class="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
      >
        Reassemble
      </button>
      <template v-if="hasCollectedToDeck">
        <div
          class="flex flex-wrap items-center gap-4 bg-white/10 p-4 rounded-xl shadow border border-white/20"
        >
          <div class="flex flex-col">
            <label class="text-sm mb-1 text-white/70">Start</label>
            <input
              type="number"
              v-model.number="cutStart"
              min="1"
              max="78"
              class="w-24 px-3 py-2 rounded-lg border border-white/30 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              placeholder="Start"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm mb-1 text-white/70">End</label>
            <input
              type="number"
              v-model.number="cutEnd"
              min="1"
              max="78"
              class="w-24 px-3 py-2 rounded-lg border border-white/30 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              placeholder="End"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm mb-1 text-white/70">Cut Position</label>
            <select
              v-model="cutPosition"
              class="w-32 px-3 py-2 rounded-lg border border-white/30 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            >
              <option value="top">To Top</option>
              <option value="bottom">To Bottom</option>
            </select>
          </div>
        </div>

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

    <!-- Spread Question Input -->
    <div
      v-if="spreadMode && showQuestionInput && !questionConfirmed"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center text-white space-y-4"
    >
      <p class="text-center">Enter your question:</p>
      <input
        v-model="userQuestion"
        placeholder="What is your question?"
        class="w-96 px-4 py-2 rounded-xl text-white bg-black placeholder-white border border-white"
      />
      <button @click="confirmQuestion" class="px-4 py-2 bg-green-600 rounded-xl">
        OK
      </button>
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

    <!-- Spread info + question -->
    <div v-if="isWaitingForCardSelection" class="text-white text-center mb-4 space-y-2">
      <div class="text-xl font-semibold">
        {{ spreadMode === "1" ? "1 Card Spread" : "3 Cards Spread" }}
      </div>
      <div class="italic text-sm text-gray-300">"{{ userQuestion }}"</div>
    </div>

    <!-- Confirm Button shown after enough cards chosen -->
    <div
      v-if="isReadyToConfirm"
      class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
    >
      <button
        @click="() => (isConfirmed = true)"
        class="px-6 py-2 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700"
      >
        Confirm Selection
      </button>
    </div>

    <div
      v-if="spreadMode && questionConfirmed && hasCutFinished && !isConfirmed"
      class="absolute inset-0 pt-16 pb-4 px-2 z-0 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-13 gap-2"
    >
      <div
        v-for="card in sortedCards"
        :key="card.id"
        @click="() => chooseCard(card)"
        class="relative cursor-pointer hover:scale-105 transition-transform"
      >
        <div
          class="w-full aspect-[5/8]"
          :class="{
            'ring-4 ring-yellow-400': chosenCards.includes(card),
          }"
        >
          <CardBack />

          <!-- Chosen number overlay in center -->
          <div
            v-if="chosenCards.includes(card)"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div
              class="w-10 h-10 rounded-full bg-yellow-400 text-black text-lg font-bold flex items-center justify-center shadow-md"
            >
              {{ chosenCards.indexOf(card) + 1 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <DrawResult v-if="isConfirmed" :cards="chosenCards" />

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
