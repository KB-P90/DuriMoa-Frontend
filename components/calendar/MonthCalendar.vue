<script setup lang="ts">
import type { CalendarDay } from '@/types/calendar';

defineProps<{
  days: readonly CalendarDay[];
  selectedDate: number;
}>();

const emit = defineEmits<{ select: [date: number] }>();
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
</script>

<template>
  <section class="min-w-0 rounded-[22px] border border-[#e4e5eb] bg-white px-2 pb-5 pt-4 shadow-[0_5px_12px_rgba(35,35,45,0.08)] sm:px-5">
    <div class="mb-3 flex items-center justify-between px-1 text-[#9293a2]">
      <button type="button" aria-label="이전 달">‹</button>
      <strong class="text-[17px] text-[#292934]">2026. 7</strong>
      <button type="button" aria-label="다음 달">›</button>
    </div>
    <div class="grid grid-cols-7 text-center">
      <span
        v-for="(weekday, index) in WEEKDAYS"
        :key="weekday"
        class="pb-3 text-[13px] font-semibold"
        :class="index === 0 ? 'text-[#f28f86]' : 'text-[#9293a2]'"
      >
        {{ weekday }}
      </span>
      <button
        v-for="(day, index) in days"
        :key="`${index}-${day.date}`"
        type="button"
        class="relative mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-[13px] text-[14px] font-bold sm:h-[48px] sm:w-[48px] sm:text-[15px]"
        :class="[
          !day.currentMonth && 'text-[#d7d7df]',
          day.currentMonth && index % 7 === 0 && 'text-[#f28f86]',
          day.currentMonth && index % 7 !== 0 && 'text-[#292934]',
          day.currentMonth && day.date === selectedDate && '!bg-[#f28f86] !text-white',
        ]"
        :disabled="!day.currentMonth"
        @click="emit('select', day.date)"
      >
        <span>{{ day.date }}</span>
        <span v-if="day.markers.length" class="mt-0.5 flex h-1 gap-0.5">
          <i
            v-for="marker in day.markers"
            :key="marker"
            class="h-1 w-1 rounded-full"
            :class="day.date === selectedDate ? 'bg-white' : marker === 'expense' ? 'bg-[#f28f86]' : 'bg-[#7da5a8]'"
          />
        </span>
      </button>
    </div>
  </section>
</template>
