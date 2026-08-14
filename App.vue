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

function showNotificationToast(event) {
  notificationStore.incrementUnreadCount();
  toast.custom(NotificationToast, {
    componentProps: {
      type: event.type,
      partnerName: myPageStore.myPage.partner?.name ?? '파트너',
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
