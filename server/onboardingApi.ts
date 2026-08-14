import { api } from './axios';
import type { ApiResponse } from '@/types/common';
import type {
  CoupleAcceptRequestDto,
  CoupleInviteRequestDto,
  CouplePartnerResponseDto,
  CoupleStatusResponseDto,
  OnboardingAccountListResponseDto,
  OnboardingRegisterRequestDto,
  OnboardingRegisterResponseDto,
  OnboardingSelectRequestDto,
  OnboardingSelectResponseDto,
  OnboardingWeddingFundRequestDto,
  OnboardingWeddingFundResponseDto,
} from '@/types/dto/onboarding.dto';

// 인터넷뱅킹 정보로 CODEF 금융계정을 등록하거나 추가한다.
export const registerOnboardingAccount = async (request: OnboardingRegisterRequestDto) => {
  const { data } = await api.post<ApiResponse<OnboardingRegisterResponseDto>>(
    '/onboarding/register',
    request
  );
  return data.data;
};

// 등록된 CODEF 계정으로 특정 금융기관의 계좌 목록을 조회한다.
export const getOnboardingAccounts = async (company: string) => {
  const { data } = await api.get<ApiResponse<OnboardingAccountListResponseDto>>(
    '/onboarding/accounts',
    { params: { company } }
  );
  return data.data;
};

// 선택한 계좌의 거래내역을 동기화하여 서버에 저장한다.
export const selectOnboardingAccounts = async (request: OnboardingSelectRequestDto) => {
  const { data } = await api.post<ApiResponse<OnboardingSelectResponseDto>>(
    '/onboarding/select',
    request
  );
  return data.data;
};

// 현재까지 모은 결혼자금을 원 단위 문자열로 저장한다.
export const saveOnboardingWeddingFund = async (
  request: OnboardingWeddingFundRequestDto
) => {
  const { data } = await api.post<OnboardingWeddingFundResponseDto>(
    '/onboarding/wedding-fund',
    request
  );
  return data;
};

// 초대 코드에 해당하는 상대에게 커플 연결을 요청한다.
export const invitePartner = async (inviteCode: string) => {
  const request: CoupleInviteRequestDto = { inviteCode };
  const { data } = await api.post<ApiResponse<CouplePartnerResponseDto>>(
    '/couples/invite',
    request
  );
  return data.data;
};

// 선택한 상대방이 보낸 커플 연결 요청을 수락한다.
export const acceptPartner = async (partnerUserId: number) => {
  const request: CoupleAcceptRequestDto = { partnerUserId };
  const { data } = await api.post<ApiResponse<CouplePartnerResponseDto>>(
    '/couples/accept',
    request
  );
  return data.data;
};

// 현재 커플 연결 요청과 진행 상태 목록을 조회한다.
export const getCoupleStatus = async () => {
  const { data } = await api.get<ApiResponse<CoupleStatusResponseDto[]>>('/couples/status');
  return data.data;
};

// 현재 로그인한 사용자의 커플 초대 코드를 조회한다.
export const getMyInviteCode = async () => {
  const { data } = await api.get<ApiResponse<string>>('/users/invite');
  return data.data;
};

// 현재 사용자의 자산 공개 여부를 반전한다.
export const toggleShareScope = async () => {
  const { data } = await api.patch<ApiResponse<boolean>>('/users/share');
  return data.data;
};
