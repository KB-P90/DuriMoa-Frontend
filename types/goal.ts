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
  // 시안 이름. 새로 만드는 흐름에서는 null로 두고 제출 시 자동으로 이름을 붙인다.
  name: string | null;
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

export interface GoalProposalItem {
  category: string;
  completed: boolean;
  goalItemId: number;
  included: boolean;
  targetAmount: number;
  type: string;
}

// NORMAL: 기본 상태 · PENDING: 메인 시안 승인 요청 중 · CONFIRMED: 메인 시안으로 최종 확정.
export type GoalProposalStatus = 'NORMAL' | 'PENDING' | 'CONFIRMED';

// GET /goal 응답 항목. isMain·status·requestedByMe 조합으로 목록 카드 상태를 판별한다.
export interface GoalProposal {
  goalId: number;
  name: string;
  createdAt: string;
  weddingDate: string;
  region: string;
  groomRatio: number;
  brideRatio: number;
  totalBudget: number;
  isMain: boolean;
  status: GoalProposalStatus;
  requestedByMe: boolean;
  requestedAt: string | null;
  items: GoalProposalItem[];
}

// PATCH /goal/{goalId}/decision 요청 본문
export type MainProposalDecision = 'APPROVE' | 'REJECT';

export type BudgetProposalStatus = 'main' | 'pending' | 'general' | 'incoming';

// 예산 시안 목록 카드가 화면에 그리기 위한 뷰모델. GoalProposal → 이 형태로 매핑해서 사용한다.
export interface ProposalCardItem {
  id: number;
  title: string;
  createdAt: string;
  amount: number;
  status: BudgetProposalStatus;
}

// 상대방이 보낸 메인 시안 수락 요청 상세 데이터. 목록 응답만으로 계산 가능한 값들로 구성한다.
export interface MainProposalRequest {
  proposerName: string;
  proposal: { title: string; amount: number };
  diffFromCurrentMain: number;
  monthlySaving: { before: number; after: number };
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
