<script setup lang="ts">
import { ChevronRight } from '@lucide/vue';
import { computed } from 'vue';
import { useProgressStore } from '@/stores/progressStore';
import { useRouter } from 'vue-router';
import { formatManWon } from '@/utils/format';

const props = withDefaults(
  defineProps<{
    showDetail?: boolean;
    progressRate?: number;
  }>(),
  {
    showDetail: false,
  }
);

const router = useRouter();
const progressStore = useProgressStore();

const overallProgress = computed(() => progressStore.overallProgress);

// props로 progressRate가 전달되면 해당 값 사용하고, 전달되지 않으면 overallProgress의 값 사용
const progressRate = computed(() =>
  props.progressRate !== undefined ? props.progressRate : overallProgress.value.progressRate
);

const progressRateLabel = computed(() => Math.round(progressRate.value));

// 진행 바는 100%를 넘지 않도록 처리
const progressBarWidth = computed(() => Math.min(100, Math.max(0, progressRate.value)));

function handleViewMonthlyProgress() {
  router.push({ name: 'monthly-progress' });
}
</script>

<template>
  <section class="flex flex-col gap-3">
    <div class="rounded-3xl bg-pink-01 px-6 py-4">
      <div class="mb-3 mr-2 flex items-center justify-between">
        <h2 class="text-base font-bold text-brand">공동 예산 달성률</h2>
        <p class="text-base font-bold text-brand">{{ progressRateLabel }}%</p>
      </div>

      <div
        class="h-5 w-full overflow-hidden rounded-full border border-1 border-pink-03 bg-dm-gray-light"
      >
        <div
          class="h-full rounded-full bg-brand transition-all duration-1000"
          :style="{ width: `${progressBarWidth}%` }"
        />
      </div>

      <div
        v-if="props.showDetail"
        class="mt-3 flex justify-between align-center"
      >
        <span class="flex gap-1 text-sm font-semibold">
          <p>{{ formatManWon(overallProgress.currentAmount) }}</p>
          <p class="text-dm-gray-dark">/ {{ formatManWon(overallProgress.targetAmount) }}</p>
        </span>

        <button
          type="button"
          class="flex cursor-pointer items-center text-sm font-semibold text-brand"
          @click="handleViewMonthlyProgress"
        >
          월별 예산 달성 현황 보기 <ChevronRight :size="20" />
        </button>
      </div>
    </div>
  </section>
</template>
