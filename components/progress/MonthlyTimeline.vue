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
  <section class="px-7 pt-12 pb-8 rounded-3xl border border-dm-mint bg-white shadow-md">
    <div
      v-for="(month, index) in months"
      :key="month.yearMonth"
      class="relative flex gap-4 mx-5 pb-10 last:pb-0"
    >
      <div
        v-if="index !== months.length - 1"
        class="absolute left-5 top-2.5 bottom-[-10px] w-1 -translate-x-1/2 bg-dm-mint-dark"
      />

      <div class="relative flex w-10 flex-shrink-0 justify-center">
        <div class="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-btn-mt-dark">
          <div class="h-2 w-2 rounded-full bg-white" />
        </div>
      </div>

      <div class="flex flex-1 items-start justify-between ml-5">
        <div>
          <p class="text-2xl font-bold leading-5 text-foreground">
            {{ month.yearMonth }}
          </p>
        </div>

        <div class="text-right">
          <div class="flex h-7 items-center justify-center gap-2">
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-btn-mt-dark">
              <Check class="h-4 w-4 text-white" />
            </div>
            <span class="text-xl font-bold leading-none text-btn-mt-dark">
              {{ month.progressRate }}% 달성
            </span>
          </div>

          <p class="mt-1 text-m font-medium text-dm-gray-dark">
            {{ Math.round(month.expenseAmount / 10000).toLocaleString() }}만원 지출
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
