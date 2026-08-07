<script setup>
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

const { connect } = useNotificationStream((event) => {
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
  connect();
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
