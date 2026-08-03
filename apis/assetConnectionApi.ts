import { api } from '@/apis/axios.js';
import type { ApiResponse } from '@/types/common';
import type { AssetConnectionFormDto } from '@/types/dto/assetConnection.dto';

export const getAccountConnectionForm = async () => {
  const { data } = await api.get<ApiResponse<AssetConnectionFormDto>>('/mypage/accounts/connection-form');
  return data.data;
};

export const getCardConnectionForm = async () => {
  const { data } = await api.get<ApiResponse<AssetConnectionFormDto>>('/mypage/cards/connection-form');
  return data.data;
};
