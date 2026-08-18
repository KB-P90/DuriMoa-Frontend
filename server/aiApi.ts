import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type {
  AiChatRequestDto,
  AiChatResponseDto,
  WeddingBudgetRecommendationRequestDto,
  WeddingBudgetRecommendationResponseDto,
} from '@/types/dto/aiChat.dto';

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
