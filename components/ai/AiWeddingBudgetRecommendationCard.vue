<script setup lang="ts">
import { ArrowRight, ChevronDown, CircleAlert, Lightbulb, Sparkles } from '@lucide/vue';
import { GOAL_CATEGORIES } from '@/constants/goal';
import { formatWon } from '@/utils/format';
import type { WeddingBudgetRecommendation } from '@/types/aiChat';

defineProps<{
  recommendation: WeddingBudgetRecommendation;
}>();

const emit = defineEmits<{
  apply: [];
}>();

const BUDGET_TYPE_LABELS: Record<WeddingBudgetRecommendation['budgetType'], string> = {
  saving: '알뜰형',
  balanced: '균형형',
  flex: '플렉스형',
};
</script>

<template>
  <section class="w-full rounded-2xl border border-dm-mint-dark/60 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-2">
        <span
          class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-dm-mint-light text-dm-mint-darker"
          aria-hidden="true"
        >
          <Sparkles class="h-5 w-5" />
        </span>
        <div>
          <p class="text-sm font-extrabold text-gray-900">AI 추천 시안</p>
          <p class="mt-0.5 text-xs font-semibold text-dm-mint-darker">
            {{ BUDGET_TYPE_LABELS[recommendation.budgetType] }} ·
            {{ recommendation.analysisScope === 'couple' ? '커플 합산' : '개인' }} 분석
          </p>
        </div>
      </div>
      <p class="shrink-0 text-base font-extrabold text-brand-dark">
        {{ formatWon(recommendation.totalBudget) }}
      </p>
    </div>

    <div class="mt-4 divide-y divide-dm-gray/15 rounded-xl bg-dm-gray-light px-3">
      <div
        v-for="category in GOAL_CATEGORIES"
        :key="category.code"
        class="flex items-center justify-between py-2.5"
      >
        <span class="flex items-center gap-2 text-xs font-semibold text-gray-800">
          <img
            :src="category.icon"
            :alt="category.label"
            class="h-5 w-5 object-contain"
          />
          {{ category.label }}
        </span>
        <span class="text-sm font-bold text-gray-900">
          {{ formatWon(recommendation.items[category.code]) }}
        </span>
      </div>
    </div>

    <details
      class="group mt-3 overflow-hidden rounded-xl border border-dm-mint-dark/40 bg-dm-mint-light/55"
    >
      <summary
        class="flex cursor-pointer list-none items-center gap-2 p-3 text-xs font-extrabold text-gray-900 transition hover:bg-dm-mint-light [&::-webkit-details-marker]:hidden"
      >
        <Lightbulb class="h-4 w-4 shrink-0 text-dm-mint-darker" />
        <span class="flex-1">추천 판단 근거 자세히 보기</span>
        <ChevronDown
          class="h-4 w-4 shrink-0 text-dm-mint-darker transition-transform duration-200 group-open:rotate-180"
        />
      </summary>

      <div class="border-t border-dm-mint-dark/30 px-3 pb-3 pt-2.5">
        <p class="text-xs leading-5 text-dm-gray-dark">
          {{ recommendation.reason }}
        </p>

        <ol class="mt-3 space-y-3 border-t border-dm-mint-dark/30 pt-3">
          <li
            v-for="(detail, index) in recommendation.reasonDetails"
            :key="detail.title"
            class="flex gap-2.5"
          >
            <span
              class="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-[10px] font-extrabold text-dm-mint-darker"
            >
              {{ index + 1 }}
            </span>
            <div>
              <p class="text-xs font-extrabold text-gray-800">{{ detail.title }}</p>
              <p class="mt-0.5 text-xs leading-5 text-dm-gray-dark">
                {{ detail.description }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </details>

    <div
      v-if="recommendation.warning"
      class="mt-3 flex gap-2 rounded-xl bg-pink-01 p-3 text-xs leading-5 text-brand-dark"
    >
      <CircleAlert class="mt-0.5 h-4 w-4 shrink-0" />
      <p>{{ recommendation.warning }}</p>
    </div>

    <button
      type="button"
      class="mt-4 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-brand text-sm font-extrabold text-white transition hover:bg-brand-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand/30"
      @click="emit('apply')"
    >
      최종 예산 확인하기
      <ArrowRight class="h-4 w-4" />
    </button>
  </section>
</template>
