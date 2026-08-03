import type { OnboardingAccount } from '@/types/onboarding';

// 백엔드 연결 전 계좌 선택 화면을 확인하기 위한 임시 계좌 데이터다.
const PUBLISHING_ACCOUNTS = [
  {
    accountId: 101,
    accountName: 'KB종합통장',
    accountNumber: '12345678901234',
  },
  {
    accountId: 102,
    accountName: 'KB내맘대로적금',
    accountNumber: '23456789012345',
  },
  {
    accountId: 103,
    accountName: 'KB청년희망적금',
    accountNumber: '34567890123456',
  },
] as const satisfies readonly OnboardingAccount[];

export default PUBLISHING_ACCOUNTS;
