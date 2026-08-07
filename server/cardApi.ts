import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { CardDetailResponseDto, CardStrategyDataDto } from '@/types/dto/card.dto';

export const getCardStrategyApi = async (amount?: number): Promise<CardStrategyDataDto> => {
  console.log('카드추천 api 요청', { amount });
  const { data } = await api.get<ApiResponse<CardStrategyDataDto>>('/strategy/card', {
    params: amount ? { amount } : undefined,
  });
  console.log('카드추천 api 응답', data);
  return data.data;
};

export const getCardDetailApi = async (cardId: string): Promise<CardDetailResponseDto> => {
  console.log('카드상세 api 요청', { cardId });
  const { data } = await api.get<ApiResponse<CardDetailResponseDto>>(`/strategy/card/${cardId}`);
  console.log('카드상세 api 응답', data);
  return data.data;
};
