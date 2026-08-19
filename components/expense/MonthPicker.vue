<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';

const props = defineProps<{
  year: number;
  month: number;
}>();

const emit = defineEmits<{
  change: [{ year: number; month: number }];
}>();

function moveMonth(diff: number) {
  const date = new Date(props.year, props.month - 1 + diff);

  emit('change', {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  });
}
</script>

<template>
  <div class="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
    <button
      type="button"
      class="cursor-pointer text-gray-500"
      @click="moveMonth(-1)"
    >
      <ChevronLeft :size="20" />
    </button>

    <span class="min-w-[60px] text-center text-sm font-semibold text-gray-600">
      {{ year }}. {{ month }}
    </span>

    <button
      type="button"
      class="cursor-pointer text-gray-500"
      @click="moveMonth(1)"
    >
      <ChevronRight :size="20" />
    </button>
  </div>
</template>
