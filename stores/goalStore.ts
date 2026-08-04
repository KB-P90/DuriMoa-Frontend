import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';

import { postGoal, updateGoal } from '@/server/goalApi';
import { BUDGET_TYPES, GOAL_CATEGORIES } from '@/constants/goal';
import type {
  BudgetTypeCode,
  GoalCategoryCode,
  GoalDraft,
  GoalProposal,
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

  // 예산 시안 목록 카드를 눌러 수정하러 들어온 경우, 대상 goalId. 새로 만드는 흐름이면 null.
  const editingGoalId = ref<number | null>(null);

  // 예산 시안 카드를 눌러 수정 화면으로 들어올 때, 이미 만들어진 시안 데이터를 draft로 채운다.
  function loadFromProposal(goal: GoalProposal) {
    editingGoalId.value = goal.goalId;
    draft.weddingDate = goal.weddingDate;
    draft.region = goal.region as RegionName;
    draft.groomRatio = goal.groomRatio;
    draft.items = {};

    for (const key of Object.keys(excluded)) {
      delete excluded[key as GoalCategoryCode];
    }

    for (const item of goal.items) {
      const category = GOAL_CATEGORIES.find(
        (candidate) => candidate.label === item.category.trim()
      );
      if (!category) {
        if (import.meta.env.DEV) {
          console.warn(
            `[goalStore] "${item.category}" 카테고리를 GOAL_CATEGORIES에서 찾지 못해 금액을 채우지 못했어요.`
          );
        }
        continue;
      }

      draft.items[category.code] = item.targetAmount;
      excluded[category.code] = !item.included;
    }
  }

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
    editingGoalId.value = null;
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

    if (editingGoalId.value !== null) {
      return updateGoal(editingGoalId.value, payload);
    }

    return postGoal(payload);
  }

  return {
    draft,
    excluded,
    editingGoalId,
    totalBudget,
    setSchedule,
    setBudgetType,
    setCategoryAmount,
    excludeCategory,
    setGroomRatio,
    loadFromProposal,
    submitGoal,
    reset,
  };
});
