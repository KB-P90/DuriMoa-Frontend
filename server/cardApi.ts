import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { CardDetailResponseDto, CardStrategyDataDto } from '@/types/dto/card.dto';

const CARD_API_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6IkciLCJpYXQiOjE3ODU4MTg1OTEsImV4cCI6MTc4NTgyMjE5MX0.DdZp6UvQ6GNlzCo45noxOIHZ6Aqoq65Ku1WPAr72HXM';

export const getCardStrategyApi = async (amount?: number): Promise<CardStrategyDataDto> => {
  const { data } = await api.get<ApiResponse<CardStrategyDataDto>>('/strategy/card', {
    params: amount ? { amount } : undefined,
    headers: {
      Authorization: `Bearer ${CARD_API_TOKEN}`,
    },
  });
  return data.data;
};

export const getCardDetailApi = async (userCardKey: string): Promise<CardDetailResponseDto> => {
  const { data } = await api.get<ApiResponse<CardDetailResponseDto>>(`/strategy/card/${userCardKey}`, {
    headers: {
      Authorization: `Bearer ${CARD_API_TOKEN}`,
    },
  });
  return data.data;
};
