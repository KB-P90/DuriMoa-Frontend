<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ConfigProvider } from 'reka-ui';
import { toast } from 'vue-sonner';
import { Toaster } from '@/components/ui/sonner';
import NotificationPanel from '@/components/common/NotificationPanel.vue';
import NotificationToast from '@/components/common/NotificationToast.vue';
import { useNotificationStream } from '@/composables/useNotificationStream';
import { useMyPageStore } from '@/stores/myPageStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { isAccessTokenValid } from '@/utils/auth';

const myPageStore = useMyPageStore();
const notificationStore = useNotificationStore();

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
import AiChatFloatingWidget from '@/components/common/AiChatFloatingWidget.vue';

const route = useRoute();

const AI_CHAT_HIDDEN_ROUTES = new Set(['login', 'signup', 'onboarding']);

const isAiChatVisible = computed(() => {
  const routeName = String(route.name);

  return !AI_CHAT_HIDDEN_ROUTES.has(routeName) && !routeName.startsWith('term-');
});
</script>

<template>
  <ConfigProvider :scroll-body="false">
    <RouterView />
    <AiChatFloatingWidget
      v-if="isAiChatVisible"
      button-image-src="/characters/ai.png?v=1"
    />
    <Toaster position="top-center" />
    <NotificationPanel
      v-if="notificationStore.isPanelOpen"
      @close="notificationStore.closePanel()"
    />
  </ConfigProvider>
</template>
