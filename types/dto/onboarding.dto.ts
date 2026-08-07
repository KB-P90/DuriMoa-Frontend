// CODEF 금융계정 등록 요청이다.
export interface OnboardingRegisterRequestDto {
  company: string;
  id: string;
  password: string;
}

// CODEF 금융계정 등록 결과다.
export interface OnboardingRegisterResponseDto {
  connectedId: string;
  actionType: 'CREATED' | 'ADDED';
  businessType: 'BK' | 'CD';
  organization: string;
  company: string;
}

// 계좌 목록 조회 응답에 포함되는 CODEF 계좌 정보다.
export interface OnboardingAccountItemDto {
  resAccount: string;
  resAccountBalance?: string;
  resAccountDisplay?: string;
  resAccountName?: string;
  isRegistered: boolean;
}

// 특정 금융기관의 계좌 목록 조회 결과다.
export interface OnboardingAccountListResponseDto {
  itemList: OnboardingAccountItemDto[];
}

// 선택한 계좌와 거래내역 동기화 요청이다.
export interface OnboardingSelectItemDto {
  name: string;
  number: string;
}

export interface OnboardingSelectRequestDto {
  company: string;
  selectedItems: OnboardingSelectItemDto[];
  startDate?: string;
  endDate?: string;
}

// 선택한 계좌와 거래내역 동기화 결과다.
export interface OnboardingSelectResponseDto {
  businessType: 'BK' | 'CD';
  organization: string;
  totalSavedRecords: number;
  processedNumbers: string[];
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
