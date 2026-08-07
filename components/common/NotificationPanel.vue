<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ArrowLeft } from '@lucide/vue';

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/server/notificationApi';
import type { AppNotification } from '@/types/notification';
import { formatRelativeTime } from '@/utils/format';
import { visualForNotificationType } from '@/utils/notification';

const emit = defineEmits<{
  close: [];
}>();

const notifications = ref<AppNotification[]>([]);
const isLoading = ref(false);

const hasUnread = computed(() => notifications.value.some((item) => !item.isRead));

async function fetchNotifications() {
  isLoading.value = true;
  try {
    notifications.value = await getNotifications();
  } catch {
    notifications.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchNotifications);

async function handleSelect(notification: AppNotification) {
  if (notification.isRead) return;

  notification.isRead = true;
  try {
    await markNotificationRead(notification.id);
  } catch {
    notification.isRead = false;
  }
}

async function handleMarkAllRead() {
  const previouslyUnread = notifications.value.filter((item) => !item.isRead);
  for (const item of previouslyUnread) item.isRead = true;

  try {
    await markAllNotificationsRead();
  } catch {
    for (const item of previouslyUnread) item.isRead = false;
  }
}

const visualFor = visualForNotificationType;
</script>

<template>
  <Teleport to="body">
    <section
      class="fixed inset-0 z-[60] mx-auto flex w-full max-w-[768px] flex-col bg-white text-[#292934]"
    >
      <header class="flex h-14 shrink-0 items-center gap-3 border-b border-dm-gray/15 px-4">
        <button
          type="button"
          aria-label="뒤로 가기"
          class="grid h-6 w-6 cursor-pointer place-items-center"
          @click="emit('close')"
        >
          <ArrowLeft
            class="h-5 w-5 text-[#232631]"
            :stroke-width="2"
          />
        </button>
        <h1 class="flex-1 text-base font-extrabold text-[#232631]">알림</h1>
        <button
          v-if="hasUnread"
          type="button"
          class="cursor-pointer text-sm font-semibold text-dm-gray-dark"
          @click="handleMarkAllRead"
        >
          모두 읽음
        </button>
      </header>

      <main class="flex-1 overflow-y-auto px-4 pb-[calc(4rem+env(safe-area-inset-bottom))] pt-4">
        <p
          v-if="!isLoading && notifications.length === 0"
          class="py-16 text-center text-sm text-dm-gray-dark"
        >
          받은 알림이 없어요
        </p>

        <div
          v-else
          class="flex flex-col"
        >
          <template
            v-for="notification in notifications"
            :key="notification.id"
          >
            <button
              v-if="!notification.isRead"
              type="button"
              class="relative mb-3 flex cursor-pointer items-start gap-3 rounded-2xl bg-dm-rose-light p-4 text-left"
              @click="handleSelect(notification)"
            >
              <span
                class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg"
                :class="visualFor(notification.type).circleClass"
              >
                {{ visualFor(notification.type).icon }}
              </span>
              <span class="flex-1">
                <span class="block text-sm font-bold text-[#232631]">{{ notification.title }}</span>
                <span class="mt-1 block text-sm leading-5 text-dm-gray-dark">
                  {{ notification.content }}
                </span>
                <span class="mt-1.5 block text-xs font-semibold text-btn-pk-dark">
                  {{ formatRelativeTime(notification.createdAt) }}
                </span>
              </span>
              <span class="absolute right-4 top-4 h-2 w-2 rounded-full bg-btn-pk-dark" />
            </button>

            <button
              v-else
              type="button"
              class="flex w-full cursor-pointer items-start gap-3 border-t border-dm-gray/10 py-4 text-left first:border-t-0"
              @click="handleSelect(notification)"
            >
              <span
                class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg"
                :class="visualFor(notification.type).circleClass"
              >
                {{ visualFor(notification.type).icon }}
              </span>
              <span class="flex-1">
                <span class="block text-sm font-bold text-[#232631]">{{ notification.title }}</span>
                <span class="mt-1 block text-sm leading-5 text-dm-gray-dark">
                  {{ notification.content }}
                </span>
                <span class="mt-1.5 block text-xs text-dm-gray-dark">
                  {{ formatRelativeTime(notification.createdAt) }}
                </span>
              </span>
            </button>
          </template>
        </div>
      </main>
    </section>
  </Teleport>
</template>
