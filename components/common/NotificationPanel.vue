<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Check, Trash2 } from '@lucide/vue';

import PageHeader from '@/components/common/PageHeader.vue';
import { NotificationListSkeleton } from '@/components/skeleton/notification';
import {
  deleteNotification,
  deleteSelectedNotifications,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/server/notificationApi';
import { useNotificationStore } from '@/stores/notificationStore';
import type { AppNotification } from '@/types/notification';
import { formatRelativeTime } from '@/utils/format';
import { routeForNotificationType, visualForNotificationType } from '@/utils/notification';

const notificationStore = useNotificationStore();
const router = useRouter();

const emit = defineEmits<{
  close: [];
}>();

const LONG_PRESS_MS = 500;
const LONG_PRESS_MOVE_TOLERANCE = 10;
const SWIPE_REVEAL_PX = 72;
const SWIPE_DELETE_PX = 160;

const notifications = ref<AppNotification[]>([]);
const isLoading = ref(false);

const isSelectionMode = ref(false);
const selectedIds = ref<Set<number>>(new Set());

const swipedId = ref<number | null>(null);
const dragState = ref<{ id: number; startX: number; currentX: number; dragging: boolean } | null>(
  null
);
let longPressTimer: ReturnType<typeof setTimeout> | null = null;

const contextMenu = ref<{ visible: boolean; x: number; y: number; id: number | null }>({
  visible: false,
  x: 0,
  y: 0,
  id: null,
});

const hasUnread = computed(() => notifications.value.some((item) => !item.isRead));

async function fetchNotifications() {
  isLoading.value = true;
  try {
    const result = await getNotifications();
    notifications.value = result.notifications;
    notificationStore.setUnreadCount(result.unreadCount);
  } catch {
    notifications.value = [];
  } finally {
    isLoading.value = false;
  }
}

function closeContextMenu() {
  contextMenu.value.visible = false;
}

onMounted(() => {
  fetchNotifications();
  window.addEventListener('click', closeContextMenu);
  window.addEventListener('scroll', closeContextMenu, true);
});

onUnmounted(() => {
  window.removeEventListener('click', closeContextMenu);
  window.removeEventListener('scroll', closeContextMenu, true);
});

async function handleOpenNotification(notification: AppNotification) {
  if (notification.isRead) return;

  notification.isRead = true;
  try {
    await markNotificationRead(notification.id);
    notificationStore.setUnreadCount(Math.max(notificationStore.unreadCount - 1, 0));
  } catch {
    notification.isRead = false;
  }
}

async function handleMarkAllRead() {
  const previouslyUnread = notifications.value.filter((item) => !item.isRead);
  for (const item of previouslyUnread) item.isRead = true;

  try {
    await markAllNotificationsRead();
    notificationStore.setUnreadCount(0);
  } catch {
    for (const item of previouslyUnread) item.isRead = false;
  }
}

function handleItemClick(notification: AppNotification) {
  if (isSelectionMode.value) {
    toggleSelected(notification.id);
    return;
  }

  if (swipedId.value !== null) {
    swipedId.value = null;
    return;
  }

  void handleOpenNotification(notification);

  const target = routeForNotificationType(notification.targetType);
  if (target) {
    emit('close');
    router.push(target);
  }
}

function toggleSelected(id: number) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
}

const isAllSelected = computed(
  () => notifications.value.length > 0 && selectedIds.value.size === notifications.value.length
);

function toggleSelectAll() {
  selectedIds.value = isAllSelected.value
    ? new Set()
    : new Set(notifications.value.map((item) => item.id));
}

function enterSelectionMode(id: number) {
  isSelectionMode.value = true;
  selectedIds.value = new Set([id]);
  swipedId.value = null;
  dragState.value = null;
  closeContextMenu();
}

function exitSelectionMode() {
  isSelectionMode.value = false;
  selectedIds.value = new Set();
}

async function handleDeleteSelected() {
  const ids = Array.from(selectedIds.value);
  if (ids.length === 0) return;

  const previous = notifications.value;
  const idSet = new Set(ids);
  notifications.value = previous.filter((item) => !idSet.has(item.id));

  try {
    await deleteSelectedNotifications(ids);
    exitSelectionMode();
  } catch {
    notifications.value = previous;
  }
}

async function handleDeleteSingle(id: number) {
  swipedId.value = null;
  const previous = notifications.value;
  notifications.value = previous.filter((item) => item.id !== id);

  try {
    await deleteNotification(id);
  } catch {
    notifications.value = previous;
  }
}

function clearLongPressTimer() {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
}

// 터치 전용 이벤트 대신 Pointer Events를 써서 PC 마우스에서도 롱프레스/스와이프가
// 동작하게 한다(BottomSheet.vue, GoalCategoryRangeChart.vue와 동일한 패턴).
function onPointerDown(event: PointerEvent, notification: AppNotification) {
  if (isSelectionMode.value) return;
  if (event.pointerType === 'mouse' && event.button !== 0) return;

  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

  dragState.value = {
    id: notification.id,
    startX: event.clientX,
    currentX: event.clientX,
    dragging: false,
  };

  clearLongPressTimer();
  longPressTimer = setTimeout(() => {
    if (!dragState.value || dragState.value.dragging || dragState.value.id !== notification.id)
      return;
    enterSelectionMode(notification.id);
  }, LONG_PRESS_MS);
}

function onPointerMove(event: PointerEvent) {
  if (!dragState.value || isSelectionMode.value) return;

  const deltaX = event.clientX - dragState.value.startX;

  if (Math.abs(deltaX) > LONG_PRESS_MOVE_TOLERANCE) {
    clearLongPressTimer();
  }

  if (deltaX >= 0) {
    dragState.value.currentX = dragState.value.startX;
    return;
  }

  dragState.value.dragging = true;
  dragState.value.currentX = event.clientX;
  swipedId.value = dragState.value.id;
}

function onPointerUp(event: PointerEvent) {
  clearLongPressTimer();
  if (!dragState.value) return;

  (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);

  const { id } = dragState.value;
  const offset = swipeOffsetFor(id);

  if (offset <= -SWIPE_DELETE_PX) {
    void handleDeleteSingle(id);
  } else if (offset > -SWIPE_REVEAL_PX) {
    swipedId.value = null;
  }

  dragState.value = null;
}

function swipeOffsetFor(id: number) {
  if (isSelectionMode.value) return 0;

  if (dragState.value?.id === id && dragState.value.dragging) {
    const raw = dragState.value.currentX - dragState.value.startX;
    return Math.max(raw, -(SWIPE_DELETE_PX + 40));
  }

  return swipedId.value === id ? -SWIPE_REVEAL_PX : 0;
}

function isDraggingItem(id: number) {
  return dragState.value?.id === id && dragState.value.dragging;
}

function onContextMenu(event: MouseEvent, notification: AppNotification) {
  if (isSelectionMode.value) return;

  event.preventDefault();
  swipedId.value = null;
  contextMenu.value = { visible: true, x: event.clientX, y: event.clientY, id: notification.id };
}

async function handleContextMenuDelete() {
  const id = contextMenu.value.id;
  closeContextMenu();
  if (id !== null) await handleDeleteSingle(id);
}

const visualFor = visualForNotificationType;
</script>

<template>
  <Teleport to="body">
    <section
      class="fixed inset-0 z-[60] mx-auto flex w-full max-w-[768px] flex-col bg-white text-[#292934]"
    >
      <PageHeader
        title="알림"
        :show-back="true"
        :on-back="isSelectionMode ? exitSelectionMode : () => emit('close')"
      >
        <button
          v-if="!isSelectionMode && hasUnread"
          type="button"
          class="cursor-pointer text-sm font-semibold text-dm-gray-dark"
          @click="handleMarkAllRead"
        >
          모두 읽음
        </button>
        <div
          v-else-if="isSelectionMode"
          class="flex items-center gap-3"
        >
          <button
            type="button"
            class="cursor-pointer text-sm font-semibold text-dm-gray-dark"
            @click="toggleSelectAll"
          >
            전체 선택
          </button>
          <button
            type="button"
            class="cursor-pointer text-sm font-semibold disabled:cursor-not-allowed disabled:text-disable"
            :class="selectedIds.size > 0 ? 'text-red' : 'text-disable'"
            :disabled="selectedIds.size === 0"
            @click="handleDeleteSelected"
          >
            삭제
          </button>
        </div>
      </PageHeader>

      <main
        class="flex-1 overflow-y-auto scrollbar-none px-4 pb-[calc(4rem+env(safe-area-inset-bottom))] pt-4"
      >
        <NotificationListSkeleton v-if="isLoading" />

        <p
          v-else-if="notifications.length === 0"
          class="py-16 text-center text-sm text-dm-gray-dark"
        >
          받은 알림이 없어요
        </p>

        <div
          v-else
          class="flex flex-col"
        >
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="relative mb-3 overflow-hidden rounded-2xl last:mb-0"
          >
            <div
              class="absolute inset-y-0 right-0 flex w-20 items-center justify-center rounded-2xl bg-red"
            >
              <button
                type="button"
                aria-label="알림 삭제"
                class="grid h-10 w-10 cursor-pointer place-items-center text-white"
                @click.stop="handleDeleteSingle(notification.id)"
              >
                <Trash2
                  class="h-5 w-5"
                  :stroke-width="2"
                />
              </button>
            </div>

            <button
              type="button"
              class="relative flex w-full cursor-pointer items-start gap-3 rounded-2xl p-4 text-left"
              :class="[
                notification.isRead ? 'bg-white' : 'bg-pink-01',
                !isDraggingItem(notification.id) && 'transition-transform duration-200',
              ]"
              :style="{ transform: `translateX(${swipeOffsetFor(notification.id)}px)` }"
              @click="handleItemClick(notification)"
              @contextmenu="onContextMenu($event, notification)"
              @pointerdown="onPointerDown($event, notification)"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointercancel="onPointerUp"
            >
              <span
                v-if="isSelectionMode"
                class="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2"
                :class="
                  selectedIds.has(notification.id)
                    ? 'border-brand bg-brand'
                    : 'border-dm-gray bg-white'
                "
              >
                <Check
                  v-if="selectedIds.has(notification.id)"
                  class="h-3 w-3 text-white"
                  :stroke-width="3"
                />
              </span>

              <span
                class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg"
                :class="visualFor(notification.targetType).circleClass"
              >
                {{ visualFor(notification.targetType).icon }}
              </span>
              <span class="flex-1">
                <span class="block text-sm font-bold text-[#232631]">{{ notification.title }}</span>
                <span class="mt-1 block text-sm leading-5 text-dm-gray-dark">
                  {{ notification.content }}
                </span>
                <span
                  class="mt-1.5 block text-xs"
                  :class="
                    notification.isRead ? 'text-dm-gray-dark' : 'font-semibold text-brand-dark'
                  "
                >
                  {{ formatRelativeTime(notification.createdAt) }}
                </span>
              </span>
              <span
                v-if="!notification.isRead && !isSelectionMode"
                class="absolute right-4 top-4 h-2 w-2 rounded-full bg-brand-dark"
              />
            </button>
          </div>
        </div>
      </main>
    </section>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="contextMenu.visible"
      class="fixed z-[70] min-w-[120px] rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/10"
      :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
      @click.stop
    >
      <button
        type="button"
        class="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-red"
        @click="handleContextMenuDelete"
      >
        <Trash2
          class="h-4 w-4"
          :stroke-width="2"
        />
        삭제
      </button>
    </div>
  </Teleport>
</template>
