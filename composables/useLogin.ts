import { ref, watch } from 'vue';
import { isAxiosError } from 'axios';
import { useRouter } from 'vue-router';
import { login } from '@/server/authApi';
import { formatPhoneNumber } from '@/utils/phone';

const LOGIN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
} as const;

const HOME_ROUTE_NAME = 'home';
const INVALID_CREDENTIALS_MESSAGE = '잘못된 아이디 또는 비밀번호입니다.';
const LOGIN_ERROR_MESSAGE = '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

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
