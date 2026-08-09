<script setup lang="ts">
import { computed } from 'vue';

import { useProgressStore } from '@/stores/progressStore';
import type { CategoryProgress } from '@/types/progress';

const WEDDING_CATEGORY_NAMES = [
  '예식장',
  '스튜디오',
  '드레스',
  '메이크업',
  '예물',
  '예비비',
] as const;

interface ChecklistItem extends CategoryProgress {
  key: string;
}

const progressStore = useProgressStore();

const overallProgress = computed(() => progressStore.overallProgress);

const checklistItems = computed<ChecklistItem[]>(() =>
  WEDDING_CATEGORY_NAMES.map((category, index) => {
    const item = overallProgress.value.items.find(
      (progressItem) => progressItem.category === category
    );

    return {
      goalItemId: item?.goalItemId ?? -(index + 1),
      category,
      targetAmount: item?.targetAmount ?? 0,
      currentAmount: item?.currentAmount ?? 0,
      progressRate: item?.progressRate ?? 0,
      completed: item?.completed ?? false,
      key: category,
    };
  })
);
</script>

<template>
  <section class="flex flex-col gap-3">
    <div class="flex items-center justify-between px-1">
      <h2 class="text-lg font-bold">카테고리별 계약 체크리스트</h2>
      <span
        class="rounded-full bg-dm-mint-light px-3 py-1 text-xs font-semibold text-dm-mint-darker"
      >
        {{ overallProgress.completedItemCount }} / {{ overallProgress.totalItemCount }} 완료
      </span>
    </div>

    <div class="overflow-hidden rounded-3xl border border-dm-mint-dark bg-white">
      <div
        v-for="item in checklistItems"
        :key="item.key"
        class="flex items-center gap-3 border-b border-dm-gray-light p-4 last:border-b-0"
        :class="item.targetAmount == 0 ? 'bg-dm-gray-light text-dm-gray' : ''"
      >
        <div
          class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md"
          :class="{
            'border-2': item.targetAmount == 0,
            'bg-dm-mint-darker': item.targetAmount != 0 && item.completed,
            'border-2 border-dm-mint-dark cursor-pointer':
              item.targetAmount != 0 && !item.completed,
          }"
        >
          <svg
            v-if="item.completed"
            class="h-3.5 w-3.5 text-white"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3 8.5L6.2 11.5L13 4.5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <div class="ml-3 flex-1">
          <p class="text-sm font-semibold">{{ item.category }}</p>
          <p
            v-if="item.targetAmount != 0"
            class="mt-0.5 text-sm text-dm-gray-dark"
          >
            목표 {{ Math.round(item.targetAmount / 10000).toLocaleString() }}만원 /
            {{ Math.round(item.currentAmount / 10000).toLocaleString() }}만원 사용
          </p>
        </div>

        <div
          v-if="item.targetAmount != 0"
          class="flex-shrink-0"
        >
          <span
            class="rounded-3xl bg-dm-mint-light px-3 py-1 text-sm font-semibold text-dm-mint-darker"
          >
            {{ Math.round(item.progressRate ?? 0) }}%
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
