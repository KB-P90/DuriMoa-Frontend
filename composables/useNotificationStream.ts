import { getAccessToken } from '@/utils/auth';
import type { NotificationStreamEvent } from '@/types/notification';

const SSE_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL ?? '/api'}/notifications/subscribe`;

let eventSource: EventSource | null = null;
let registeredCallback: ((event: NotificationStreamEvent) => void) | null = null;

const RECONNECT_DELAY_MS = 3000;

function open() {
  const token = getAccessToken();
  if (!token || eventSource || !registeredCallback) return;

  const source = new EventSource(`${SSE_ENDPOINT}?token=${encodeURIComponent(token)}`);
  eventSource = source;

  source.addEventListener('notification', (event) => {
    let parsed: NotificationStreamEvent;
    try {
      parsed = JSON.parse((event as MessageEvent).data);
    } catch {
      // 형식이 다른 이벤트는 무시한다.
      return;
    }
    registeredCallback?.(parsed);
  });

  // EventSource는 끊기면 브라우저가 연결을 맺을 때의 URL(=그때의 토큰)로 계속
  // 자동 재시도한다. 액세스 토큰은 15분 뒤 만료되는데, 만료된 토큰으로는 영원히
  // 재시도해도 실패하기만 하고 여기 코드는 eventSource가 이미 있다고 보고 새로
  // 열어보지도 않는다. 에러가 나면 직접 닫고 최신 토큰으로 다시 연다.
  source.onerror = () => {
    source.close();
    if (eventSource === source) {
      eventSource = null;
    }
    setTimeout(open, RECONNECT_DELAY_MS);
  };
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
