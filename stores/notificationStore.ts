import { defineStore } from 'pinia';
import { getUnreadNotificationCount } from '@/server/notificationApi';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    isPanelOpen: false,
    unreadCount: 0,
  }),
  actions: {
    async fetchUnreadCount() {
      try {
        this.unreadCount = await getUnreadNotificationCount();
      } catch {
        // 배지 카운트는 실패해도 화면이 깨지지 않아야 한다.
      }
    },
    incrementUnreadCount() {
      this.unreadCount += 1;
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
