<script setup lang="ts">
import CoupleAchievement from '@/components/progress/CoupleAchievement.vue';
import MonthlyTimeline from '@/components/progress/MonthlyTimeline.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import CoupleConnectionRequired from '@/components/common/CoupleConnectionRequired.vue';
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

    <CoupleConnectionRequired v-if="progressStore.unavailableReason === 'NO_COUPLE'" />
    <CoupleConnectionRequired
      v-else-if="progressStore.unavailableReason === 'NO_GOAL'"
      :message="'메인 시안을 설정하면'"
      :route-name="'goal-list'"
      :button-message="'설정하러 가기'"
    />

    <div
      v-else
      class="flex flex-col gap-8 p-4"
    >
      <CoupleAchievement :progress-rate="progressRate" />
      <MonthlyTimeline />
    </div>
  </div>
</template>
