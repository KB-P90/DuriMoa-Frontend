import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { AiChatRequestDto, AiChatResponseDto } from '@/types/dto/aiChat.dto';

export const postAiChatMessage = async (payload: AiChatRequestDto) => {
  const { data } = await api.post<ApiResponse<AiChatResponseDto>>('/ai/chat', payload);
  return data.data;
};
