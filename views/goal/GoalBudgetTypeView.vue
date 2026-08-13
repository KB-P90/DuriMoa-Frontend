<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import GoalStepHeader from '@/components/goal/GoalStepHeader.vue';
import GoalStepNav from '@/components/goal/GoalStepNav.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { GoalBudgetEstimateSkeleton, GoalSavingsNoticeSkeleton } from '@/components/skeleton/goal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BUDGET_TYPES, GOAL_CATEGORIES } from '@/constants/goal';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { getGoalBudgetEstimate } from '@/server/goalApi';
import { useGoalStore } from '@/stores/goalStore';
import type { BudgetTypeCode } from '@/types/goal';
import { formatAmount } from '@/utils/format';

useAuthCheck();

const router = useRouter();
const goalStore = useGoalStore();

const selected = ref<BudgetTypeCode>(goalStore.draft.budgetType ?? 'balanced');

const budgetPreviews = ref<Record<BudgetTypeCode, number>>({
  saving: 0,
  balanced: 0,
  flex: 0,
});

const estimateLoading = ref(true);

async function loadBudgetEstimate() {
  if (!goalStore.draft.region) {
    estimateLoading.value = false;
    return;
  }

  try {
    const estimate = await getGoalBudgetEstimate(goalStore.draft.region);
    for (const { type, totalAmount } of estimate.estimates) {
      const budgetType = BUDGET_TYPES.find((item) => item.label === type);
      if (budgetType) budgetPreviews.value[budgetType.code] = totalAmount / 10_000;
    }
  } finally {
    estimateLoading.value = false;
  }
}

onMounted(loadBudgetEstimate);

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
  const predicted = budgetPreviews.value[code];
  const requiredMonthly = remainingMonths.value
    ? Math.max(Math.round((predicted - CURRENT_ASSET) / remainingMonths.value), 0)
    : null;

  return { predicted, requiredMonthly };
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
  <PageHeader
    title="결혼 목표 설정"
    :showBack="true"
  />
  <div class="p-4 pb-[calc(6rem+env(safe-area-inset-bottom))]">
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
          {{ type.label }}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        v-for="type in BUDGET_TYPES"
        :key="type.code"
        :value="type.code"
      >
        <div class="rounded-2xl bg-dm-gray-light p-5 text-center md:h-full">
          <p class="text-xs font-bold text-dm-gray-dark">예측 결혼 예산</p>
          <GoalBudgetEstimateSkeleton
            v-if="estimateLoading"
            class="mt-2"
          />
          <p
            v-else
            class="mt-2 flex items-end justify-center gap-1"
          >
            <span class="text-4xl font-extrabold text-dm-mint-darker">
              {{ formatAmount(previewFor(type.code).predicted) }}
            </span>
            <span class="mb-1 text-sm font-bold text-dm-mint-darker">만원</span>
          </p>
        </div>
      </TabsContent>
    </Tabs>

    <div class="mt-4 flex gap-2 rounded-xl bg-pink-01 p-4">
      <span aria-hidden="true">⚠️</span>
      <GoalSavingsNoticeSkeleton v-if="estimateLoading" />
      <p
        v-else
        class="text-xs leading-5 text-[#232631]"
      >
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
