import type { PublishingPartner } from '@/types/onboarding';

// 백엔드 연결 전 초대 코드별 결과를 확인하기 위한 임시 사용자 데이터다.
const PUBLISHING_PARTNERS = [
  {
    inviteCode: 'SEOYEON4444',
    userId: 4,
    name: '최서연',
    role: 'B',
    result: 'WAIT',
  },
  {
    inviteCode: 'YUJIN2222',
    userId: 2,
    name: '이유진',
    role: 'G',
    result: 'WAIT',
  },
  {
    inviteCode: 'MINJUN6666',
    userId: 6,
    name: '김민준',
    role: 'G',
    result: 'REQUESTED',
  },
  {
    inviteCode: 'JIHYE3333',
    userId: 7,
    name: '이지혜',
    role: 'B',
    result: 'UNAVAILABLE',
  },
] as const satisfies readonly PublishingPartner[];

export default PUBLISHING_PARTNERS;
