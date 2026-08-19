<script setup lang="ts">
import { computed, onMounted } from 'vue';
import CoupleAchievement from '@/components/progress/CoupleAchievement.vue';
import MonthlyTimeline from '@/components/progress/MonthlyTimeline.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import CoupleConnectionRequired from '@/components/common/CoupleConnectionRequired.vue';
import { MonthlyProgressViewSkeleton } from '@/components/skeleton/progress';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useProgressStore } from '@/stores/progressStore';

useAuthCheck();

const progressStore = useProgressStore();

onMounted(() => {
  progressStore.fetchMonthlyProgress();
});

const progressRate = computed(() => progressStore.monthlyProgress?.overallProgressRate);
</script>

<template>
  <div class="whitespace-nowrap">
    <PageHeader title="월별 예산 달성 현황" />

    <MonthlyProgressViewSkeleton v-if="progressStore.loading" />

    <template v-else>
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
    </template>
  </div>
</template>
