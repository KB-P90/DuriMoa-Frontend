<script setup>
import { ConfigProvider } from 'reka-ui';
import { toast } from 'vue-sonner';
import { onMessage } from 'firebase/messaging';
import { Toaster } from '@/components/ui/sonner';
import NotificationPanel from '@/components/common/NotificationPanel.vue';
import NotificationToast from '@/components/common/NotificationToast.vue';
import { useNotificationStream } from '@/composables/useNotificationStream';
import { getFirebaseMessaging } from '@/lib/firebase';
import { useMyPageStore } from '@/stores/myPageStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { isAccessTokenValid } from '@/utils/auth';

const myPageStore = useMyPageStore();
const notificationStore = useNotificationStore();

// FCM 포그라운드 수신: 탭이 열려있을 때 오는 알림은 서비스워커가 아니라 여기서 처리한다.
// SSE(useNotificationStream)는 아직 connect()를 안 부르고 있어 지금은 이 채널만 동작한다.
getFirebaseMessaging().then((messaging) => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    notificationStore.incrementUnreadCount();
    toast.custom(NotificationToast, {
      componentProps: {
        type: payload.data?.type ?? '',
        partnerName: myPageStore.myPage.partner?.name ?? '파트너',
        message: payload.notification?.body ?? payload.data?.message ?? '',
        occurredAt: new Date().toISOString(),
      },
    });
  });
});

// 백엔드 SSE 엔드포인트가 아직 없어서 connect()는 호출하지 않는다.
// 존재하지 않는 엔드포인트로 계속 연결을 시도하면 브라우저의 동시 연결 제한 때문에
// 다른 API 요청(알림 목록 조회 등)이 멈추는 문제가 있었다.
// 백엔드 준비되면 아래 connect()를 다시 호출하면 된다.
useNotificationStream((event) => {
  notificationStore.incrementUnreadCount();
  toast.custom(NotificationToast, {
    componentProps: {
      type: event.type,
      partnerName: myPageStore.myPage.partner?.name ?? '파트너',
      message: event.message,
      occurredAt: event.occurredAt,
    },
  });
});

if (isAccessTokenValid()) {
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
