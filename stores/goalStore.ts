import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';

import { deleteGoal, postGoal, updateGoal } from '@/server/goalApi';
import { GOAL_CATEGORIES } from '@/constants/goal';
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
    name: null,
  });

  const excluded = reactive<Partial<Record<GoalCategoryCode, boolean>>>({});

  // 예산 시안 목록 카드를 눌러 수정하러 들어온 경우, 대상 goalId. 새로 만드는 흐름이면 null.
  const editingGoalId = ref<number | null>(null);
  // 수정 중인 시안이 현재 메인 시안인지. 메인 시안은 다른 시안으로 바뀌기 전까지 삭제할 수 없다.
  const editingGoalIsMain = ref(false);

  // 예산 시안 카드를 눌러 수정 화면으로 들어올 때, 이미 만들어진 시안 데이터를 draft로 채운다.
  function loadFromProposal(goal: GoalProposal) {
    editingGoalId.value = goal.goalId;
    editingGoalIsMain.value = goal.isMain;
    draft.name = goal.name;
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

  // 시안 이름을 아직 안 정했을 때(새로 만드는 흐름) 쓰는 기본 이름.
  const defaultName = computed(() => '우리의 결혼 예산');

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
    draft.name = null;
    editingGoalId.value = null;
    editingGoalIsMain.value = false;
    for (const key of Object.keys(excluded)) {
      delete excluded[key as GoalCategoryCode];
    }
  }

  // 카테고리별 알뜰형/균형형/플렉스형 라벨은 GET /api/goal/stat 조회가 필요해서
  // 이미 그 데이터를 들고 있는 화면(GoalSummaryView)에서 계산해 넘겨받는다.
  async function submitGoal(categoryTypeLabels: Partial<Record<GoalCategoryCode, string>>) {
    const payload: GoalSubmission = {
      name: draft.name?.trim() || defaultName.value,
      weddingDate: draft.weddingDate ?? '',
      region: draft.region ?? '',
      groomRatio: draft.groomRatio,
      brideRatio: 100 - draft.groomRatio,
      items: GOAL_CATEGORIES.map((category) => ({
        category: category.label,
        targetAmount: draft.items[category.code] ?? 0,
        included: !excluded[category.code],
        type: categoryTypeLabels[category.code] || '균형형',
      })),
    };

    if (editingGoalId.value !== null) {
      return updateGoal(editingGoalId.value, payload);
    }

    return postGoal(payload);
  }

  // 메인 시안은 다른 시안으로 교체되기 전까지 삭제할 수 없어서, 호출 쪽(화면)에서
  // editingGoalIsMain을 먼저 확인해 안내 문구를 보여주고 이 함수는 그 외의 경우에만 호출한다.
  async function deleteEditingGoal() {
    if (editingGoalId.value === null) return;

    await deleteGoal(editingGoalId.value);
    reset();
  }

  return {
    draft,
    excluded,
    editingGoalId,
    editingGoalIsMain,
    totalBudget,
    defaultName,
    setSchedule,
    setBudgetType,
    setCategoryAmount,
    excludeCategory,
    setGroomRatio,
    loadFromProposal,
    submitGoal,
    deleteEditingGoal,
    reset,
  };
});
