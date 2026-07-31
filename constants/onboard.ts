import type { OnboardingScreen } from '@/types/onboarding';

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
  bank: '국민은행',
  financialVisibility: 'WEDDING',
  role: 'G',
  screen: 'account',
  selectedAccountIds: [101, 103],
} as const;

// 초대 코드에 허용할 영문 대문자와 숫자 형식이다.
export const ONBOARDING_INVITE_CODE_PATTERN = /^[A-Z0-9]+$/;

// 커플 연결 상태에서 반복해서 사용하는 고정 안내 문구다.
export const ONBOARDING_COUPLE_MESSAGES = {
  ALREADY_CONNECTED: '이미 다른 커플과 연결되어 있어요',
  CONNECTED: '파트너 연결이 완료되었어요',
  INVALID_CODE: '유효하지 않거나 만료된 초대 코드예요',
  NO_PENDING_REQUEST: '대기 중인 연결 요청이 없어요',
} as const;

// API 명세서의 온보딩 관련 method와 path다.
export const ONBOARDING_API_ENDPOINTS = {
  CODEF_TERMS: {
    method: 'POST',
    path: '/api/onboard/terms',
    requiresAuth: false,
  },
  ACCOUNT_LIST: {
    method: 'POST',
    path: '/api/onboard/account/list',
    requiresAuth: false,
  },
  ACCOUNT_SELECTIONS: {
    method: 'POST',
    path: '/api/onboard/account/selections',
    requiresAuth: false,
  },
  COUPLE_INVITE: {
    method: 'POST',
    path: '/api/couple/invite',
    requiresAuth: true,
  },
  COUPLE_ACCEPT: {
    method: 'POST',
    path: '/api/couple/accept',
    requiresAuth: true,
  },
  COUPLE_STATUS: {
    method: 'GET',
    path: '/api/couple/status',
    requiresAuth: true,
  },
  SHARE_SCOPE: {
    method: 'PUT',
    path: '/api/user/share',
    requiresAuth: true,
  },
} as const;
