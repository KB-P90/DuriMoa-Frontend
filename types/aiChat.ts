import type { BudgetTypeCode, GoalCategoryCode } from '@/types/goal';

export interface AiChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  variant?: 'welcome';
}

export type AiIntent = 'weddingBudgetRecommendation' | 'greeting' | 'unknown';
export type AiAction = 'startWeddingBudgetFlow';

export interface AiChatResponse {
  model: string;
  response: string;
  intent: AiIntent;
  action: AiAction | null;
}

export type AiWeddingBudgetStep =
  'idle' | 'selectingDate' | 'selectingRegion' | 'analyzing' | 'result';

export interface WeddingBudgetReasonDetail {
  title: string;
  description: string;
}

export interface WeddingBudgetRecommendation {
  name: string;
  analysisScope: 'personal' | 'couple';
  analyzedMemberCount: number;
  analysisMonths: number;
  dataSufficient: boolean;
  sustainableMonthlySaving: number;
  affordableTotalBudget: number;
  budgetType: BudgetTypeCode;
  items: Record<GoalCategoryCode, number>;
  totalBudget: number;
  groomRatio: number;
  brideRatio: number;
  reason: string;
  reasonDetails: WeddingBudgetReasonDetail[];
  warning: string | null;
}
