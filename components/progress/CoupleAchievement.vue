<script setup lang="ts">
import { ChevronRight } from '@lucide/vue';
import { computed } from 'vue';
import { useProgressStore } from '@/stores/progressStore';
import { useRouter } from 'vue-router';

const props = withDefaults(
  defineProps<{
    showDetail?: boolean;
  }>(),
  {
    showDetail: false,
  }
);

const router = useRouter();

function handleViewMonthlyProgress() {
  router.push({ name: 'monthly-progress' });
}

const progressStore = useProgressStore();

const overallProgress = computed(() => progressStore.overallProgress);
const progressRateLabel = computed(() => Math.round(overallProgress.value.progressRate));

// 진행 바는 100%를 넘지 않도록 처리
const progressBarWidth = computed(() =>
  Math.min(100, Math.max(0, overallProgress.value.progressRate))
);
</script>

<template>
  <section class="rounded-3xl border border-dm-cb bg-dm-cb-light p-7 shadow-md">
    <div class="flex items-start justify-between">
      <p class="text-lg font-medium font-semibold">공동 예산 달성률</p>
      <p class="text-2xl font-bold text-dm-co">{{ progressRateLabel }}%</p>
    </div>

    <div class="mt-5 h-7 w-full overflow-hidden rounded-full bg-dm-gray-light">
      <div
        class="h-full rounded-full bg-dm-co transition-all duration-1000"
        :style="{ width: `${progressBarWidth}%` }"
      />
    </div>

    <div class="flex justify-between align-center mt-3">
      <span class="flex text-m font-semibold gap-1">
        <p>{{ Math.round(overallProgress.currentAmount / 10000).toLocaleString() }}만원</p>
        <p class="text-dm-gray-dark">
          / {{ Math.round(overallProgress.targetAmount / 10000).toLocaleString() }}만원
        </p>
      </span>

      <button
        v-if="props.showDetail"
        type="button"
        class="flex items-center text-m font-semibold text-btn-pk cursor-pointer"
        @click="handleViewMonthlyProgress"
      >
        월별 예산 달성 현황 보기 <ChevronRight :size="20" />
      </button>
    </div>
  </section>
</template>
