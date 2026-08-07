import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type {
  MyPageCoupleAcceptRequestDto,
  MyPageCoupleInviteRequestDto,
  MyPageCouplePartnerResponseDto,
  MyPageLogoutResponseDto,
  MyPageProfileResponseDto,
} from '@/types/dto/myPage.dto';

export const getMyPageProfile = async () => {
  const { data } = await api.get<ApiResponse<MyPageProfileResponseDto>>('/users/profile');
  return data.data;
};

export const updateMyPageProfile = async (formData: FormData) => {
  const { data } = await api.put<ApiResponse<MyPageProfileResponseDto>>(
    '/users/profile',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data.data;
};

export const updateMyPageShare = async () => {
  const { data } = await api.patch<ApiResponse<boolean>>('/users/share');
  return data.data;
};

export const logoutMyPage = async () => {
  const { data } = await api.post<ApiResponse<MyPageLogoutResponseDto>>('/users/logout');
  return data.data;
};

export const getMyPageCoupleStatus = async () => {
  const { data } = await api.get<ApiResponse<MyPageCouplePartnerResponseDto[]>>('/couples/status');
  return data.data;
};

export const inviteMyPageCouple = async (inviteCode: string) => {
  const request: MyPageCoupleInviteRequestDto = { inviteCode };
  const { data } = await api.post<ApiResponse<MyPageCouplePartnerResponseDto>>(
    '/couples/invite',
    request
  );
  return data.data;
};

export const acceptMyPageCouple = async (partnerUserId: number) => {
  const request: MyPageCoupleAcceptRequestDto = { partnerUserId };
  const { data } = await api.post<ApiResponse<MyPageCouplePartnerResponseDto>>(
    '/couples/accept',
    request
  );
  return data.data;
};
