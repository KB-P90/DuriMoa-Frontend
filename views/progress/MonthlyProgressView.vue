<script setup lang="ts">
import CoupleAchievement from '@/components/progress/CoupleAchievement.vue';
import MonthlyTimeline from '@/components/progress/MonthlyTimeline.vue';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { ArrowLeft } from '@lucide/vue';
import { useRouter } from 'vue-router';

useAuthCheck();

const router = useRouter();
</script>

<template>
  <div class="px-3 sm:px-20 pt-2 whitespace-nowrap">
    <header class="flex items-center justify-between px-3 py-5">
      <button
        type="button"
        @click="router.back()"
        class="cursor-pointer text-lg"
      >
        <ArrowLeft class="h-6 w-6" />
      </button>
      <h1 class="ml-2 flex-1 text-lg font-bold">월별 예산 달성 현황</h1>
    </header>

    <div class="flex flex-col gap-8 px-4 pt-3 pb-8">
      <CoupleAchievement />
      <MonthlyTimeline />
    </div>
  </div>
</template>
