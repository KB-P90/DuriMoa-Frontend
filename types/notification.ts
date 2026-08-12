// GET /api/notifications 응답의 개별 알림 원본 형태
export interface NotificationDto {
  noticeId: number;
  // 'GOAL' 등 서버가 내려주는 알림 종류. 확정된 전체 목록이 없어 문자열로 둔다.
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  targetType: string | null;
  targetId: number | null;
}

// GET /api/notifications 응답 전체 (목록은 notices에 한 번 더 감싸져 온다)
export interface NotificationListResponseDto {
  notices: NotificationDto[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
  unreadCount: number;
}

// 화면에서 사용하는 알림 형태 (NotificationDto의 noticeId를 id로 정규화)
export interface AppNotification {
  id: number;
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
