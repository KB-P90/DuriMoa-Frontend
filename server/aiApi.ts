import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type {
  AiChatRequestDto,
  AiChatResponseDto,
  WeddingBudgetRecommendationRequestDto,
  WeddingBudgetRecommendationResponseDto,
} from '@/types/dto/aiChat.dto';
import type { SpendingReportResponseDto } from '@/types/dto/aiSpendingReport.dto';

export const postAiChatMessage = async (payload: AiChatRequestDto) => {
  const { data } = await api.post<ApiResponse<AiChatResponseDto>>('/ai/chat', payload);
  return data.data;
};

export const postWeddingBudgetRecommendation = async (
  payload: WeddingBudgetRecommendationRequestDto
) => {
  const { data } = await api.post<ApiResponse<WeddingBudgetRecommendationResponseDto>>(
    '/ai/wedding-budget/recommendation',
    payload
  );
  return data.data;
};

export const getSpendingReport = async () => {
  const { data } = await api.get<ApiResponse<SpendingReportResponseDto>>('/ai/spending-report');
  return data.data;
};
