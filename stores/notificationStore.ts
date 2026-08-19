import { defineStore } from 'pinia';
import { getUnreadNotificationCount } from '@/server/notificationApi';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    isPanelOpen: false,
    unreadCount: 0,
    // SSE로 실시간 알림이 오면 여기 카테고리(GOAL/COUPLE/MISSION)를 기록해둔다.
    // 관련 화면이 지금 떠있으면 이 값을 지켜보다가 스스로 데이터를 다시 불러온다.
    lastRealtimeNotification: null as { category: string; receivedAt: number } | null,
  }),
  actions: {
    async fetchUnreadCount() {
      try {
        this.unreadCount = await getUnreadNotificationCount();
      } catch {
        // 배지 카운트는 실패해도 화면이 깨지지 않아야 한다.
      }
    },
    notifyRealtimeNotification(category: string | null) {
      if (!category) return;
      this.lastRealtimeNotification = { category, receivedAt: Date.now() };
    },
    incrementUnreadCount() {
      this.unreadCount += 1;
    },
    setUnreadCount(count: number) {
      this.unreadCount = count;
    },
    openPanel() {
      this.isPanelOpen = true;
    },
    closePanel() {
      this.isPanelOpen = false;
      void this.fetchUnreadCount();
    },
  },
});
