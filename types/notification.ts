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
