<script setup lang="ts">
import CoupleAchievement from '@/components/progress/CoupleAchievement.vue';
import MonthlyTimeline from '@/components/progress/MonthlyTimeline.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { useAuthCheck } from '@/composables/useAuthCheck';

useAuthCheck();
</script>

<template>
  <div class="whitespace-nowrap">
    <PageHeader title="월별 예산 달성 현황" />

    <div class="flex flex-col gap-8 p-4">
      <CoupleAchievement />
      <MonthlyTimeline />
    </div>
  </div>
</template>
