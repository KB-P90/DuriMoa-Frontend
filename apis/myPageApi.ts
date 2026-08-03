import { api } from '@/apis/axios.js';
import type { ApiResponse } from '@/types/common';
import type { MyPageResponseDto } from '@/types/dto/myPage.dto';

export const getMyPage = async () => {
  const { data } = await api.get<ApiResponse<MyPageResponseDto>>('/mypage');
  return data.data;
};
