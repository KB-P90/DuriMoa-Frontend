<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { ExpenseCategoryColors } from '@/types/category';
import type { SpendingReportTrend } from '@/types/aiSpendingReport';
import { formatWonAmount } from '@/utils/format';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const props = defineProps<{
  trend: readonly SpendingReportTrend[];
}>();

const chartData = computed<ChartData<'line'>>(() => ({
  labels: props.trend.map((item) => `${item.label}${item.partialPeriod ? '*' : ''}`),
  datasets: [
    {
      label: '지출',
      data: props.trend.map((item) => item.amount),
      borderColor: ExpenseCategoryColors.FOOD,
      backgroundColor: `${ExpenseCategoryColors.FOOD}33`,
      borderWidth: 2,
      fill: true,
      tension: 0.35,
      pointBackgroundColor: ExpenseCategoryColors.FOOD,
      pointBorderWidth: 0,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
  ],
}));

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: { display: false },
    tooltip: {
      displayColors: false,
      callbacks: {
        label: (context: TooltipItem<'line'>) => formatWonAmount(context.parsed.y ?? 0),
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6 },
    },
    y: {
      beginAtZero: true,
      ticks: {
        maxTicksLimit: 5,
        callback: (value) => `${Math.round(Number(value) / 10_000)}만`,
      },
    },
  },
};
</script>

<template>
  <div class="h-48 w-full">
    <Line
      :data="chartData"
      :options="options"
    />
  </div>
</template>
