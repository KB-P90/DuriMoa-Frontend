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
  <section class="rounded-3xl border border-dm-co bg-dm-cb-light p-5 shadow-md">
    <div class="flex items-start justify-between">
      <p class="text-base font-semibold">공동 예산 달성률</p>
      <p class="text-xl font-bold text-btn-pk">{{ progressRateLabel }}%</p>
    </div>

    <div
      class="mt-4 h-5 w-full overflow-hidden rounded-full border border-1 border-btn-pk bg-dm-gray-light"
    >
      <div
        class="h-full rounded-full bg-btn-pk transition-all duration-1000"
        :style="{ width: `${progressBarWidth}%` }"
      />
    </div>

    <div class="mt-3 flex justify-between align-center">
      <span class="flex gap-1 text-sm font-semibold">
        <p>{{ Math.round(overallProgress.currentAmount / 10000).toLocaleString() }}만원</p>
        <p class="text-dm-gray-dark">
          / {{ Math.round(overallProgress.targetAmount / 10000).toLocaleString() }}만원
        </p>
      </span>

      <button
        v-if="props.showDetail"
        type="button"
        class="flex cursor-pointer items-center text-sm font-semibold text-btn-pk"
        @click="handleViewMonthlyProgress"
      >
        월별 예산 달성 현황 보기 <ChevronRight :size="20" />
      </button>
    </div>
  </section>
</template>
