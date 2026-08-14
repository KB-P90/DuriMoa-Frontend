import { getToken } from 'firebase/messaging';
import { messaging } from './initFirebase';
import { registerPushDevice } from './pushDeviceApi';

export async function registerPushNotification() {
  if (!('serviceWorker' in navigator)) return;

  try {
    // 서비스워커는 vite-plugin-pwa가 페이지 로드 시 자동으로 등록한다(src/sw.js가
    // Firebase 메시징까지 함께 처리). 여기서 별도로 register()하면 등록이 두 번
    // 일어나 스코프가 충돌하니, 이미 등록된 워커가 준비되길 기다리기만 한다.
    const registration = await navigator.serviceWorker.ready;
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      if (token) {
        await registerPushDevice(token, 'ANDROID');
      } else {
        alert('토큰 등록이 불가능 합니다. 생성하려면 권한을 허용해주세요');
      }
    } else if (permission === 'denied') {
      alert('web push 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요');
    }
  } catch (error) {
    console.error('푸시 토큰 가져오는 중에 에러 발생', error);
  }
}
