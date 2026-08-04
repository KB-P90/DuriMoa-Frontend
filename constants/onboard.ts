import type { OnboardingScreen } from '@/types/onboarding';

export const ONBOARDING_BANK_OPTIONS = [
  { bankCode: '004', company: 'KB국민은행', label: 'KB국민은행' },
  { bankCode: '088', company: '신한은행', label: '신한은행' },
  { bankCode: '081', company: '하나은행', label: '하나은행' },
  { bankCode: '020', company: '우리은행', label: '우리은행' },
] as const;

export const ONBOARDING_SCREENS = [
  'account',
  'account-selection',
  'couple',
  'privacy',
  'role',
] as const;

export const ONBOARDING_ROUTE_NAMES = {
  HOME: 'home',
  ONBOARDING: 'onboarding',
  SIGNUP: 'signup',
} as const;

export const ONBOARDING_PREVIOUS_SCREENS = {
  'account-selection': 'account',
  couple: 'account-selection',
  privacy: 'couple',
  role: 'privacy',
} as const satisfies Record<Exclude<OnboardingScreen, 'account'>, OnboardingScreen>;

export const ONBOARDING_DEFAULT_VALUES = {
  bank: ONBOARDING_BANK_OPTIONS[0].label,
  financialVisibility: 'WEDDING',
  role: 'G',
  screen: 'account',
} as const;

export const ONBOARDING_SHARE_LEVELS = {
  ALL: 'ALL',
  WEDDING: 'SUMMARY',
} as const;

export const ONBOARDING_INVITE_CODE_PATTERN = /^[A-Z0-9]{6}$/;

export const ONBOARDING_COUPLE_MESSAGES = {
  ALREADY_CONNECTED: '이미 다른 커플과 연결되어 있어요.',
  CONNECTED: '파트너 연결이 완료되었어요.',
  INVALID_CODE: '유효하지 않거나 만료된 초대 코드예요.',
  NO_PENDING_REQUEST: '대기 중인 연결 요청이 없어요.',
} as const;

export const ONBOARDING_API_ERROR_MESSAGES = {
  ACCOUNT_CONNECTION: '계좌를 불러오지 못했어요. 입력 정보를 확인하고 다시 시도해주세요.',
  ACCOUNT_SELECTION: '사용할 계좌를 저장하지 못했어요. 다시 시도해주세요.',
  COUPLE_ACCEPT: '연결 요청을 수락하지 못했어요. 다시 시도해주세요.',
  COUPLE_INVITE: '초대 코드를 확인하지 못했어요. 다시 시도해주세요.',
  COUPLE_STATUS: '커플 연결 상태를 불러오지 못했어요.',
  NETWORK: '서버와 연결할 수 없어요. 잠시 후 다시 시도해주세요.',
  SHARE_SCOPE: '공개범위를 저장하지 못했어요. 다시 시도해주세요.',
} as const;
