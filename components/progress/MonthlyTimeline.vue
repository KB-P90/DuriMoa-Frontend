<script setup lang="ts">
import { computed } from 'vue';
import { Check } from 'lucide-vue-next';
import { useProgressStore } from '@/stores/progressStore';
import { formatManWon } from '@/utils/format';

const progressStore = useProgressStore();

const months = computed(() => progressStore.monthlyProgress?.months ?? []);
</script>

<template>
  <section class="flex flex-col gap-3">
    <h2 class="px-2 text-base font-bold">월별 예산 달성률</h2>
    <div class="rounded-3xl border border-brand-border bg-white pl-4 pr-8 py-6">
      <div
        v-for="(month, index) in months"
        :key="month.yearMonth"
        class="relative mx-4 flex gap-3 pb-8"
      >
        <div
          class="absolute bottom-[-10px] left-5 top-2.5 w-1 -translate-x-1/2 bg-dm-mint-darker"
        />

        <div class="relative flex w-10 flex-shrink-0 justify-center">
          <div class="z-10 flex h-5 w-5 items-center justify-center rounded-full bg-dm-mint-darker">
            <div class="h-2 w-2 rounded-full bg-white" />
          </div>
        </div>

        <div class="ml-3 flex flex-1 items-start justify-between">
          <div>
            <p class="text-base font-bold leading-5 text-foreground">
              {{ month.yearMonth }}
            </p>
          </div>

          <div class="text-right">
            <div class="flex h-6 items-center justify-center gap-2">
              <div class="flex h-5 w-5 items-center justify-center rounded-full bg-dm-mint-darker">
                <Check class="h-4 w-4 text-white" />
              </div>
              <span class="text-sm font-bold leading-none text-dm-mint-darker">
                {{ month.progressRate }}% 달성
              </span>
            </div>

            <p class="mt-1 text-xs font-medium text-dm-gray-dark">
              {{ formatManWon(month.expenseAmount) }} 지출
            </p>
          </div>
        </div>
      </div>
      <div class="relative mx-4 flex gap-3 pb-0">
        <div class="relative flex w-10 flex-shrink-0 justify-center">
          <div class="z-10 flex h-5 w-5 items-center justify-center rounded-full bg-dm-mint-dark">
            <div class="h-2 w-2 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
