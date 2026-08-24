<script setup lang="ts">
import { CalendarDays, ChartNoAxesCombined, CircleAlert, Sparkles } from '@lucide/vue';
import { computed } from 'vue';
import AiSpendingCategoryChart from '@/components/ai/AiSpendingCategoryChart.vue';
import AiSpendingTrendChart from '@/components/ai/AiSpendingTrendChart.vue';
import { ExpenseCategoryColors } from '@/types/category';
import type { SpendingReport } from '@/types/aiSpendingReport';
import { formatDateDot, formatWonAmount } from '@/utils/format';
import { formatComparisonRatio, getWeekdayIntensityClass } from '@/utils/spendingReport';

const props = defineProps<{
  report: SpendingReport;
}>();

const visibleCategories = computed(() => props.report.categories.slice(0, 5));
const comparisonText = computed(() =>
  formatComparisonRatio(props.report.weekdayAnalysis.weekendToWeekdayRatio)
);
</script>

<template>
  <article
    class="w-full max-w-xl overflow-hidden rounded-2xl rounded-bl-md border border-dm-gray/25 bg-white shadow-sm"
  >
    <header class="bg-dm-mint-light px-4 py-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="flex items-center gap-1.5 text-xs font-bold text-dm-mint-darker">
            <Sparkles class="h-4 w-4" />
            AI 개인 소비 분석
          </p>
          <h2 class="mt-1 text-lg font-extrabold text-gray-900">가입 후 소비 리포트</h2>
        </div>
        <span class="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-dm-gray-dark">
          {{ report.analysisDays }}일 분석
        </span>
      </div>
      <p class="mt-2 flex items-center gap-1.5 text-xs text-dm-gray-dark">
        <CalendarDays class="h-3.5 w-3.5" />
        {{ formatDateDot(report.analysisStartDate) }} ~
        {{ formatDateDot(report.analysisEndDate) }}
      </p>
    </header>

    <div class="space-y-5 p-4">
      <section class="rounded-xl border border-dm-mint bg-dm-mint-lighter p-3.5">
        <p class="flex items-center gap-1.5 text-xs font-extrabold text-dm-mint-darker">
          <Sparkles class="h-3.5 w-3.5" />
          AI 한눈 요약
        </p>
        <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800">
          {{ report.summary }}
        </p>
      </section>

      <section>
        <h3 class="text-sm font-extrabold text-gray-900">전체 소비</h3>
        <dl class="mt-2 grid grid-cols-2 gap-2">
          <div class="rounded-xl bg-dm-gray-light p-3">
            <dt class="text-[11px] text-dm-gray-dark">총 지출</dt>
            <dd class="mt-1 text-sm font-extrabold text-gray-900">
              {{ formatWonAmount(report.totalExpense) }}
            </dd>
          </div>
          <div class="rounded-xl bg-dm-gray-light p-3">
            <dt class="text-[11px] text-dm-gray-dark">월 환산 평균</dt>
            <dd class="mt-1 text-sm font-extrabold text-gray-900">
              {{ formatWonAmount(report.averageMonthlyExpense) }}
            </dd>
          </div>
          <div class="rounded-xl bg-dm-gray-light p-3">
            <dt class="text-[11px] text-dm-gray-dark">지출 건수</dt>
            <dd class="mt-1 text-sm font-extrabold text-gray-900">
              {{ report.transactionCount.toLocaleString('ko-KR') }}건
            </dd>
          </div>
          <div class="rounded-xl bg-dm-gray-light p-3">
            <dt class="text-[11px] text-dm-gray-dark">가장 큰 항목</dt>
            <dd class="mt-1 truncate text-sm font-extrabold text-gray-900">
              {{ report.topCategoryName ?? '아직 없음' }}
              <span
                v-if="report.topCategoryName"
                class="text-xs text-dm-gray-dark"
              >
                {{ Math.round(report.topCategoryRatio) }}%
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <div class="flex items-end justify-between gap-2">
          <div>
            <h3 class="text-sm font-extrabold text-gray-900">지출 흐름</h3>
            <p class="mt-0.5 text-[11px] text-dm-gray-dark">
              {{ report.trendUnit === 'weekly' ? '주별' : '월별' }} 합계
            </p>
          </div>
          <span
            v-if="report.recentTrendRate !== null"
            class="text-xs font-bold"
            :class="report.recentTrendRate > 0 ? 'text-red' : 'text-deep-green'"
          >
            직전 대비 {{ report.recentTrendRate > 0 ? '+' : ''
            }}{{ Math.round(report.recentTrendRate) }}%
          </span>
        </div>
        <AiSpendingTrendChart
          v-if="report.trend.length > 0"
          class="mt-2"
          :trend="report.trend"
        />
        <p class="mt-1 text-[10px] text-dm-gray-dark">* 분석 기간이 일부만 포함된 구간</p>
      </section>

      <section>
        <h3 class="text-sm font-extrabold text-gray-900">항목별 소비</h3>
        <template v-if="report.categories.length > 0">
          <AiSpendingCategoryChart
            class="mt-2"
            :categories="report.categories"
          />
          <ul class="mt-2 space-y-2">
            <li
              v-for="category in visibleCategories"
              :key="category.code"
              class="flex items-center gap-2 text-xs"
            >
              <span
                class="h-2.5 w-2.5 shrink-0 rounded-full"
                :style="{ backgroundColor: ExpenseCategoryColors[category.code] }"
              />
              <span class="min-w-0 flex-1 truncate text-gray-700">{{ category.name }}</span>
              <span class="font-bold text-gray-900">{{ Math.round(category.ratio) }}%</span>
              <span class="w-24 text-right text-dm-gray-dark">
                {{ formatWonAmount(category.amount) }}
              </span>
            </li>
          </ul>
        </template>
        <p
          v-else
          class="mt-3 rounded-xl bg-dm-gray-light p-4 text-center text-xs text-dm-gray-dark"
        >
          표시할 지출 항목이 아직 없어요.
        </p>
      </section>

      <section>
        <div class="flex items-center gap-1.5">
          <ChartNoAxesCombined class="h-4 w-4 text-dm-mint-darker" />
          <h3 class="text-sm font-extrabold text-gray-900">요일별 소비 패턴</h3>
        </div>
        <div class="mt-3 grid grid-cols-7 gap-1.5">
          <div
            v-for="day in report.weekdayAnalysis.weekdays"
            :key="day.code"
            class="rounded-lg px-1 py-2 text-center"
            :class="getWeekdayIntensityClass(day.relativeStrength)"
          >
            <p class="text-[10px] font-bold">{{ day.name.slice(0, 1) }}</p>
            <p class="mt-1 truncate text-[9px] font-extrabold">
              {{ Math.round(day.averageAmount / 10_000) }}만
            </p>
          </div>
        </div>
        <div class="mt-3 rounded-xl bg-dm-gray-light p-3">
          <p class="text-xs font-extrabold text-gray-800">{{ comparisonText }}</p>
          <p class="mt-1 text-[11px] leading-4 text-dm-gray-dark">
            가장 많이 쓴 요일은 {{ report.weekdayAnalysis.peakDayName }}이고,
            <template v-if="report.weekdayAnalysis.topWeekendCategoryName">
              주말에는 {{ report.weekdayAnalysis.topWeekendCategoryName }} 비중이 가장 커요.
            </template>
            <template v-else>주말 지출 항목은 아직 충분하지 않아요.</template>
          </p>
        </div>
      </section>

      <p
        v-if="report.warning"
        class="flex items-start gap-2 rounded-xl bg-yellow-08/10 px-3 py-2.5 text-xs leading-5 text-yellow-08"
      >
        <CircleAlert class="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {{ report.warning }}
      </p>
    </div>
  </article>
</template>
