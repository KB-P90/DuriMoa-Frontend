import { api } from '@/apis/axios.js';
import type { ApiResponse } from '@/types/common';
import type {
  AccountListRequestDto,
  AccountListResponseDto,
  AccountSelectionRequestDto,
  CodefTermsRequestDto,
  CoupleAcceptRequestDto,
  CoupleInviteRequestDto,
  CouplePartnerResponseDto,
  CoupleStatusResponseDto,
  ShareScopeRequestDto,
  ShareScopeResponseDto,
} from '@/types/dto/onboarding';

// CODEF API 약관 동의 결과를 반환한다.
export const agreeCodefTerms = async (request: CodefTermsRequestDto) => {
  const { data } = await api.post<ApiResponse<null>>('/onboard/terms', request);
  return data;
};

// 인터넷뱅킹 정보로 연결 가능한 계좌 목록을 조회한다.
export const getAccounts = async (request: AccountListRequestDto) => {
  const { data } = await api.get<ApiResponse<AccountListResponseDto>>('/onboard/account/list', {
    data: request,
  });
  return data.data;
};

// 사용자가 고른 계좌 목록을 온보딩 계좌로 저장한다.
export const selectAccounts = async (request: AccountSelectionRequestDto) => {
  const { data } = await api.post<ApiResponse<null>>('/onboard/account/select', request);
  return data;
};

// 초대 코드에 해당하는 상대에게 커플 연결을 요청한다.
export const invitePartner = async (inviteCode: string) => {
  const request: CoupleInviteRequestDto = { inviteCode };
  const { data } = await api.post<ApiResponse<CouplePartnerResponseDto>>('/couple/invite', request);
  return data.data;
};

// 선택한 상대방이 보낸 커플 연결 요청을 수락한다.
export const acceptPartner = async (partnerUserId: number) => {
  const request: CoupleAcceptRequestDto = { partnerUserId };
  const { data } = await api.post<ApiResponse<CouplePartnerResponseDto>>('/couple/accept', request);
  return data.data;
};

// 현재 커플 연결 요청과 진행 상태 목록을 조회한다.
export const getCoupleStatus = async () => {
  const { data } = await api.get<ApiResponse<CoupleStatusResponseDto[]>>('/couple/status');
  return data.data;
};

// 상대방에게 공개할 정보 범위를 저장한다.
export const updateShareScope = async (request: ShareScopeRequestDto) => {
  const { data } = await api.put<ApiResponse<ShareScopeResponseDto>>('/user/share', request);
  return data.data;
};
