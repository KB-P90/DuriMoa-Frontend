import type {
  CouplePartnerResponseDto,
  CoupleStatusResponseDto,
  OnboardingAccountItemDto,
} from '@/types/dto/onboarding.dto';
import type { OnboardingAccount, OnboardingCoupleRequest } from '@/types/onboarding';

// 계좌 조회 DTO를 온보딩 화면의 계좌 정보로 변환한다.
export const toOnboardingAccount = (dto: OnboardingAccountItemDto): OnboardingAccount => ({
  accountDisplay: dto.resAccountDisplay ?? dto.resAccount,
  accountName: dto.resAccountName ?? '이름 없는 계좌',
  accountNumber: dto.resAccount,
  isRegistered: dto.isRegistered,
});

// 커플 API DTO를 화면에서 지원하는 연결 요청으로 변환한다.
export const toOnboardingCoupleRequest = (
  dto: CouplePartnerResponseDto | CoupleStatusResponseDto
): OnboardingCoupleRequest | null => {
  if (dto.status === 'DISCONNECTED') {
    return null;
  }

  return {
    userId: dto.userId,
    name: dto.name,
    role: dto.role,
    status: dto.status,
  };
};

// 변환 과정에서 제외되지 않은 커플 연결 요청인지 확인한다.
export const isOnboardingCoupleRequest = (
  request: OnboardingCoupleRequest | null
): request is OnboardingCoupleRequest => request !== null;
