// 알림 종류별 아이콘/원 배경색. 확정된 전체 type 목록이 없어 모르는 값은 기본값으로 처리한다.
const NOTIFICATION_VISUALS: Record<string, { icon: string; circleClass: string }> = {
  GOAL: { icon: '🎯', circleClass: 'bg-pink-03' },
  COUPLE: { icon: '📄', circleClass: 'bg-dm-mint-light' },
  MISSION: { icon: '🕹️', circleClass: 'bg-orange' },
};
const DEFAULT_NOTIFICATION_VISUAL = { icon: '🔔', circleClass: 'bg-dm-gray-light' };

export function visualForNotificationType(type: string) {
  return NOTIFICATION_VISUALS[type] ?? DEFAULT_NOTIFICATION_VISUAL;
}
