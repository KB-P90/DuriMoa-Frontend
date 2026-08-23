<script setup lang="ts">
import { computed, ref } from 'vue';
import { CalendarDays, ChevronLeft, ChevronDown } from '@lucide/vue';
import BottomSheet from './BottomSheet.vue';
import WheelColumn from './WheelColumn.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue: string;
    title?: string;
    placeholder?: string;
    allowPast?: boolean;
    excludeToday?: boolean;
  }>(),
  {
    title: '날짜선택',
    placeholder: '날짜를 선택해주세요',
    allowPast: false,
    excludeToday: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [string];
}>();

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const today = new Date();
const CURRENT_YEAR = today.getFullYear();
const CURRENT_MONTH = today.getMonth() + 1;
const CURRENT_DAY = today.getDate();

const YEAR_RANGE = computed(() => {
  const startYear = props.allowPast ? CURRENT_YEAR - 15 : CURRENT_YEAR;
  const endYear = CURRENT_YEAR + 14;
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
});

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  if (year && month && day) return { year, month, day };

  return { year: CURRENT_YEAR, month: CURRENT_MONTH, day: CURRENT_DAY };
}

function isPast(year: number, month: number, day: number) {
  if (props.allowPast) return false;
  if (year !== CURRENT_YEAR) return year < CURRENT_YEAR;
  if (month !== CURRENT_MONTH) return month < CURRENT_MONTH;
  return props.excludeToday ? day <= CURRENT_DAY : day < CURRENT_DAY;
}

const isOpen = ref(false);
const isMonthSelectOpen = ref(false);

const viewYear = ref(CURRENT_YEAR);
const viewMonth = ref(CURRENT_MONTH);
const selectedDay = ref<number | null>(null);

const jumpYear = ref(CURRENT_YEAR);
const jumpMonth = ref(CURRENT_MONTH);

const jumpMonths = computed(() => {
  const start = !props.allowPast && jumpYear.value === CURRENT_YEAR ? CURRENT_MONTH : 1;
  return Array.from({ length: 12 - start + 1 }, (_, i) => start + i);
});

// 연도를 옮기면 이전 스크롤 위치의 달이 새 연도에서도 우연히 유효해 그대로 남는 경우가 있어
// (예: 12월에서 연도만 바꾸면 다음 해도 12월인 채로 보임), 연도가 바뀔 때는 항상 그 해의
// 첫 선택 가능한 달로 리셋한다.
function onJumpYearChange(year: number) {
  jumpYear.value = year;
  jumpMonth.value = jumpMonths.value[0];
}

interface CalendarCell {
  day: number;
  inMonth: boolean;
  disabled: boolean;
}

const calendarCells = computed<CalendarCell[]>(() => {
  const firstWeekday = new Date(viewYear.value, viewMonth.value - 1, 1).getDay();
  const totalDays = daysInMonth(viewYear.value, viewMonth.value);
  const prevMonthDays = daysInMonth(
    viewMonth.value === 1 ? viewYear.value - 1 : viewYear.value,
    viewMonth.value === 1 ? 12 : viewMonth.value - 1
  );

  const cells: CalendarCell[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, inMonth: false, disabled: true });
  }
  for (let day = 1; day <= totalDays; day++) {
    cells.push({ day, inMonth: true, disabled: isPast(viewYear.value, viewMonth.value, day) });
  }
  let nextMonthDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextMonthDay++, inMonth: false, disabled: true });
  }

  return cells;
});

const selectedLabel = computed(() => {
  if (selectedDay.value === null) return null;
  const weekday =
    WEEKDAYS[new Date(viewYear.value, viewMonth.value - 1, selectedDay.value).getDay()];
  return `${viewMonth.value}월 ${selectedDay.value}일(${weekday}) 선택`;
});

const displayValue = computed(() => {
  if (!props.modelValue) return '';
  const { year, month, day } = parseDate(props.modelValue);
  return `${year}년 ${month}월 ${day}일`;
});

function open() {
  const current = parseDate(props.modelValue);
  const base = isPast(current.year, current.month, current.day)
    ? { year: CURRENT_YEAR, month: CURRENT_MONTH, day: CURRENT_DAY }
    : current;

  viewYear.value = base.year;
  viewMonth.value = base.month;
  selectedDay.value = props.modelValue ? base.day : null;
  jumpYear.value = base.year;
  jumpMonth.value = base.month;
  isMonthSelectOpen.value = false;
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function selectDay(cell: CalendarCell) {
  if (cell.disabled || !cell.inMonth) return;
  selectedDay.value = cell.day;
}

function toggleMonthSelect() {
  if (!isMonthSelectOpen.value) {
    jumpYear.value = viewYear.value;
    jumpMonth.value = viewMonth.value;
  }
  isMonthSelectOpen.value = !isMonthSelectOpen.value;
}

function applyMonthJump() {
  viewYear.value = jumpYear.value;
  viewMonth.value = jumpMonth.value;
  selectedDay.value = null;
  isMonthSelectOpen.value = false;
}

function confirm() {
  if (selectedDay.value === null) return;
  emit('update:modelValue', `${viewYear.value}-${pad(viewMonth.value)}-${pad(selectedDay.value)}`);
  close();
}
</script>

<template>
  <button
    type="button"
    v-bind="$attrs"
    class="flex h-[46px] w-full cursor-pointer items-center justify-between rounded-xl border border-dm-gray/40 bg-white px-3.5 text-left text-sm outline-none transition hover:border-dm-gray/60 focus:border-pink-03 focus:ring-3 focus:ring-brand/10"
    :class="displayValue ? 'font-semibold text-[#232631]' : 'font-medium text-dm-gray'"
    @click="open"
  >
    <span>{{ displayValue || placeholder }}</span>
    <CalendarDays
      class="h-5 w-5 shrink-0 text-dm-gray-dark"
      :stroke-width="2"
      aria-hidden="true"
    />
  </button>

  <BottomSheet
    v-if="isOpen"
    @close="close"
  >
    <div class="relative flex h-12 shrink-0 items-center justify-center border-b border-dm-gray/10">
      <button
        type="button"
        aria-label="닫기"
        class="absolute left-4 grid h-6 w-6 cursor-pointer place-items-center"
        @click="close"
      >
        <ArrowLeft
          class="h-5 w-5 text-[#232631]"
          :stroke-width="2"
        />
      </button>
      <span class="text-base font-extrabold text-black">{{ title }}</span>
    </div>

    <div class="flex flex-col gap-3 overflow-y-auto scrollbar-none px-5 pt-4">
      <button
        type="button"
        class="flex w-fit cursor-pointer items-center gap-1 text-base font-extrabold text-brand-dark"
        @click="toggleMonthSelect"
      >
        {{ viewYear }}년 {{ viewMonth }}월
        <ChevronDown
          class="h-4 w-4 transition-transform"
          :class="isMonthSelectOpen && 'rotate-180'"
          :stroke-width="2.5"
        />
      </button>

      <!-- 연/월 선택과 달력 뷰의 콘텐츠 높이가 달라도 시트 높이가 흔들리지 않도록 고정 영역을 둔다. -->
      <div class="min-h-[312px]">
        <div
          v-if="isMonthSelectOpen"
          class="flex h-[312px] flex-col items-center justify-center rounded-xl border border-dm-gray/30 bg-dm-gray-light p-1.5"
        >
          <div class="flex w-full">
            <WheelColumn
              :model-value="jumpYear"
              :items="YEAR_RANGE"
              suffix="년"
              @update:model-value="onJumpYearChange"
            />
            <WheelColumn
              v-model="jumpMonth"
              :items="jumpMonths"
              suffix="월"
            />
          </div>
        </div>

        <template v-else>
          <div class="grid grid-cols-7 text-center text-base font-semibold">
            <span
              v-for="(weekday, index) in WEEKDAYS"
              :key="weekday"
              :class="index === 0 ? 'text-red' : 'text-dm-gray-dark'"
            >
              {{ weekday }}
            </span>
          </div>

          <div class="mt-2 grid grid-cols-7 gap-y-2">
            <button
              v-for="(cell, index) in calendarCells"
              :key="index"
              type="button"
              class="grid h-10 w-10 cursor-pointer place-items-center justify-self-center rounded-full text-base transition-colors disabled:cursor-not-allowed"
              :disabled="cell.disabled || !cell.inMonth"
              :class="[
                !cell.inMonth || cell.disabled
                  ? 'text-dm-gray/40'
                  : cell.day === selectedDay
                    ? 'bg-brand font-bold text-white'
                    : index % 7 === 0
                      ? 'text-red'
                      : 'text-[#232631]',
              ]"
              @click="selectDay(cell)"
            >
              {{ cell.day }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <div
      class="border-t border-dm-gray/10 px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
    >
      <button
        type="button"
        class="h-11 w-full cursor-pointer rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-disable"
        :disabled="!isMonthSelectOpen && selectedDay === null"
        @click="isMonthSelectOpen ? applyMonthJump() : confirm()"
      >
        {{ isMonthSelectOpen ? '다음' : selectedLabel || placeholder }}
      </button>
    </div>
  </BottomSheet>
</template>
