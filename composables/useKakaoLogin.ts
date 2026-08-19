import { computed, ref } from 'vue';
import { isAxiosError } from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { loginWithKakao, signupWithKakao } from '@/server/authApi';
import { ACCESS_TOKEN_KEY } from '@/server/axios.js';
import { registerPushNotification } from '@/server/notificationPermission';
import { reconnectNotificationStream } from '@/composables/useNotificationStream';
import type { SignupRoleDto } from '@/types/dto/auth.dto';

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';
const HOME_ROUTE_NAME = 'home';
const LOGIN_ROUTE_NAME = 'login';
const KAKAO_SIGNUP_ROUTE_NAME = 'kakao-signup';

const KAKAO_SESSION_KEYS = {
  OAUTH_STATE: 'kakaoOAuthState',
  SIGNUP_TOKEN: 'kakaoSignupToken',
  NAME: 'kakaoSignupName',
  PROFILE_IMAGE: 'kakaoSignupProfileImage',
} as const;

const KAKAO_LOGIN_ERROR_MESSAGE =
  '카카오 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
const REQUIRED_TERMS_MESSAGE = '필수 약관에 모두 동의해주세요.';

function hasMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  );
}

function getQueryValue(value: string | null | (string | null)[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  return isAxiosError(error) && hasMessage(error.response?.data)
    ? error.response.data.message
    : fallback;
}

function saveAccessToken(accessToken: string | null): boolean {
  const normalizedToken = accessToken?.trim();
  if (!normalizedToken) return false;

  localStorage.setItem(ACCESS_TOKEN_KEY, normalizedToken);
  return true;
}

function clearKakaoSignupSession() {
  sessionStorage.removeItem(KAKAO_SESSION_KEYS.SIGNUP_TOKEN);
  sessionStorage.removeItem(KAKAO_SESSION_KEYS.NAME);
  sessionStorage.removeItem(KAKAO_SESSION_KEYS.PROFILE_IMAGE);
}

export function useKakaoAuthorization() {
  const authorizationError = ref('');

  function startKakaoLogin() {
    const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY?.trim();
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI?.trim();
    if (!clientId || !redirectUri) {
      authorizationError.value = '카카오 로그인 환경설정이 완료되지 않았습니다.';
      return;
    }

    authorizationError.value = '';
    clearKakaoSignupSession();

    const state = window.crypto.randomUUID();
    sessionStorage.setItem(KAKAO_SESSION_KEYS.OAUTH_STATE, state);

    const authorizeUrl = new URL(KAKAO_AUTHORIZE_URL);
    authorizeUrl.searchParams.set('response_type', 'code');
    authorizeUrl.searchParams.set('client_id', clientId);
    authorizeUrl.searchParams.set('redirect_uri', redirectUri);
    authorizeUrl.searchParams.set('state', state);
    window.location.assign(authorizeUrl.toString());
  }

  return {
    authorizationError,
    startKakaoLogin,
  };
}

export function useKakaoCallback() {
  const route = useRoute();
  const router = useRouter();
  const callbackError = ref('');
  const isProcessing = ref(false);

  async function handleKakaoCallback() {
    if (isProcessing.value) return;

    const oauthError = getQueryValue(route.query.error);
    const code = getQueryValue(route.query.code);
    const returnedState = getQueryValue(route.query.state);
    const storedState = sessionStorage.getItem(KAKAO_SESSION_KEYS.OAUTH_STATE) ?? '';
    sessionStorage.removeItem(KAKAO_SESSION_KEYS.OAUTH_STATE);

    if (oauthError) {
      callbackError.value = '카카오 로그인이 취소되었거나 승인되지 않았습니다.';
      return;
    }
    if (!code || !returnedState || returnedState !== storedState) {
      callbackError.value = '유효하지 않은 카카오 로그인 요청입니다.';
      return;
    }

    isProcessing.value = true;
    callbackError.value = '';

    try {
      const response = await loginWithKakao({ code });
      if (response.signupRequired) {
        if (!response.signupToken || !response.name) {
          callbackError.value = KAKAO_LOGIN_ERROR_MESSAGE;
          return;
        }

        sessionStorage.setItem(KAKAO_SESSION_KEYS.SIGNUP_TOKEN, response.signupToken);
        sessionStorage.setItem(KAKAO_SESSION_KEYS.NAME, response.name);
        if (response.profileImage) {
          sessionStorage.setItem(KAKAO_SESSION_KEYS.PROFILE_IMAGE, response.profileImage);
        }
        await router.replace({ name: KAKAO_SIGNUP_ROUTE_NAME });
        return;
      }

      if (!saveAccessToken(response.accessToken)) {
        callbackError.value = KAKAO_LOGIN_ERROR_MESSAGE;
        return;
      }
      void registerPushNotification();
      reconnectNotificationStream();
      await router.replace({ name: HOME_ROUTE_NAME });
    } catch (error: unknown) {
      callbackError.value = getApiErrorMessage(error, KAKAO_LOGIN_ERROR_MESSAGE);
    } finally {
      isProcessing.value = false;
    }
  }

  async function returnToLogin() {
    clearKakaoSignupSession();
    await router.replace({ name: LOGIN_ROUTE_NAME });
  }

  return {
    callbackError,
    handleKakaoCallback,
    isProcessing,
    returnToLogin,
  };
}

export function useKakaoSignup() {
  const router = useRouter();
  const name = ref(sessionStorage.getItem(KAKAO_SESSION_KEYS.NAME) ?? '');
  const profileImage = ref(sessionStorage.getItem(KAKAO_SESSION_KEYS.PROFILE_IMAGE));
  const role = ref<SignupRoleDto | ''>('');
  const serviceTermsAgreed = ref(false);
  const privacyTermsAgreed = ref(false);
  const signupError = ref('');
  const isSubmitting = ref(false);

  const canSubmit = computed(
    () =>
      Boolean(role.value) &&
      serviceTermsAgreed.value &&
      privacyTermsAgreed.value &&
      !isSubmitting.value
  );

  async function validateSignupSession() {
    const signupToken = sessionStorage.getItem(KAKAO_SESSION_KEYS.SIGNUP_TOKEN);
    if (!signupToken || !name.value) {
      clearKakaoSignupSession();
      await router.replace({ name: LOGIN_ROUTE_NAME });
    }
  }

  async function submitKakaoSignup() {
    if (isSubmitting.value) return;

    const signupToken = sessionStorage.getItem(KAKAO_SESSION_KEYS.SIGNUP_TOKEN);
    if (!signupToken) {
      signupError.value = '카카오 가입 정보가 만료되었습니다. 다시 로그인해주세요.';
      return;
    }
    if (!role.value) {
      signupError.value = '역할을 선택해주세요.';
      return;
    }
    if (!serviceTermsAgreed.value || !privacyTermsAgreed.value) {
      signupError.value = REQUIRED_TERMS_MESSAGE;
      return;
    }

    isSubmitting.value = true;
    signupError.value = '';

    try {
      const response = await signupWithKakao({
        signupToken,
        role: role.value,
        serviceTermsAgreed: serviceTermsAgreed.value,
        privacyTermsAgreed: privacyTermsAgreed.value,
        marketingTermsAgreed: false,
      });
      if (!saveAccessToken(response.accessToken)) {
        signupError.value = KAKAO_LOGIN_ERROR_MESSAGE;
        return;
      }

      clearKakaoSignupSession();
      void registerPushNotification();
      reconnectNotificationStream();
      await router.replace({ name: HOME_ROUTE_NAME });
    } catch (error: unknown) {
      signupError.value = getApiErrorMessage(error, KAKAO_LOGIN_ERROR_MESSAGE);
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    canSubmit,
    isSubmitting,
    name,
    privacyTermsAgreed,
    profileImage,
    role,
    serviceTermsAgreed,
    signupError,
    submitKakaoSignup,
    validateSignupSession,
  };
}
