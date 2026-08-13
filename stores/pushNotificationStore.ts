import { defineStore } from 'pinia';
import { deleteToken, getToken } from 'firebase/messaging';
import { getFirebaseMessaging } from '@/lib/firebase';
import { registerPushDevice, unregisterPushDevice } from '@/server/pushTokenApi';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from '@/server/notificationSettingsApi';

const PUSH_DEVICE_ID_STORAGE_KEY = 'pushDeviceId';

export const usePushNotificationStore = defineStore('pushNotification', {
  state: () => ({
    isSupported: false,
    permission: typeof Notification === 'undefined' ? 'default' : Notification.permission,
    pushEnabled: true,
  }),
  actions: {
    async fetchSettings() {
      try {
        const settings = await getNotificationSettings();
        this.pushEnabled = settings.pushEnabled;
      } catch {
        // 조회 실패 시 기본값(true)을 유지한다.
      }
    },

    // 켜기: 권한이 없으면 먼저 요청·기기 등록부터 하고, 있으면 설정만 갱신한다.
    // 끄기: 기기 등록은 유지한 채 설정만 끈다 (알림함 저장은 계속, FCM 발송만 중단).
    async setPushEnabled(nextEnabled: boolean) {
      if (nextEnabled && this.permission !== 'granted') {
        const granted = await this.requestPermissionAndRegister();
        if (!granted) {
          return false;
        }
      }

      try {
        const settings = await updateNotificationSettings(nextEnabled);
        this.pushEnabled = settings.pushEnabled;
        return true;
      } catch {
        // 요청 실패 시 이전 상태를 유지한다 (토글이 원래 위치로 되돌아간다).
        return false;
      }
    },

    // 로그인 직후 자동 권한 팝업은 띄우지 않는다. 이미 허용된 사용자만 조용히 토큰을 재등록한다.
    async reregisterIfPermissionGranted() {
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
        return;
      }

      try {
        await this.requestPermissionAndRegister();
      } catch {
        // 토큰 재등록 실패는 로그인 흐름에 영향을 주지 않는다.
      }
    },

    async requestPermissionAndRegister() {
      const messaging = await getFirebaseMessaging();

      if (!messaging) {
        this.isSupported = false;
        return false;
      }

      this.isSupported = true;
      this.permission = await Notification.requestPermission();

      if (this.permission !== 'granted') {
        return false;
      }

      const serviceWorkerRegistration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration,
      });

      if (!token) {
        return false;
      }

      const device = await registerPushDevice(token);
      localStorage.setItem(PUSH_DEVICE_ID_STORAGE_KEY, String(device.deviceId));

      return true;
    },

    async unregisterCurrentDevice() {
      const deviceId = localStorage.getItem(PUSH_DEVICE_ID_STORAGE_KEY);

      if (deviceId) {
        await unregisterPushDevice(Number(deviceId));
      }

      const messaging = await getFirebaseMessaging();
      if (messaging) {
        await deleteToken(messaging);
      }

      localStorage.removeItem(PUSH_DEVICE_ID_STORAGE_KEY);
    },
  },
});
