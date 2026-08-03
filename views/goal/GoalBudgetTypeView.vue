<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import GoalStepHeader from '@/components/goal/GoalStepHeader.vue';
import GoalStepNav from '@/components/goal/GoalStepNav.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BUDGET_TYPES, GOAL_CATEGORIES } from '@/constants/goal';
import { useGoalStore } from '@/stores/goalStore';
import type { BudgetTypeCode } from '@/types/goal';
import { formatAmount } from '@/utils/format';

const router = useRouter();
const goalStore = useGoalStore();

const selected = ref<BudgetTypeCode>(goalStore.draft.budgetType ?? 'balanced');

// GET /api/goal/stat?region= 붙기 전까지의 목업 값. 실제 응답 오면 이 테이블만 갈아끼우면 됨.
const BUDGET_PREVIEWS: Record<BudgetTypeCode, { predicted: number; nationalAverage: number }> = {
  saving: { predicted: 5000, nationalAverage: 5418 },
  balanced: { predicted: 6500, nationalAverage: 6120 },
  flex: { predicted: 8200, nationalAverage: 7450 },
};

// 자산/저축 가능액은 마이페이지·홈 도메인 데이터가 필요해서 아직 목업.
const CURRENT_ASSET = 3119;
const AVAILABLE_MONTHLY = 180;

const remainingMonths = computed(() => {
  if (!goalStore.draft.weddingDate) return null;

  const today = new Date();
  const target = new Date(goalStore.draft.weddingDate);
  const months =
    (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());

  return Math.max(months, 1);
});

function previewFor(code: BudgetTypeCode) {
  const { predicted, nationalAverage } = BUDGET_PREVIEWS[code];
  const diff = nationalAverage - predicted;
  const requiredMonthly = remainingMonths.value
    ? Math.max(Math.round((predicted - CURRENT_ASSET) / remainingMonths.value), 0)
    : null;

  return { predicted, nationalAverage, diff, requiredMonthly };
}

// 경고 박스는 Tabs 컨텍스트가 아니라 selected를 직접 보고 그리는 반응형 블록이라
// <Tabs> 바깥, TabsContent와 분리된 자리에 둬도 선택 탭에 맞게 그대로 바뀐다.
const selectedPreview = computed(() => previewFor(selected.value));

function handleNext() {
  goalStore.setBudgetType(selected.value);
  router.push({
    name: 'goal-category-budget',
    params: { categoryCode: GOAL_CATEGORIES[0].code },
  });
}

function handlePrev() {
  router.push({ name: 'goal-schedule' });
}
</script>

<template>
  <div class="p-4">
    <GoalStepHeader
      step="2/8"
      title="유형별 평균 예산을 보여드려요"
    />

    <Tabs
      :model-value="selected"
      class="w-full"
      @update:model-value="selected = $event as BudgetTypeCode"
    >
      <TabsList class="grid w-full grid-cols-3 bg-dm-gray-light">
        <TabsTrigger
          v-for="type in BUDGET_TYPES"
          :key="type.code"
          :value="type.code"
          class="text-dm-gray-dark data-[state=active]:text-dm-mint-darker"
        >
          {{ type.label }}{{ type.code === 'balanced' ? ' · 추천' : '' }}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        v-for="type in BUDGET_TYPES"
        :key="type.code"
        :value="type.code"
      >
        <div class="rounded-2xl bg-dm-gray-light p-5 text-center md:h-full">
          <p class="text-xs font-bold text-dm-gray-dark">예측 결혼 예산</p>
          <p class="mt-2 flex items-end justify-center gap-1">
            <span class="text-4xl font-extrabold text-dm-mint-darker">
              {{ formatAmount(previewFor(type.code).predicted) }}
            </span>
            <span class="mb-1 text-sm font-bold text-dm-mint-darker">만원</span>
          </p>
          <p class="mt-2 text-xs text-dm-gray-dark">
            전국 평균 {{ formatAmount(previewFor(type.code).nationalAverage) }}만원보다
            {{ formatAmount(previewFor(type.code).diff) }}만원
            {{ previewFor(type.code).diff >= 0 ? '낮아요' : '높아요' }}
          </p>
        </div>
      </TabsContent>
    </Tabs>

    <div class="mt-4 flex gap-2 rounded-xl bg-dm-rose-light p-4">
      <span aria-hidden="true">⚠️</span>
      <p class="text-xs leading-5 text-[#232631]">
        <template v-if="selectedPreview.requiredMonthly !== null">
          현재 자산 {{ formatAmount(CURRENT_ASSET) }}만원 · 남은 {{ remainingMonths }}개월 기준 월
          {{ formatAmount(selectedPreview.requiredMonthly) }}만원을 모아야 해요. 지금 저축 가능액(월
          {{ formatAmount(AVAILABLE_MONTHLY) }}만원)보다
          {{ selectedPreview.requiredMonthly > AVAILABLE_MONTHLY ? '많아요' : '적어요' }}.
        </template>
        <template v-else>결혼 예정일을 입력하면 필요 저축액을 계산해드려요.</template>
      </p>
    </div>

    <p class="mt-3 text-[11px] text-dm-gray-dark">
      지역 평균 출처 · 2025년 결혼 비용 통계 (기준연도 2025 · 갱신 2026.06.30)
    </p>

    <GoalStepNav
      @prev="handlePrev"
      @next="handleNext"
    />
  </div>
</template>
