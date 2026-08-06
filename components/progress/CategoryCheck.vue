<script setup lang="ts">
import { computed } from 'vue';
import { useProgressStore } from '@/stores/progressStore';

const progressStore = useProgressStore();

const overallProgress = computed(() => progressStore.overallProgress);

// 예비비와 기타 카테고리 문구(미사용/미계약) 구분
const unfilledLabel = (category: string) => (category.includes('예비') ? '미사용' : '미계약');
</script>

<template>
  <section class="flex flex-col gap-3">
    <div class="flex items-center justify-between px-1">
      <h2 class="text-lg font-semibold">카테고리별 계약 체크리스트</h2>
      <span
        class="rounded-full bg-dm-mint-light px-3 py-1 text-m font-semibold text-dm-mint-darker"
      >
        {{ overallProgress.completedItemCount }} / {{ overallProgress.totalItemCount }} 완료
      </span>
    </div>

    <div class="overflow-hidden rounded-3xl border border-dm-mint bg-white shadow-md">
      <div
        v-for="item in overallProgress.items"
        :key="item.goalItemId"
        class="flex items-center gap-3 border-b border-dm-gray-light px-7 py-5 last:border-b-0"
      >
        <div
          class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md"
          :class="item.completed ? 'bg-dm-mint-darker' : 'border-2 border-dm-mint cursor-pointer'"
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
          <p class="text-m font-semibold">{{ item.category }}</p>
          <p class="mt-0.5 text-sm text-dm-gray-dark">
            목표 {{ Math.round(item.targetAmount / 10000).toLocaleString() }}만원 · 실제
            {{
              item.progressRate === null
                ? unfilledLabel(item.category)
                : Math.round(item.currentAmount / 10000).toLocaleString() + '만원'
            }}
          </p>
        </div>

        <div class="flex-shrink-0">
          <span
            v-if="item.progressRate !== null"
            class="rounded-3xl bg-dm-mint-light px-3 py-1 text-sm font-semibold text-dm-mint-darker"
          >
            {{ Math.round(item.progressRate) }}%
          </span>
          <span
            v-else
            class="rounded-3xl bg-dm-gray-light px-3 py-1 text-sm font-bold text-dm-gray-dark"
          >
            --
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
