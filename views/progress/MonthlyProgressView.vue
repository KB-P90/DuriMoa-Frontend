<script setup lang="ts">
import CoupleAchievement from '@/components/progress/CoupleAchievement.vue';
import MonthlyTimeline from '@/components/progress/MonthlyTimeline.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { computed, onMounted } from 'vue';
import { useProgressStore } from '@/stores/progressStore';

useAuthCheck();

const progressStore = useProgressStore();

// 페이지 진입 시 현황 데이터 로드
onMounted(() => {
  progressStore.fetchMonthlyProgress();
});

const progressRate = computed(() => progressStore.monthlyProgress?.overallProgressRate);
</script>

<template>
  <div class="whitespace-nowrap">
    <PageHeader title="월별 예산 달성 현황" />

    <div class="flex flex-col gap-8 p-4">
      <CoupleAchievement :progress-rate="progressRate" />
      <MonthlyTimeline />
    </div>
  </div>
</template>
