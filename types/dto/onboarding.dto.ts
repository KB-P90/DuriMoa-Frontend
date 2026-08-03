// CODEF API 약관 동의 요청이다.
export interface CodefTermsRequestDto {
  agreed: boolean;
}

// 계좌 조회에 필요한 인터넷뱅킹 정보다.
export interface AccountListRequestDto {
  company: string;
  id: string;
  password: string;
}

// 계좌 조회 응답에 포함되는 계좌 원형이다.
export interface OnboardingAccountDto {
  accountId: number;
  accountNumber: string;
  accountName: string;
}

// 계좌 조회 API의 응답 데이터다.
export interface AccountListResponseDto {
  bankCode: string;
  accountCount: number;
  accounts: OnboardingAccountDto[];
}

// 온보딩에서 사용할 계좌 선택 요청이다.
export interface AccountSelectionRequestDto {
  bankCode: string;
  accountIds: number[];
}

// 커플 초대 코드 요청이다.
export interface CoupleInviteRequestDto {
  inviteCode: string;
}

// 커플 연결 요청 수락에 사용할 상대방 식별자다.
export interface CoupleAcceptRequestDto {
  partnerUserId: number;
}

// 커플 연결 API가 반환하는 상대방 정보다.
export interface CouplePartnerResponseDto {
  userId: number;
  name: string;
  role: 'B' | 'G';
  status: 'WAIT' | 'REQUESTED' | 'CONNECTED' | 'DISCONNECTED';
}

// 커플 연결 상태 목록의 항목이다.
export interface CoupleStatusResponseDto {
  userId: number;
  name: string;
  role: 'B' | 'G';
  status: 'WAIT' | 'REQUESTED' | 'CONNECTED';
}

// 공개범위 설정 API에 전달할 공유 단계다.
export type ShareLevelDto = 'SUMMARY' | 'ALL';

// 상대방에게 공개할 정보 범위 요청이다.
export interface ShareScopeRequestDto {
  shareLevel: ShareLevelDto;
}

// 공유범위 설정 응답의 사용자 정보다.
export interface ShareScopeUserDto {
  id: number;
  name: string;
  phone: string;
  profileImage: string | null;
  provider: string;
  role: string;
}

// 공유범위 설정 응답의 상대방 정보다.
export interface ShareScopePartnerDto {
  id: number;
  name: string;
  profileImage: string | null;
  role: string;
}

// 공유범위 설정 응답의 커플 정보다.
export interface ShareScopeCoupleDto {
  id: number;
  status: string;
  partner: ShareScopePartnerDto;
}

// 공유범위 설정 응답의 결혼 목표 정보다.
export interface ShareScopeGoalDto {
  id: number;
  weddingDate: string;
  dday: number;
  region: string;
  totalBudget: number;
  status: string;
}

// 공유범위 설정 API의 응답 데이터다.
export interface ShareScopeResponseDto {
  user: ShareScopeUserDto;
  couple: ShareScopeCoupleDto;
  goal: ShareScopeGoalDto;
  shareLevel: string;
}
