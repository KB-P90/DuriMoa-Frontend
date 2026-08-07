// GET /api/notifications 응답 항목
export interface AppNotification {
  id: number;
  userId: number;
  // 'GOAL' 등 서버가 내려주는 알림 종류. 확정된 전체 목록이 없어 문자열로 둔다.
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// SSE로 실시간 수신하는 알림 이벤트. 엔드포인트/이벤트명은 백엔드 미구현 상태라 가정값이다.
export interface NotificationStreamEvent {
  type: string;
  partnerId: number;
  message: string;
  occurredAt: string;
}
