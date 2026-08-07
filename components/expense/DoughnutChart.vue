<script setup lang="ts">
import { Doughnut } from 'vue-chartjs';
import type { TooltipItem } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import type { ExpenseCategory } from '@/types/expense';
import { ExpenseCategoryName, ExpenseCategoryColors } from '@/types/category';
import { computed } from 'vue';

const props = defineProps<{
  month: number;
  categories: ExpenseCategory[];
  totalAmount: number;
}>();

const emit = defineEmits<{
  selectCategory: [categoryId: number];
}>();

ChartJS.register(ArcElement, Tooltip);

const chartData = computed(() => ({
  labels: props.categories.map((category) => ExpenseCategoryName[category.categoryCode]),

  datasets: [
    {
      data: props.categories.map((category) => category.amount),

      backgroundColor: props.categories.map(
        (category) => ExpenseCategoryColors[category.categoryCode]
      ),

      borderWidth: 0,
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,

  cutout: '70%',

  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      displayColors: false,
      callbacks: {
        label: (context: TooltipItem<'doughnut'>) => {
          const category = props.categories[context.dataIndex];

          return `${category.expenseRate}%`;
        },
      },
    },
  },

  onClick: (_event: any, elements: any[]) => {
    if (!elements.length) return;

    const index = elements[0].index;

    const selected = props.categories[index];

    emit('selectCategory', selected.categoryId);
  },
};
</script>

<template>
  <div class="relative h-full w-full">
    <Doughnut
      :data="chartData"
      :options="options"
    />

    <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-xs text-gray-500"> {{ month }}월 총 소비 </span>

      <span class="text-base font-bold text-gray-800">
        {{ totalAmount.toLocaleString() }}원
      </span>
    </div>
  </div>
</template>
