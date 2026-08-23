<script setup lang="ts">
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { ExpenseCategoryColors } from '@/types/category';
import type { SpendingReportCategory } from '@/types/aiSpendingReport';
import { formatWon, formatWonAmount } from '@/utils/format';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  categories: readonly SpendingReportCategory[];
}>();

const totalAmount = computed(() =>
  props.categories.reduce((total, category) => total + category.amount, 0)
);

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: props.categories.map((category) => category.name),
  datasets: [
    {
      data: props.categories.map((category) => category.amount),
      backgroundColor: props.categories.map((category) => ExpenseCategoryColors[category.code]),
      borderWidth: 0,
    },
  ],
}));

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: {
      displayColors: false,
      callbacks: {
        label: (context: TooltipItem<'doughnut'>) => {
          const category = props.categories[context.dataIndex];
          return `${formatWonAmount(category.amount)} · ${Math.round(category.ratio)}%`;
        },
      },
    },
  },
};
</script>

<template>
  <div class="relative h-52 w-full">
    <Doughnut
      :data="chartData"
      :options="options"
    />

    <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-[11px] text-dm-gray-dark">총 소비</span>
      <strong class="mt-0.5 text-sm font-extrabold text-gray-900">
        {{ formatWon(totalAmount) }}
      </strong>
    </div>
  </div>
</template>
