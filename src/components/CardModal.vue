<template>
  <div
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white text-black w-full max-w-md rounded-xl shadow-lg p-6 relative">
      <button
        @click="close"
        class="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        aria-label="Close"
      >
        &times;
      </button>

      <div class="flex flex-col items-center">
        <img
          :src="card.image"
          :alt="card.name"
          class="w-40 h-64 object-cover rounded-lg shadow-md mb-4"
        />

        <h2 class="text-2xl font-semibold mb-2 text-center">{{ card.name }}</h2>
        <p class="text-gray-700 text-sm text-justify whitespace-pre-line">
          {{ card.nameZh }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type CardWithId } from '@/composables/useDeck'

// [@vue/compiler-sfc] defineProps is a compiler macro and no longer needs to be imported
const props = defineProps<{
  card: CardWithId
}>()

// [@vue/compiler-sfc] defineEmits is a compiler macro and no longer needs to be imported
const emit = defineEmits<{
  (e: 'close'): void
}>()

function close() {
  emit('close')
}
</script>
