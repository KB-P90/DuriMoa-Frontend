<script setup>
import { ConfigProvider } from 'reka-ui';
import { useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import { Toaster } from '@/components/ui/sonner';
import NotificationPanel from '@/components/common/NotificationPanel.vue';
import NotificationToast from '@/components/common/NotificationToast.vue';
import { useNotificationStream } from '@/composables/useNotificationStream';
import { useHomeStore } from '@/stores/homeStore';
import { useMyPageStore } from '@/stores/myPageStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { isAccessTokenValid } from '@/utils/auth';
import { categoryForNotificationType } from '@/utils/notification';

const homeStore = useHomeStore();
const myPageStore = useMyPageStore();
const notificationStore = useNotificationStore();
const route = useRoute();

function showNotificationToast(event) {
  notificationStore.incrementUnreadCount();
  notificationStore.notifyRealtimeNotification(categoryForNotificationType(event.type));

  // 홈은 여러 카테고리를 한 화면에 요약해서 보여줘서, 지금 홈에 있을 때만 통째로 새로고침한다.
  // 다른 화면(예산 시안 목록, 상대 연결, 지출)은 각자 자기 카테고리 알림만 지켜보다가
  // 스스로 다시 불러온다.
  if (route.name === 'home') {
    void homeStore.refreshDashboard();
  }

  toast.custom(NotificationToast, {
    componentProps: {
      type: event.type,
      partnerName: myPageStore.myPage?.partner?.name ?? '파트너',
      message: event.message,
      occurredAt: event.occurredAt,
    },
  });
}

// 포그라운드 실시간 알림은 SSE로 받는다. FCM은 앱이 백그라운드/닫혀 있을 때
// 서비스워커(sw.js)가 처리하므로 여기서 따로 구독하지 않는다.
// (둘 다 포그라운드에서 구독하면 알림이 두 번 뜬다.)
const notificationStream = useNotificationStream(showNotificationToast);

if (isAccessTokenValid()) {
  notificationStream.connect();
  void notificationStore.fetchUnreadCount();
}
</script>

<template>
  <ConfigProvider :scroll-body="false">
    <RouterView />
    <Toaster position="top-center" />
    <NotificationPanel
      v-if="notificationStore.isPanelOpen"
      @close="notificationStore.closePanel()"
    />
  </ConfigProvider>
</template>
