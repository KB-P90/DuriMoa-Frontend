import { ref, watch } from 'vue';
import { isAxiosError } from 'axios';
import { useRouter } from 'vue-router';
import { login } from '@/server/authApi';
import { registerPushNotification } from '@/server/notificationPermission';
import { updateNotificationSettings } from '@/server/notificationApi';
import { reconnectNotificationStream } from '@/composables/useNotificationStream';
import { formatPhoneNumber } from '@/utils/phone';
import {
  ALL_NOTIFICATION_SETTING_TYPES,
  PENDING_NOTIFICATION_CONSENT_KEY,
} from '@/constants/notificationConsent';

const LOGIN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
} as const;

const HOME_ROUTE_NAME = 'home';
const INVALID_CREDENTIALS_MESSAGE = '잘못된 아이디 또는 비밀번호입니다.';
const LOGIN_ERROR_MESSAGE = '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

// 회원가입 화면에서는 계정이 없어 PATCH /api/notification-settings를 호출할 수 없었으므로,
// 저장해둔 알림 수신 동의 여부를 로그인 성공 시점(=인증 가능해진 첫 순간)에 대신 반영한다.
function applyPendingNotificationConsent() {
  const stored = localStorage.getItem(PENDING_NOTIFICATION_CONSENT_KEY);
  if (stored === null) return;

  localStorage.removeItem(PENDING_NOTIFICATION_CONSENT_KEY);

  const pushEnabled = stored === 'true';
  void updateNotificationSettings(
    ALL_NOTIFICATION_SETTING_TYPES.map((type) => ({ type, pushEnabled }))
  );
}

function hasMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  );
}

export function useLogin() {
  const router = useRouter();
  const phone = ref('');
  const password = ref('');
  const loginError = ref('');
  const isSubmitting = ref(false);

  watch(phone, (value) => {
    const formattedPhone = formatPhoneNumber(value);
    if (value !== formattedPhone) phone.value = formattedPhone;
  });

  watch([phone, password], () => {
    loginError.value = '';
  });

  async function submitLogin() {
    if (isSubmitting.value) return;

    loginError.value = '';
    isSubmitting.value = true;

    try {
      const response = await login({
        phone: phone.value,
        password: password.value,
      });
      const accessToken = response.accessToken.trim();

      if (!accessToken) {
        loginError.value = LOGIN_ERROR_MESSAGE;
        return;
      }

      localStorage.setItem(LOGIN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      applyPendingNotificationConsent();
      void registerPushNotification();
      reconnectNotificationStream();
      await router.replace({ name: HOME_ROUTE_NAME });
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        loginError.value = INVALID_CREDENTIALS_MESSAGE;
        return;
      }

      loginError.value =
        isAxiosError(error) && hasMessage(error.response?.data)
          ? error.response.data.message
          : LOGIN_ERROR_MESSAGE;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    phone,
    password,
    loginError,
    isSubmitting,
    submitLogin,
  };
}
