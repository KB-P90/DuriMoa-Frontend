import type { OnboardingScreen } from '@/types/onboarding';

// 계좌 연결 화면에서 선택하고 API에 전달할 백엔드 등록 은행명이다.
export const ONBOARDING_BANK_OPTIONS = [
  '산업은행',
  '기업은행',
  '국민은행',
  '수협은행',
  '농협은행',
  '우리은행',
  'SC은행',
  '씨티은행',
  '대구은행',
  '부산은행',
  '광주은행',
  '제주은행',
  '전북은행',
  '경남은행',
  '새마을금고',
  '신협은행',
  '우체국',
  'KEB하나은행',
  '신한은행',
  'K뱅크',
] as const;

// 카드 연결 화면에서 선택하고 API에 전달할 백엔드 등록 카드사명이다.
export const ONBOARDING_CARD_OPTIONS = [
  'KB카드',
  '현대카드',
  '삼성카드',
  'NH카드',
  'BC카드',
  '신한카드',
  '씨티카드',
  '우리카드',
  '롯데카드',
  '하나카드',
  '전북카드',
  '광주카드',
  '수협카드',
  '제주카드',
] as const;

// URL에서 사용할 수 있는 온보딩 화면 이름이다.
export const ONBOARDING_SCREENS = [
  'account',
  'account-selection',
  'couple',
  'privacy',
  'role',
] as const;

// 문자열 경로 하드코딩을 피하기 위한 라우트 이름이다.
export const ONBOARDING_ROUTE_NAMES = {
  HOME: 'home',
  ONBOARDING: 'onboarding',
  SIGNUP: 'signup',
} as const;

// 각 온보딩 화면에서 뒤로 이동할 이전 화면이다.
export const ONBOARDING_PREVIOUS_SCREENS = {
  'account-selection': 'account',
  couple: 'account-selection',
  privacy: 'couple',
  role: 'privacy',
} as const satisfies Record<Exclude<OnboardingScreen, 'account'>, OnboardingScreen>;

// 온보딩 최초 진입 시 사용할 기본값이다.
export const ONBOARDING_DEFAULT_VALUES = {
  bank: ONBOARDING_BANK_OPTIONS[0],
  financialVisibility: 'WEDDING',
  role: 'G',
  screen: 'account',
} as const;

// 공개범위 화면 값과 API shareLevel 값을 연결한다.
export const ONBOARDING_SHARE_LEVELS = {
  ALL: 'ALL',
  WEDDING: 'SUMMARY',
} as const;

// 백엔드 초대 코드 검증과 동일한 영문 대문자·숫자 6자리 형식이다.
export const ONBOARDING_INVITE_CODE_PATTERN = /^[A-Z0-9]{6}$/;

// 커플 연결 상태에서 반복해서 사용하는 고정 안내 문구다.
export const ONBOARDING_COUPLE_MESSAGES = {
  ALREADY_CONNECTED: '이미 다른 커플과 연결되어 있어요',
  CONNECTED: '파트너 연결이 완료되었어요',
  INVALID_CODE: '유효하지 않거나 만료된 초대 코드예요',
  NO_PENDING_REQUEST: '대기 중인 연결 요청이 없어요',
} as const;

// 온보딩 API 요청 실패 시 사용할 기본 안내 문구다.
export const ONBOARDING_API_ERROR_MESSAGES = {
  ACCOUNT_CONNECTION: '계좌를 불러오지 못했어요. 입력 정보를 확인하고 다시 시도해주세요.',
  ACCOUNT_CREDENTIALS_REQUIRED:
    '처음 연결하거나 새 은행을 추가하려면 인터넷뱅킹 아이디와 비밀번호를 입력해주세요.',
  ACCOUNT_SELECTION: '사용할 계좌를 저장하지 못했어요. 다시 시도해주세요.',
  COUPLE_ACCEPT: '연결 요청을 수락하지 못했어요. 다시 시도해주세요.',
  COUPLE_INVITE: '초대 코드를 확인하지 못했어요. 다시 시도해주세요.',
  COUPLE_STATUS: '커플 연결 상태를 불러오지 못했어요.',
  NETWORK: '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.',
  SHARE_SCOPE: '공개범위를 저장하지 못했어요. 다시 시도해주세요.',
} as const;
