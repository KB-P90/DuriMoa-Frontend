<script setup lang="ts">
import CoupleAchievement from '@/components/progress/CoupleAchievement.vue';
import { ArrowLeft } from '@lucide/vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="px-3 sm:px-20 pt-2">
    <header class="flex items-center justify-between px-3 py-5">
      <button
        type="button"
        @click="router.back()"
        class="text-2xl cursor-pointer"
      >
        <ArrowLeft class="h-6 w-6" />
      </button>
      <h1 class="flex-1 ml-2 text-xl font-bold">월별 예산 달성 현황</h1>
    </header>

    <div class="flex flex-col gap-10 px-4 py-4">
      <CoupleAchievement />
    </div>
  </div>
</template>
