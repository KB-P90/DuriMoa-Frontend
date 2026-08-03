import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';

import { postGoal } from '@/server/goalApi';
import { BUDGET_TYPES, GOAL_CATEGORIES } from '@/constants/goal';
import type {
  BudgetTypeCode,
  GoalCategoryCode,
  GoalDraft,
  GoalSubmission,
  RegionName,
} from '@/types/goal';

export const useGoalStore = defineStore('goal', () => {
  const draft = reactive<GoalDraft>({
    weddingDate: null,
    region: null,
    budgetType: null,
    items: {},
    groomRatio: 50,
  });

  const excluded = reactive<Partial<Record<GoalCategoryCode, boolean>>>({});

  const totalBudget = computed(() =>
    Object.values(draft.items).reduce((sum: number, amount) => sum + (amount ?? 0), 0)
  );

  function setSchedule(weddingDate: string, region: RegionName) {
    draft.weddingDate = weddingDate;
    draft.region = region;
  }

  function setBudgetType(budgetType: BudgetTypeCode) {
    draft.budgetType = budgetType;
  }

  function setCategoryAmount(categoryCode: GoalCategoryCode, amount: number) {
    draft.items[categoryCode] = amount;
    if (amount > 0) excluded[categoryCode] = false;
  }

  function excludeCategory(categoryCode: GoalCategoryCode) {
    excluded[categoryCode] = true;
    draft.items[categoryCode] = 0;
  }

  function setGroomRatio(ratio: number) {
    draft.groomRatio = Math.min(Math.max(Math.round(ratio), 0), 100);
  }

  function reset() {
    draft.weddingDate = null;
    draft.region = null;
    draft.budgetType = null;
    draft.items = {};
    draft.groomRatio = 50;
    for (const key of Object.keys(excluded)) {
      delete excluded[key as GoalCategoryCode];
    }
  }

  // 카테고리별 알뜰형/균형형/플렉스형 라벨은 GET /api/goal/stat 조회가 필요해서
  // 이미 그 데이터를 들고 있는 화면(GoalSummaryView)에서 계산해 넘겨받는다.
  async function submitGoal(categoryTypeLabels: Partial<Record<GoalCategoryCode, string>>) {
    const budgetTypeLabel =
      BUDGET_TYPES.find((type) => type.code === draft.budgetType)?.label ?? '균형형';

    const payload: GoalSubmission = {
      name: `${budgetTypeLabel} 결혼 예산`,
      weddingDate: draft.weddingDate ?? '',
      region: draft.region ?? '',
      groomRatio: draft.groomRatio,
      brideRatio: 100 - draft.groomRatio,
      items: GOAL_CATEGORIES.map((category) => ({
        category: category.label,
        targetAmount: draft.items[category.code] ?? 0,
        included: !excluded[category.code],
        type: categoryTypeLabels[category.code] ?? '균형형',
      })),
    };

    return postGoal(payload);
  }

  return {
    draft,
    excluded,
    totalBudget,
    setSchedule,
    setBudgetType,
    setCategoryAmount,
    excludeCategory,
    setGroomRatio,
    submitGoal,
    reset,
  };
});
