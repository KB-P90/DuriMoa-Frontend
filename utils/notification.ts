// 알림 종류별 아이콘/원 배경색. 확정된 전체 type 목록이 없어 모르는 값은 기본값으로 처리한다.
const NOTIFICATION_VISUALS: Record<string, { icon: string; circleClass: string }> = {
  GOAL: { icon: '🎯', circleClass: 'bg-pink-03' },
  COUPLE: { icon: '📄', circleClass: 'bg-dm-mint-light' },
  MISSION: { icon: '🕹️', circleClass: 'bg-orange' },
};
const DEFAULT_NOTIFICATION_VISUAL = { icon: '🔔', circleClass: 'bg-dm-gray-light' };

export function visualForNotificationType(targetType: string | null) {
  if (!targetType) return DEFAULT_NOTIFICATION_VISUAL;
  return NOTIFICATION_VISUALS[targetType] ?? DEFAULT_NOTIFICATION_VISUAL;
}

// 알림을 눌렀을 때 이동할 화면. GOAL: 예산 시안 목록, COUPLE: 파트너 연결(초대 코드),
// MISSION: 절약 미션이 있는 월별 지출 화면. 매핑에 없는 targetType은 이동하지 않는다.
const NOTIFICATION_ROUTES: Record<string, { name: string }> = {
  GOAL: { name: 'goal-list' },
  COUPLE: { name: 'myinfo-couple-connect' },
  MISSION: { name: 'expense' },
};

export function routeForNotificationType(targetType: string | null) {
  if (!targetType) return null;
  return NOTIFICATION_ROUTES[targetType] ?? null;
}
