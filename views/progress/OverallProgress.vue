<script setup lang="ts">
import { computed } from 'vue';
import CategoryCheck from '@/components/progress/CategoryCheck.vue';
import { useProgressStore } from '@/stores/progressStore';

const progressStore = useProgressStore();

const overallProgress = computed(() => progressStore.overallProgress);
const progressRateLabel = computed(() => Math.round(overallProgress.value.progressRate));

// 진행 바는 100%를 넘지 않도록 처리
const progressBarWidth = computed(() =>
  Math.min(100, Math.max(0, overallProgress.value.progressRate))
);
</script>

<template>
  <div class="flex flex-col gap-10 px-4 py-8">
    <section class="rounded-3xl border border-dm-cb bg-dm-cb-light p-7 shadow-md">
      <div class="flex items-start justify-between">
        <p class="text-lg font-medium font-semibold">공동 예산 달성률</p>
        <p class="text-2xl font-bold text-dm-co">{{ progressRateLabel }}%</p>
      </div>

      <div class="mt-5 h-7 w-full overflow-hidden rounded-full bg-dm-gray-light">
        <div
          class="h-full rounded-full bg-dm-co transition-all duration-300"
          :style="{ width: `${progressBarWidth}%` }"
        />
      </div>

      <span class="flex mt-3 text-m font-semibold gap-1">
        <p>{{ overallProgress.currentAmount.toLocaleString() }}원</p>
        <p class="text-dm-gray-dark">/ {{ overallProgress.targetAmount.toLocaleString() }}원</p>
      </span>
    </section>

    <CategoryCheck />
  </div>
</template>
