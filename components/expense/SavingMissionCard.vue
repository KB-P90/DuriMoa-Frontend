<script setup lang="ts">
import { useExpenseStore } from '@/stores/expenseStore';
import { computed } from 'vue';
import { ExpenseCategoryName, ExpenseCategoryIcon } from '@/types/category.js';
import { startSavingMission } from '@/server/expenseApi';
import { SavingMission } from '@/types/expense';

const props = defineProps<{
  year: number;
  month: number;
}>();

const expenseStore = useExpenseStore();

const savingMissions = computed(() => expenseStore.savingMissions);

// 절약 미션 style 관리
const missionAmountStyles = {
  available: 'text-btn-mt-dark',
  started: 'text-dm-gray',
  challenging: 'text-btn-pk',
};
const missionButtonStyles = {
  available: 'bg-btn-mt text-btn-mt-dark hover:bg-btn-mt-dark hover:text-white cursor-pointer',
  started: 'bg-dm-gray text-white',
  challenging: 'bg-btn-pk text-white',
};

const getMissionButtonType = (mission: any) => {
  if (mission.isStarted) {
    return 'started';
  }

  if (mission.status === '도전중') {
    return 'challenging';
  }

  return 'available';
};

const getMissionButtonText = (mission: any) => {
  if (mission.isStarted) {
    return '도전!';
  }

  return mission.status;
};

const handleStartMission = async (mission: SavingMission & { isStarted?: boolean }) => {
  if (mission.status !== '도전하기') return;

  try {
    await startSavingMission(
      mission.missionId,
      `${props.year}-${String(props.month).padStart(2, '0')}`
    );

    mission.isStarted = true;
  } catch (error) {
    console.error('미션 도전 실패', error);
  }
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
          :class="missionAmountStyles[getMissionButtonType(mission)]"
          class="text-m font-bold"
        >
          +{{ mission.expectedSavingAmount.toLocaleString() }}원
        </span>

        <button
          class="rounded-full px-3 py-2 text-sm font-semibold transition"
          :class="missionButtonStyles[getMissionButtonType(mission)]"
          :disabled="getMissionButtonType(mission) !== 'available'"
          @click="handleStartMission(mission)"
        >
          {{ getMissionButtonText(mission) }}
        </button>
      </div>
    </div>

    <div class="bg-dm-mint-light px-6 py-6 text-m text-dm-mint-darker font-semibold">
      <div v-if="savingMissions.missions.length">
        <p>
          추천대로 실천하면 월
          {{ Math.round(savingMissions.totalExpectedSavingAmount / 10000).toLocaleString() }}만원을
          더 저축할 수 있어요!
        </p>
      </div>

      <div v-else>
        <p class="text-center text-dm-gray">이번 달 추천 절약 미션이 없습니다.</p>
      </div>
    </div>
  </section>
</template>
