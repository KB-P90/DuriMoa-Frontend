import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { LinkedAssetsResponseDto } from '@/types/dto/linkedAsset.dto';

export const getLinkedAssets = async () => {
  const { data } = await api.get<ApiResponse<LinkedAssetsResponseDto>>('/mypage/linked-assets');
  return data.data;
};
