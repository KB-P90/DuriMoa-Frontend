<script setup lang="ts">
import { Info } from '@lucide/vue';
import DoughnutChart from './DoughnutChart.vue';
import { useExpenseStore } from '@/stores/expenseStore.js';
import { computed, ref } from 'vue';
import { ExpenseCategoryName } from '@/types/category.js';

const expenseStore = useExpenseStore();

const props = defineProps<{
  month: number;
}>();

const selectedCategoryId = ref(expenseStore.monthlyExpense.expenseCategories[0].categoryId);

const selectedCategory = computed(
  () =>
    expenseStore.monthlyExpense.expenseCategories.find(
      (category) => category.categoryId === selectedCategoryId.value
    ) ?? expenseStore.monthlyExpense.expenseCategories[0]
);

const handleCategorySelect = (categoryId: number) => {
  selectedCategoryId.value = categoryId;
};
</script>

<template>
  <section class="rounded-3xl border border-dm-rose-light bg-white m-4 sm:m-6 p-4 sm:p-6 shadow-md">
    <div class="flex items-center gap-2">
      <h2 class="text-lg font-bold text-gray-800">카테고리별 지출</h2>
      <button
        type="button"
        class="text-dm-gray-dark cursor-pointer"
      >
        <Info :size="18" />
      </button>
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
          <div class="rounded-3xl border border-gray-100 bg-white p-4 sm:p-5 shadow-md">
            <p class="text-m font-semibold">
              {{ ExpenseCategoryName[selectedCategory.categoryCode] }}
            </p>
            <p class="mt-1 text-lg sm:text-xl font-bold text-right">
              {{ selectedCategory?.amount.toLocaleString() }}원
            </p>
          </div>

          <div class="rounded-3xl border border-gray-100 bg-white p-4 sm:p-5 shadow-md">
            <p class="text-m font-semibold">평균 대비</p>
            <p class="mt-1 text-lg sm:text-xl font-bold text-btn-pk text-right">
              {{ selectedCategory?.comparisonRate > 0 ? '+' : '' }}
              {{ selectedCategory?.comparisonRate }}%
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <!-- 나중에 Legend -->
    </div>
  </section>
</template>
