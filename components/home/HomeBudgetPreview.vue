<script setup lang="ts">
import { ref } from 'vue';

// 추후 api 실제 요청으로 변경
const REGIONAL_BUDGETS = [
  { region: '서울', amount: '4,980', height: 96 },
  { region: '경기', amount: '4,450', height: 86 },
  { region: '인천', amount: '4,280', height: 82 },
  { region: '부산', amount: '4,120', height: 79 },
  { region: '대구', amount: '3,850', height: 74 },
  { region: '광주', amount: '3,780', height: 72 },
  { region: '대전', amount: '3,760', height: 72 },
] as const;

const selectedRegion = ref<(typeof REGIONAL_BUDGETS)[number]['region']>('서울');
</script>

<template>
  <section class="rounded-2xl border border-[#F0E7E5] bg-white p-[18px]">
    <h2 class="text-base font-bold text-[#232631]">예산 미리보기</h2>
    <p class="mt-1 text-xs text-dm-gray-dark">지역별 결혼식 예상 예산을 미리 보여드려요!</p>

    <div
      class="mt-5 flex h-[160px] items-end gap-2 overflow-x-auto border-b border-[#EDEDF2] px-1 scrollbar-none"
    >
      <button
        v-for="budget in REGIONAL_BUDGETS"
        :key="budget.region"
        type="button"
        class="relative flex min-w-0 flex-1 flex-col items-center justify-end gap-1 cursor-pointer"
        @click="selectedRegion = budget.region"
      >
        <Transition name="budget-amount">
          <span
            v-if="selectedRegion === budget.region"
            class="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-[#232631]"
          >
            {{ budget.amount }}<small class="text-[8px] font-normal">만원</small>
          </span>
        </Transition>
        <div
          class="w-full max-w-[26px] rounded-t-md transition-colors duration-200"
          :class="selectedRegion === budget.region ? 'bg-brand' : 'bg-[#DCDCE2]'"
          :style="{ height: `${budget.height}px` }"
        />
        <span
          class="text-[10.5px] transition-colors duration-200"
          :class="selectedRegion === budget.region ? 'font-bold text-brand' : 'text-dm-gray-dark'"
        >
          {{ budget.region }}
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.budget-amount-enter-active,
.budget-amount-leave-active {
  transition: opacity 0.15s ease;
}

.budget-amount-enter-from,
.budget-amount-leave-to {
  opacity: 0;
}
</style>
