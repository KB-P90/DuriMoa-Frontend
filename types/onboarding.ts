// 커플 요청의 연결 진행 상태다.
export type CoupleRequestStatus = 'WAIT' | 'REQUESTED' | 'CONNECTED';

// 임시 초대 코드에 대응하는 퍼블리싱 결과다.
export type CouplePublishingResult = 'WAIT' | 'REQUESTED' | 'UNAVAILABLE';

// API에서 사용하는 신부·신랑 역할 코드다.
export type CoupleRole = 'B' | 'G';

// 온보딩에서 이동할 수 있는 단계별 화면 이름이다.
export type OnboardingScreen = 'account' | 'account-selection' | 'couple' | 'privacy' | 'role';

// 상대방에게 공개할 재무정보 범위다.
export type FinancialVisibility = 'WEDDING' | 'ALL';

// 커플 연결 요청 카드에 사용하는 사용자 정보다.
export interface OnboardingCoupleRequest {
  userId: number;
  name: string;
  role?: CoupleRole;
  status: CoupleRequestStatus;
}

// 계좌 선택 화면에 표시할 온보딩 계좌 정보다.
export interface OnboardingAccount {
  accountName: string;
  accountNumber: string;
}

// 백엔드 연결 전 초대 코드 테스트 데이터의 형태다.
export interface PublishingPartner {
  inviteCode: string;
  userId: number;
  name: string;
  role: CoupleRole;
  result: CouplePublishingResult;
}
