<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import GoalStepHeader from '@/components/goal/GoalStepHeader.vue';
import GoalStepNav from '@/components/goal/GoalStepNav.vue';
import CalendarDatePicker from '@/components/common/CalendarDatePicker.vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REGIONS } from '@/constants/goal';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useGoalStore } from '@/stores/goalStore';
import type { RegionName } from '@/types/goal';
import PageHeader from '@/components/common/PageHeader.vue';

useAuthCheck();

const router = useRouter();
const goalStore = useGoalStore();

const weddingDate = ref(goalStore.draft.weddingDate ?? '');
const region = ref<RegionName | undefined>(goalStore.draft.region ?? undefined);

function handleNext() {
  if (!region.value) return;

  goalStore.setSchedule(weddingDate.value, region.value);
  router.push({ name: 'goal-budget-type' });
}
</script>

<template>
  <PageHeader
    title="결혼 목표 설정"
    :showBack="true"
    :on-back="() => router.push({ name: 'home' })"
  />
  <div class="p-4 pb-[calc(6rem+env(safe-area-inset-bottom))]">
    <GoalStepHeader
      step="1/8"
      title="언제, 어디서 하나요"
    />

    <form
      class="flex flex-col gap-4"
      @submit.prevent="handleNext"
    >
      <div>
        <label
          class="mb-1.5 block text-xs font-bold text-dm-gray-dark"
          for="goal-wedding-date"
        >
          결혼 예정일
        </label>
        <CalendarDatePicker
          id="goal-wedding-date"
          v-model="weddingDate"
          title="결혼 예정일"
          exclude-today
        />
      </div>

      <div>
        <label
          class="mb-1.5 block text-xs font-bold text-dm-gray-dark"
          for="goal-region"
        >
          예식 지역
        </label>
        <Select v-model="region">
          <SelectTrigger
            id="goal-region"
            class="h-[46px] w-full rounded-xl border-dm-gray/40 bg-white px-3.5 text-sm font-semibold text-[#232631] shadow-none hover:border-dm-gray/60 focus:border-pink-03 focus:ring-3 focus:ring-brand/10"
          >
            <SelectValue placeholder="지역을 선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="name in REGIONS"
              :key="name"
              :value="name"
            >
              {{ name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <GoalStepNav
        :show-prev="false"
        :next-disabled="!region || !weddingDate"
      />
    </form>
  </div>
</template>
