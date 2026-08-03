<script setup lang="ts">
import { useExpenseStore } from '@/stores/expenseStore';
import { computed } from 'vue';
import { ExpenseCategoryName, ExpenseCategoryIcon } from '@/types/category.js';

const expenseStore = useExpenseStore();

const savingMissions = computed(() => expenseStore.savingMissions);

const buttonClass = (mission: any) => {
  if (mission.status === '도전중') {
    return 'bg-[#F59C84] text-white';
  }

  if (mission.isSelectable) {
    return 'bg-[#D8F2F1] text-[#5AAEB2] hover:bg-[#cceceb] cursor-pointer';
  }

  return 'bg-btn-pk text-white cursor-not-allowed';
};
</script>

<template>
  <section class="rounded-3xl border border-dm-mint bg-white m-4 sm:m-6 shadow-md overflow-hidden">
    <div class="flex items-center justify-between p-4 sm:p-6">
      <h2 class="text-lg font-bold text-gray-800">이번 달 절약 미션</h2>

      <span class="text-lg font-bold text-btn-pk">
        +{{ savingMissions.totalExpectedSavingAmount.toLocaleString() }}원
      </span>
    </div>

    <div
      v-for="mission in savingMissions.missions"
      :key="mission.missionId"
      class="flex items-center justify-between border-t border-dm-mint px-4 sm:px-6 py-4"
    >
      <div class="flex items-center gap-4">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-dm-cb-light text-xl">
          <component :is="ExpenseCategoryIcon[mission.categoryCode]" />
        </div>

        <div>
          <div class="text-m font-bold text-gray-800">
            {{ ExpenseCategoryName[mission.categoryCode] }}
          </div>

          <div class="mt-1 text-sm text-base text-gray-400">
            {{ mission.title }}
          </div>
        </div>
      </div>

      <div class="flex flex-col items-end gap-3">
        <span
          :class="mission.status === '도전중' ? 'text-btn-pk' : 'text-btn-mt-dark'"
          class="text-m font-bold"
        >
          +{{ mission.expectedSavingAmount.toLocaleString() }}원
        </span>

        <button
          class="rounded-full px-3 py-2 text-sm font-semibold transition"
          :class="buttonClass(mission)"
        >
          {{ mission.status }}
        </button>
      </div>
    </div>

    <div class="bg-dm-mint-light px-6 py-6 text-m text-dm-mint-darker font-semibold">
      <p>
        🐰 추천대로 실천하면 월
        {{ Math.round(savingMissions.totalExpectedSavingAmount / 10000).toLocaleString() }}만원을 더
        저축할 수 있어요!
      </p>
    </div>
  </section>
</template>
