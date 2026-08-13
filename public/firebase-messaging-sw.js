importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js');

// 서비스워커는 Vite의 import.meta.env를 읽을 수 없어 값을 직접 넣는다.
// Firebase 클라이언트 설정값은 비공개 값이 아니라 프론트에 노출돼도 되는 값이다.
firebase.initializeApp({
  apiKey: 'AIzaSyBAdP-eGdUJL6wh-5KuuM4SxVjow8VM-oU',
  authDomain: 'durimoa-1b30f.firebaseapp.com',
  projectId: 'durimoa-1b30f',
  storageBucket: 'durimoa-1b30f.firebasestorage.app',
  messagingSenderId: '146818614718',
  appId: '1:146818614718:web:48d476e0fa8edb7d57a5ef',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  const link = payload.data?.link ?? '/';

  self.registration.showNotification(title ?? '두리모아', {
    body,
    icon: '/favicon.ico',
    data: { link },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.link ?? '/'));
});
