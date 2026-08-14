import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';
import { precacheAndRoute } from 'workbox-precaching';

// PWA(vite-plugin-pwa)와 Firebase 메시징 서비스워커를 같은 루트 스코프(`/`)에
// 각각 따로 등록하면 서로의 등록을 덮어써서 스코프가 충돌한다. 하나의
// 서비스워커에서 두 역할을 같이 처리해 스코프 충돌 자체를 없앤다.
precacheAndRoute(self.__WB_MANIFEST);

// injectManifest 방식은 generateSW와 달리 skipWaiting/clients.claim을 자동으로
// 넣어주지 않는다. 이게 없으면 새 서비스워커를 배포해도 열려있는 탭을 전부 닫기
// 전까진 예전 버전이 계속 활성 상태로 남아서, 코드를 고쳐도 반영이 안 된 것처럼 보인다.
self.skipWaiting();
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

const messaging = getMessaging(firebaseApp);

// 백엔드가 notification 필드 없이 data만 보낸다 (그래야 브라우저가 알아서
// 자동으로 띄우지 않고 여기서 표시 여부를 직접 제어할 수 있다).
// 탭이 이미 포커스되어 있으면 SSE가 토스트로 보여주고 있는 중이니, 여기서
// 시스템 알림까지 띄우면 같은 알림이 두 번 뜬다 — 포커스된 탭이 없을 때만 띄운다.
onBackgroundMessage(messaging, async (payload) => {
  const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const hasFocusedClient = clientsList.some((client) => client.focused);
  if (hasFocusedClient) {
    return;
  }
  const { title, body } = payload.data ?? {};
  self.registration.showNotification(title ?? '두리모아', {
    body,
    icon: '/durimoa-icon.png',
  });
});
