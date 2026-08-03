<script setup lang="ts">
import { Info } from '@lucide/vue';
import DoughnutChart from './DoughnutChart.vue';
import { useExpenseStore } from '@/stores/expenseStore.js';
import { computed, ref } from 'vue';
import { ExpenseCategoryName, ExpenseCategoryColors } from '@/types/category';

const expenseStore = useExpenseStore();

const props = defineProps<{
  month: number;
}>();

const selectedCategoryId = ref<number | null>(
  expenseStore.monthlyExpense.expenseCategories[0]?.categoryId ?? null
);

const selectedCategory = computed(
  () =>
    expenseStore.monthlyExpense.expenseCategories.find(
      (category) => category.categoryId === selectedCategoryId.value
    ) ?? null
);

const handleCategorySelect = (categoryId: number) => {
  selectedCategoryId.value = categoryId;
};
</script>

<template>
  <section class="rounded-3xl border border-dm-rose-light bg-white m-4 sm:m-6 p-4 sm:p-6 shadow-md">
    <div class="flex items-center gap-2">
      <h2 class="text-lg font-bold text-gray-800">카테고리별 지출</h2>

      <div class="relative group">
        <button
          type="button"
          class="flex items-center justify-center text-dm-gray-dark cursor-pointer leading-none"
        >
          <Info
            :size="20"
            class="translate-y-px"
          />
        </button>

        <div
          class="pointer-events-none absolute left-28 top-2 z-10 w-52 -translate-x-1/2 rounded-xl bg-dm-gray px-3 py-2 text-xs text-white shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-90"
        >
          각 카테고리를 선택하시면<br />
          2030세대 평균 지출과 비교해드려요.
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-center">
      <div class="flex w-full max-w-xl items-center justify-around">
        <!-- 차트 -->
        <div class="aspect-square w-[45%] max-w-56">
          <DoughnutChart
            :month="month"
            :categories="expenseStore.monthlyExpense.expenseCategories"
            :total-amount="expenseStore.monthlyExpense.totalAmount"
            @select-category="handleCategorySelect"
          />
        </div>

        <!-- 카드 -->
        <div class="flex w-[40%] max-w-48 flex-col gap-4">
          <div class="rounded-3xl border border-dm-rose bg-white p-4 sm:p-5 shadow-md">
            <div v-if="selectedCategory">
              <p class="text-m font-semibold">
                {{ ExpenseCategoryName[selectedCategory.categoryCode] }}
              </p>
              <p class="mt-1 text-lg sm:text-xl font-bold text-right">
                {{ selectedCategory?.amount.toLocaleString() }}원
              </p>
            </div>

            <div
              v-else
              class="opacity-50"
            >
              <p class="text-m font-semibold text-dm-gray">카테고리</p>
              <p class="mt-1 text-lg sm:text-xl font-bold text-dm-gray text-right">0원</p>
            </div>
          </div>

          <div class="rounded-3xl border border-dm-rose bg-white p-4 sm:p-5 shadow-md">
            <div v-if="selectedCategory">
              <p class="text-m font-semibold">평균 대비</p>
              <p class="mt-1 text-lg sm:text-xl font-bold text-btn-pk text-right">
                {{ selectedCategory?.comparisonRate > 0 ? '+' : '' }}
                {{ selectedCategory?.comparisonRate }}%
              </p>
            </div>

            <div
              v-else
              class="opacity-50"
            >
              <p class="text-m font-semibold text-dm-gray">평균 대비</p>
              <p class="mt-1 text-lg sm:text-xl font-bold text-btn-pk text-right">0%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3">
      <div
        v-if="selectedCategory"
        v-for="category in expenseStore.monthlyExpense.expenseCategories"
        :key="category.categoryId"
        class="flex items-center gap-2"
      >
        <div
          class="h-3 w-8 rounded-full"
          :style="{ backgroundColor: ExpenseCategoryColors[category.categoryCode] }"
        />

        <span class="text-sm text-dm-gray">
          {{ ExpenseCategoryName[category.categoryCode] }}
        </span>
      </div>

      <div
        v-else
        class="py-10"
      >
        <p class="text-lg font-semibold text-dm-gray">이번 달 지출 내역이 없어요.</p>
      </div>
    </div>
  </section>
</template>
