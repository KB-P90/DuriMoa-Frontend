<script setup lang="ts">
import { useSavingMissionList } from '@/composables/useSavingMissionList';

defineProps<{ year: number; month: number }>();

const { savingMissions, missions, challengeMission } = useSavingMissionList();
</script>

<template>
  <section class="overflow-hidden rounded-[20px] border border-brand-border bg-white">
    <div class="flex items-center justify-between px-4 py-4">
      <h2 class="text-sm font-extrabold text-gray-800">이번 달 절약 미션</h2>
      <span class="text-sm font-extrabold text-[#EF826F]">
        +{{ savingMissions.totalExpectedSavingAmount.toLocaleString() }}원
        <!-- TODO: 토큰 등록 검토 -->
      </span>
    </div>

    <div
      v-for="mission in missions"
      :key="mission.missionId"
      class="flex min-h-[72px] items-center justify-between border-t border-divider px-4 py-3"
    >
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pink-01 text-base"
          aria-hidden="true"
        >
          {{ mission.icon }}
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-extrabold text-gray-800">
            {{ mission.categoryName }}
          </p>
          <p class="mt-1 truncate text-[11px] text-dm-gray-dark">
            {{ mission.title }}
          </p>
        </div>
      </div>

      <div class="ml-3 flex shrink-0 flex-col items-end gap-1.5">
        <span
          class="text-xs font-extrabold"
          :class="mission.amountClass"
        >
          +{{ mission.expectedSavingAmount.toLocaleString() }}원
        </span>
        <button
          type="button"
          class="rounded-full px-3 py-1 text-[10px] font-bold"
          :class="mission.buttonClass"
          :disabled="!mission.canChallenge"
          @click="challengeMission(mission.missionId)"
        >
          {{ mission.statusLabel }}
        </button>
      </div>
    </div>

    <p
      v-if="!missions.length"
      class="border-t border-divider px-4 py-8 text-center text-sm text-dm-gray-dark"
    >
      이번 달 추천 절약 미션이 없어요.
    </p>
  </section>
</template>
