<script setup lang="ts">
import { CalendarDays, ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function parseDate(value: string) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const visibleMonth = ref(startOfMonth(parseDate(props.modelValue) ?? today));

watch(
  () => props.modelValue,
  (value) => {
    const selectedDate = parseDate(value);
    if (selectedDate) visibleMonth.value = startOfMonth(selectedDate);
  }
);

const calendarDays = computed(() => {
  const year = visibleMonth.value.getFullYear();
  const month = visibleMonth.value.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: lastDate }, (_, index) => new Date(year, month, index + 1)),
  ];
});

const canMoveToPreviousMonth = computed(
  () => visibleMonth.value.getTime() > startOfMonth(today).getTime()
);

function moveMonth(offset: number) {
  const nextMonth = new Date(
    visibleMonth.value.getFullYear(),
    visibleMonth.value.getMonth() + offset,
    1
  );

  if (nextMonth < startOfMonth(today)) return;
  visibleMonth.value = nextMonth;
}

function isDisabled(date: Date) {
  return date <= today;
}

function isSelected(date: Date) {
  return formatDate(date) === props.modelValue;
}

function selectDate(date: Date) {
  if (isDisabled(date)) return;
  emit('update:modelValue', formatDate(date));
}
</script>

<template>
  <div class="rounded-xl border border-dm-gray/30 bg-white p-3">
    <div class="mb-3 flex items-center justify-between">
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full text-dm-gray-dark transition-colors hover:bg-dm-mint-light disabled:cursor-not-allowed disabled:opacity-30"
        :disabled="!canMoveToPreviousMonth"
        aria-label="이전 달"
        @click="moveMonth(-1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      <div class="flex items-center gap-1.5 text-sm font-extrabold text-gray-800">
        <CalendarDays class="h-4 w-4 text-dm-mint-darker" />
        {{ visibleMonth.getFullYear() }}년 {{ visibleMonth.getMonth() + 1 }}월
      </div>

      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full text-dm-gray-dark transition-colors hover:bg-dm-mint-light"
        aria-label="다음 달"
        @click="moveMonth(1)"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>

    <div class="grid grid-cols-7 text-center text-[11px] font-bold text-dm-gray-dark">
      <span
        v-for="weekday in WEEKDAYS"
        :key="weekday"
        class="py-1"
      >
        {{ weekday }}
      </span>
    </div>

    <div class="mt-1 grid grid-cols-7 gap-y-1 text-center">
      <div
        v-for="(date, index) in calendarDays"
        :key="date ? formatDate(date) : `empty-${index}`"
        class="flex h-9 items-center justify-center"
      >
        <button
          v-if="date"
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors"
          :class="
            isSelected(date)
              ? 'bg-brand text-white'
              : isDisabled(date)
                ? 'cursor-not-allowed text-dm-gray/60'
                : 'text-gray-800 hover:bg-dm-mint-light hover:text-dm-mint-darker'
          "
          :disabled="isDisabled(date)"
          :aria-label="`${formatDate(date)} 선택`"
          :aria-pressed="isSelected(date)"
          @click="selectDate(date)"
        >
          {{ date.getDate() }}
        </button>
      </div>
    </div>

    <p
      v-if="modelValue"
      class="mt-2 text-center text-xs font-bold text-dm-mint-darker"
    >
      선택한 날짜: {{ modelValue }}
    </p>
  </div>
</template>
