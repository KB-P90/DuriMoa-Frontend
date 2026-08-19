import type { NotificationSettingType } from '@/types/notification';

// PATCH /api/notification-settings는 인증이 필요해서 계정이 아직 없는 회원가입 화면에서는
// 호출할 수 없다. 그 화면에서 받은 알림 수신 동의 여부를 여기 저장해뒀다가, 가입 직후 첫
// 로그인이 성공한 시점(useLogin)에 꺼내서 실제로 반영한다.
export const PENDING_NOTIFICATION_CONSENT_KEY = 'pendingNotificationConsent';

// 회원가입 화면의 "알림 수신" 체크박스 하나로 이 알림 종류 전부의 수신 여부를 한 번에 켜고 끈다.
export const ALL_NOTIFICATION_SETTING_TYPES: NotificationSettingType[] = [
  'GOAL_CREATED',
  'GOAL_CHANGED',
  'GOAL_APPROVAL_REQUESTED',
  'GOAL_APPROVED',
  'GOAL_REJECTED',
  'COUPLE_REQUESTED',
  'COUPLE_ACCEPTED',
  'COUPLE_DISCONNECTED',
];
