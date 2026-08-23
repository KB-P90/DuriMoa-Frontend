import type {
  AiChatResponseDto,
  WeddingBudgetRecommendationResponseDto,
} from '@/types/dto/aiChat.dto';
import type {
  AiAction,
  AiChatResponse,
  AiIntent,
  WeddingBudgetRecommendation,
} from '@/types/aiChat';

const INTENT_MAP: Record<AiChatResponseDto['intent'], AiIntent> = {
  WEDDING_BUDGET_RECOMMENDATION: 'weddingBudgetRecommendation',
  SPENDING_REPORT: 'spendingReport',
  GREETING: 'greeting',
  UNKNOWN: 'unknown',
};

const ACTION_MAP: Record<NonNullable<AiChatResponseDto['action']>, AiAction> = {
  START_WEDDING_BUDGET_FLOW: 'startWeddingBudgetFlow',
  GENERATE_SPENDING_REPORT: 'generateSpendingReport',
};

export function toAiChatResponse(dto: AiChatResponseDto): AiChatResponse {
  return {
    model: dto.model,
    response: dto.response,
    intent: INTENT_MAP[dto.intent],
    action: dto.action ? ACTION_MAP[dto.action] : null,
  };
}

export function toWeddingBudgetRecommendation(
  dto: WeddingBudgetRecommendationResponseDto
): WeddingBudgetRecommendation {
  return {
    name: dto.name,
    analysisScope: dto.analysisScope === 'COUPLE' ? 'couple' : 'personal',
    analyzedMemberCount: dto.analyzedMemberCount,
    analysisMonths: dto.analysisMonths,
    dataSufficient: dto.dataSufficient,
    sustainableMonthlySaving: dto.sustainableMonthlySaving,
    affordableTotalBudget: dto.affordableTotalBudget,
    budgetType: dto.budgetType,
    items: { ...dto.items },
    totalBudget: dto.totalBudget,
    groomRatio: dto.groomRatio,
    brideRatio: dto.brideRatio,
    reason: dto.reason,
    reasonDetails: dto.reasonDetails?.map((detail) => ({ ...detail })) ?? [],
    warning: dto.warning,
  };
}
