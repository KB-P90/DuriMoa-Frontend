import type { BUDGET_TYPES, GOAL_CATEGORIES, REGIONS } from '@/constants/goal';

export type GoalCategoryCode = (typeof GOAL_CATEGORIES)[number]['code'];
export type BudgetTypeCode = (typeof BUDGET_TYPES)[number]['code'];
export type RegionName = (typeof REGIONS)[number];

export interface GoalDraft {
  weddingDate: string | null;
  region: RegionName | null;
  budgetType: BudgetTypeCode | null;
  items: Partial<Record<GoalCategoryCode, number>>;
  groomRatio: number;
}

// GET /api/goal/stat 응답 (지역·카테고리별 결혼 비용 분포)
export interface GoalCategoryStat {
  region: string;
  category: string;
  upper10: number;
  upper25: number;
  median: number;
  lower25: number;
  lower10: number;
}

// POST /api/goal 요청
export interface GoalSubmissionItem {
  category: string;
  targetAmount: number;
  included: boolean;
  type: string;
}

export interface GoalSubmission {
  name: string;
  weddingDate: string;
  region: string;
  groomRatio: number;
  brideRatio: number;
  items: GoalSubmissionItem[];
}
