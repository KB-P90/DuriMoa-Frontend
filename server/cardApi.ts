import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { CardRecommendationCategory } from '@/types/card';
import type { CardDetailResponseDto, CardStrategyDataDto } from '@/types/dto/card.dto';

export const getCardStrategyApi = async (
  amount?: number,
  category?: CardRecommendationCategory | null
): Promise<CardStrategyDataDto> => {
  const { data } = await api.get<ApiResponse<CardStrategyDataDto>>('/strategy/card', {
    params: {
      ...(amount ? { amount } : {}),
      ...(category ? { category } : {}),
    },
    headers: {
      Accept: 'application/json',
    },
  });
  return data.data;
};

export const getOwnedCardDetailApi = async (cardId: string): Promise<CardDetailResponseDto> => {
  const { data } = await api.get<ApiResponse<CardDetailResponseDto>>(`/strategy/card/${cardId}`, {
    headers: {
      Accept: 'application/json',
    },
  });
  return data.data;
};

export const getRecommendedCardProductDetailApi = async (
  cardProductId: string
): Promise<CardDetailResponseDto> => {
  const { data } = await api.get<ApiResponse<CardDetailResponseDto>>(
    `/strategy/card/products/${cardProductId}`,
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );
  return data.data;
};
