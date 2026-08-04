<script setup lang="ts">
import type { CalendarDay } from '@/types/calendar';

defineProps<{
  days: readonly CalendarDay[];
  selectedDate: string;
  monthLabel: string;
}>();

const emit = defineEmits<{
  select: [date: string];
  'change-month': [offset: number];
}>();
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const MARKER_COLORS = {
  income: 'bg-[#65C466]',
  expense: 'bg-[#F09488]',
  saving: 'bg-[#3B86F7]',
} as const;
</script>

<template>
  <section
    class="min-w-0 rounded-3xl border border-dm-gray/30 bg-background px-2 pb-4 pt-4 shadow-sm sm:px-5"
  >
    <div class="mb-3 flex items-center justify-between px-1 text-dm-gray-dark">
      <button
        type="button"
        aria-label="이전 달"
        @click="emit('change-month', -1)"
      >
        ‹
      </button>
      <strong class="text-base font-semibold text-gray-800">{{ monthLabel }}</strong>
      <button
        type="button"
        aria-label="다음 달"
        @click="emit('change-month', 1)"
      >
        ›
      </button>
    </div>
    <div class="grid grid-cols-7 text-center">
      <span
        v-for="(weekday, index) in WEEKDAYS"
        :key="weekday"
        class="pb-2 text-xs font-medium"
        :class="index === 0 ? 'text-[#F09488]' : 'text-dm-gray-dark'"
      >
        {{ weekday }}
      </span>
      <button
        v-for="(day, index) in days"
        :key="`${index}-${day.date}`"
        type="button"
        class="relative mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-xl text-sm font-semibold sm:h-11 sm:w-11"
        :class="[
          !day.currentMonth && 'text-dm-gray/50',
          day.currentMonth && index % 7 === 0 && 'text-[#F09488]',
          day.currentMonth && index % 7 !== 0 && 'text-gray-800',
          day.currentMonth && day.isoDate === selectedDate && '!bg-[#F09488] !text-white',
        ]"
        :disabled="!day.currentMonth"
        @click="emit('select', day.isoDate)"
      >
        <span>{{ day.date }}</span>
        <span
          v-if="day.markers.length"
          class="mt-0.5 flex h-1 gap-0.5"
        >
          <i
            v-for="marker in day.markers"
            :key="marker"
            class="h-1 w-1 rounded-full"
            :class="day.isoDate === selectedDate ? 'bg-white' : MARKER_COLORS[marker]"
          />
        </span>
      </button>
    </div>
  </section>
</template>
