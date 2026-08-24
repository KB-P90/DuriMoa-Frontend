export type AiIntentDto =
  'WEDDING_BUDGET_RECOMMENDATION' | 'SPENDING_REPORT' | 'GREETING' | 'UNKNOWN';

export type AiActionDto = 'START_WEDDING_BUDGET_FLOW' | 'GENERATE_SPENDING_REPORT';

export interface AiChatRequestDto {
  message: string;
}

export interface AiChatResponseDto {
  model: string;
  response: string;
  intent: AiIntentDto;
  action: AiActionDto | null;
}

export interface WeddingBudgetRecommendationRequestDto {
  weddingDate: string;
  region: string;
}

export interface WeddingBudgetItemsResponseDto {
  venue: number;
  studio: number;
  dress: number;
  makeup: number;
  reserve: number;
}

export interface WeddingBudgetReasonDetailResponseDto {
  title: string;
  description: string;
}

export interface WeddingBudgetRecommendationResponseDto {
  name: string;
  analysisScope: 'PERSONAL' | 'COUPLE';
  analyzedMemberCount: number;
  analysisMonths: number;
  dataSufficient: boolean;
  sustainableMonthlySaving: number;
  affordableTotalBudget: number;
  budgetType: 'saving' | 'balanced' | 'flex';
  items: WeddingBudgetItemsResponseDto;
  totalBudget: number;
  groomRatio: number;
  brideRatio: number;
  reason: string;
  reasonDetails: WeddingBudgetReasonDetailResponseDto[];
  warning: string | null;
}
