import type { OnboardingScreen } from '@/types/onboarding';

// 계좌 연결 화면에서 선택할 수 있는 은행과 API 전달값이다.
export const ONBOARDING_BANK_OPTIONS = [
  { bankCode: '004', company: '국민', label: '국민은행' },
  { bankCode: '088', company: '신한', label: '신한은행' },
  { bankCode: '081', company: '하나', label: '하나은행' },
  { bankCode: '020', company: '우리', label: '우리은행' },
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
  bank: ONBOARDING_BANK_OPTIONS[0].label,
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
  ACCOUNT_SELECTION: '사용할 계좌를 저장하지 못했어요. 다시 시도해주세요.',
  COUPLE_ACCEPT: '연결 요청을 수락하지 못했어요. 다시 시도해주세요.',
  COUPLE_INVITE: '초대 코드를 확인하지 못했어요. 다시 시도해주세요.',
  COUPLE_STATUS: '커플 연결 상태를 불러오지 못했어요.',
  NETWORK: '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.',
  SHARE_SCOPE: '공개범위를 저장하지 못했어요. 다시 시도해주세요.',
} as const;
