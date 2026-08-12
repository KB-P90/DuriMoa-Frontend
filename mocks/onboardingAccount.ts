import type { OnboardingAccount } from '@/types/onboarding';

// 백엔드 연결 전 계좌 선택 화면을 확인하기 위한 임시 계좌 데이터다.
const PUBLISHING_ACCOUNTS = [
  {
    accountDisplay: '123456-78-901234',
    accountName: 'KB종합통장',
    accountNumber: '12345678901234',
    isRegistered: false,
  },
  {
    accountDisplay: '234567-89-012345',
    accountName: 'KB내맘대로적금',
    accountNumber: '23456789012345',
    isRegistered: false,
  },
  {
    accountDisplay: '345678-90-123456',
    accountName: 'KB청년희망적금',
    accountNumber: '34567890123456',
    isRegistered: false,
  },
] as const satisfies readonly OnboardingAccount[];

export default PUBLISHING_ACCOUNTS;
