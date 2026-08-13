<script setup lang="ts">
import { computed, ref } from 'vue';

import type { GoalCategoryStat } from '@/types/goal';
import { formatAmount } from '@/utils/format';

const props = defineProps<{
  stat?: GoalCategoryStat | null;
  value: number;
}>();

const emit = defineEmits<{
  'update:value': [number];
}>();

// 예비비처럼 지역/유형별 시세 통계가 없는 카테고리를 위한 기본 상한선.
const DEFAULT_MAX = 10_000_000; // 1000만원
const MAX_BUFFER = 1_000_000; // 100만원
const DRAG_STEP = 10_000; // 1만원 단위로 드래그

const hasZones = computed(() => !!props.stat);

const trackMax = computed(() => {
  if (props.stat) return Math.max(props.stat.upper10, props.value) * 1.05;
  return props.value > DEFAULT_MAX ? props.value + MAX_BUFFER : DEFAULT_MAX;
});

const savingPercent = computed(() =>
  props.stat ? (props.stat.lower25 / trackMax.value) * 100 : 0
);
const balancedPercent = computed(() =>
  props.stat ? ((props.stat.upper25 - props.stat.lower25) / trackMax.value) * 100 : 0
);
const flexPercent = computed(() => {
  if (!props.stat) return 100;
  return Math.max(100 - savingPercent.value - balancedPercent.value, 0);
});

const fillPercent = computed(() => Math.min((props.value / trackMax.value) * 100, 100));
const medianPercent = computed(() => ((props.stat?.median ?? 0) / trackMax.value) * 100);

const ticks = computed(() => [0, 1, 2, 3, 4].map((i) => Math.round((trackMax.value / 4) * i)));

const trackEl = ref<HTMLElement | null>(null);
const dragging = ref(false);

function valueFromClientX(clientX: number) {
  const el = trackEl.value;
  if (!el) return props.value;

  const rect = el.getBoundingClientRect();
  const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  const raw = ratio * trackMax.value;
  return Math.max(Math.round(raw / DRAG_STEP) * DRAG_STEP, 0);
}

function handlePointerDown(event: PointerEvent) {
  dragging.value = true;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  emit('update:value', valueFromClientX(event.clientX));
}

function handlePointerMove(event: PointerEvent) {
  if (!dragging.value) return;
  emit('update:value', valueFromClientX(event.clientX));
}

function handlePointerUp(event: PointerEvent) {
  dragging.value = false;
  (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
}
</script>

<template>
  <div>
    <div
      ref="trackEl"
      class="relative mt-5 h-3.5 w-full cursor-pointer touch-none select-none"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
    >
      <!-- 알뜰형/균형형/플렉스형 구간 트랙 (구간 통계가 있는 카테고리만) -->
      <div class="flex h-full w-full overflow-hidden rounded-full">
        <template v-if="hasZones">
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
        </template>
        <div
          v-else
          class="h-full w-full bg-gray-200"
        />
      </div>

      <!-- 현재 값까지 채워진 부분 -->
      <div
        class="absolute inset-y-0 left-0 rounded-full bg-brand"
        :style="{ width: `${fillPercent}%` }"
      />

      <!-- 중앙값 마커 (구간 통계가 있는 카테고리만) -->
      <template v-if="hasZones">
        <div
          class="absolute inset-y-0 border-l border-dashed border-pink-03"
          :style="{ left: `${medianPercent}%` }"
        />
        <span
          class="absolute -top-5 -translate-x-1/2 text-[10px] font-bold text-[#232631]"
          :style="{ left: `${medianPercent}%` }"
        >
          {{ formatAmount((stat?.median ?? 0) / 10_000) }}
        </span>
      </template>

      <!-- 드래그 핸들 -->
      <div
        class="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand bg-white shadow-sm"
        :style="{ left: `${fillPercent}%` }"
      />

      <!-- 현재 값 라벨 -->
      <span
        class="absolute -bottom-5 -translate-x-1/2 text-[10px] font-bold text-brand-dark"
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
