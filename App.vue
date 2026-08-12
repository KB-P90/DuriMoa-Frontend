<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ConfigProvider } from 'reka-ui';
import { Toaster } from '@/components/ui/sonner';
import AiChatFloatingWidget from '@/components/common/AiChatFloatingWidget.vue';

const route = useRoute();

const AI_CHAT_HIDDEN_ROUTES = new Set(['login', 'signup']);

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
  </ConfigProvider>
</template>
