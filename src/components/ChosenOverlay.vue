<template>
  <div v-if="shouldShow" class="absolute inset-0 flex items-center justify-center">
    <div
      class="w-10 h-10 rounded-full bg-yellow-400 text-black text-lg font-bold flex items-center justify-center shadow-md"
    >
      {{ displayIndex }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  card: any;
  list: any[];
  index?: number;
  hiddenIndexes?: number[];
}>();

const shouldShow = computed(() => {
  const isChosen = props.list.includes(props.card);
  const isHidden = props.hiddenIndexes?.includes(props.index ?? -1);
  return isChosen && !isHidden;
});

const displayIndex = computed(() => props.list.indexOf(props.card) + 1);
</script>
