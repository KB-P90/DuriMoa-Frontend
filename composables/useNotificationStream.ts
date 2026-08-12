import { onBeforeUnmount } from 'vue';
import { getAccessToken } from '@/utils/auth';
import type { NotificationStreamEvent } from '@/types/notification';

// 백엔드 SSE가 아직 없어 경로/이벤트명/인증 방식은 가정값이다. 실제 구현 시 맞춰서 조정한다.
const SSE_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL ?? '/api'}/notifications/subscribe`;

export function useNotificationStream(onNotification: (event: NotificationStreamEvent) => void) {
  let eventSource: EventSource | null = null;

  function connect() {
    const token = getAccessToken();
    if (!token || eventSource) return;

    eventSource = new EventSource(`${SSE_ENDPOINT}?token=${encodeURIComponent(token)}`);

    eventSource.addEventListener('notification', (event) => {
      try {
        onNotification(JSON.parse((event as MessageEvent).data));
      } catch {
        // 형식이 다른 이벤트는 무시한다.
      }
    });
  }

  function disconnect() {
    eventSource?.close();
    eventSource = null;
  }

  onBeforeUnmount(disconnect);

  return { connect, disconnect };
}
