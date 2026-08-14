import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';
import { precacheAndRoute } from 'workbox-precaching';

// PWA(vite-plugin-pwa)와 Firebase 메시징 서비스워커를 같은 루트 스코프(`/`)에
// 각각 따로 등록하면 서로의 등록을 덮어써서 스코프가 충돌한다. 하나의
// 서비스워커에서 두 역할을 같이 처리해 스코프 충돌 자체를 없앤다.
precacheAndRoute(self.__WB_MANIFEST);

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

onBackgroundMessage(messaging, (payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? '두리모아', {
    body,
    icon: '/durimoa-icon.png',
  });
});
