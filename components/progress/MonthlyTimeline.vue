<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Check } from 'lucide-vue-next';
import { useProgressStore } from '@/stores/progressStore';

const progressStore = useProgressStore();

const months = computed(() => progressStore.monthlyProgress.months);

// 페이지 진입 시 현황 데이터 로드
onMounted(() => {
  if (!progressStore.isLoaded) {
    progressStore.fetchProgress();
  }
});
</script>

<template>
  <section class="rounded-3xl border border-dm-mint-dark bg-white px-5 pb-6 pt-8 shadow-md">
    <div
      v-for="(month, index) in months"
      :key="month.yearMonth"
      class="relative mx-4 flex gap-3 pb-8 last:pb-0"
    >
      <div
        v-if="index !== months.length - 1"
        class="absolute bottom-[-10px] left-5 top-2.5 w-1 -translate-x-1/2 bg-dm-mint-dark"
      />

      <div class="relative flex w-10 flex-shrink-0 justify-center">
        <div class="z-10 flex h-5 w-5 items-center justify-center rounded-full bg-btn-mt-dark">
          <div class="h-2 w-2 rounded-full bg-white" />
        </div>
      </div>

      <div class="ml-3 flex flex-1 items-start justify-between">
        <div>
          <p class="text-lg font-bold leading-5 text-foreground">
            {{ month.yearMonth }}
          </p>
        </div>

        <div class="text-right">
          <div class="flex h-6 items-center justify-center gap-2">
            <div class="flex h-5 w-5 items-center justify-center rounded-full bg-btn-mt-dark">
              <Check class="h-4 w-4 text-white" />
            </div>
            <span class="text-base font-bold leading-none text-btn-mt-dark">
              {{ month.progressRate }}% 달성
            </span>
          </div>

          <p class="mt-1 text-sm font-medium text-dm-gray-dark">
            {{ Math.round(month.expenseAmount / 10000).toLocaleString() }}만원 지출
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
