import { getAccessToken } from '@/utils/auth';
import type { NotificationStreamEvent } from '@/types/notification';

const SSE_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL ?? '/api'}/notifications/subscribe`;

let eventSource: EventSource | null = null;
let registeredCallback: ((event: NotificationStreamEvent) => void) | null = null;

function open() {
  const token = getAccessToken();
  if (!token || eventSource || !registeredCallback) return;

  eventSource = new EventSource(`${SSE_ENDPOINT}?token=${encodeURIComponent(token)}`);

  eventSource.addEventListener('notification', (event) => {
    try {
      registeredCallback?.(JSON.parse((event as MessageEvent).data));
    } catch {
      // 형식이 다른 이벤트는 무시한다.
    }
  });
}

// 앱 전체에서 하나의 연결만 유지하는 싱글턴이다. App.vue가 마운트될 때 콜백을 등록해두고,
// 그 시점엔 아직 로그인 전이라 토큰이 없을 수 있어 실제 연결은 로그인 성공 직후
// reconnectNotificationStream()이 다시 시도한다.
export function useNotificationStream(onNotification: (event: NotificationStreamEvent) => void) {
  registeredCallback = onNotification;

  function connect() {
    open();
  }

  function disconnect() {
    eventSource?.close();
    eventSource = null;
  }

  return { connect, disconnect };
}

export function reconnectNotificationStream() {
  open();
}

export function disconnectNotificationStream() {
  eventSource?.close();
  eventSource = null;
}
