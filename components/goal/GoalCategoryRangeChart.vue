<script setup lang="ts">
import { computed } from 'vue';

import type { GoalCategoryStat } from '@/types/goal';
import { formatAmount } from '@/utils/format';

const props = defineProps<{
  stat: GoalCategoryStat;
  value: number;
}>();

const trackMax = computed(() => Math.max(props.stat.upper10, props.value) * 1.05);

const savingPercent = computed(() => (props.stat.lower25 / trackMax.value) * 100);
const balancedPercent = computed(
  () => ((props.stat.upper25 - props.stat.lower25) / trackMax.value) * 100
);
const flexPercent = computed(() => Math.max(100 - savingPercent.value - balancedPercent.value, 0));

const fillPercent = computed(() => Math.min((props.value / trackMax.value) * 100, 100));
const medianPercent = computed(() => (props.stat.median / trackMax.value) * 100);

const ticks = computed(() => [0, 1, 2, 3, 4].map((i) => Math.round((trackMax.value / 4) * i)));
</script>

<template>
  <div>
    <div class="relative mt-5 h-3.5 w-full">
      <!-- 알뜰형/균형형/플렉스형 구간 트랙 -->
      <div class="flex h-full w-full overflow-hidden rounded-full">
        <div
          class="h-full bg-gray-200"
          :style="{ width: `${savingPercent}%` }"
        />
        <div
          class="h-full bg-gray-300"
          :style="{ width: `${balancedPercent}%` }"
        />
        <div
          class="h-full bg-gray-400"
          :style="{ width: `${flexPercent}%` }"
        />
      </div>

      <!-- 현재 값까지 채워진 부분 -->
      <div
        class="absolute inset-y-0 left-0 rounded-full bg-dm-rose-dark"
        :style="{ width: `${fillPercent}%` }"
      />

      <!-- 중앙값 마커 -->
      <div
        class="absolute inset-y-0 border-l border-dashed border-btn-pk"
        :style="{ left: `${medianPercent}%` }"
      />
      <span
        class="absolute -top-5 -translate-x-1/2 text-[10px] font-bold text-[#232631]"
        :style="{ left: `${medianPercent}%` }"
      >
        {{ formatAmount(stat.median / 10_000) }}
      </span>

      <!-- 현재 값 라벨 -->
      <span
        class="absolute -bottom-5 -translate-x-1/2 text-[10px] font-bold text-dm-rose-dark"
        :style="{ left: `${fillPercent}%` }"
      >
        {{ formatAmount(value / 10_000) }}
      </span>
    </div>

    <div class="mt-6 flex justify-between text-[10px] text-dm-gray-dark">
      <span
        v-for="tick in ticks"
        :key="tick"
        >{{ formatAmount(tick / 10_000) }}</span
      >
    </div>
  </div>
</template>
