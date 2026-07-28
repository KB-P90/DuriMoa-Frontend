import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

import { authApi } from '@/api/authApi';
import { AUTH_ROUTE_NAMES } from '@/constants/auth';
import { useAuthStore } from '@/stores/authStore';
import { isValidEmail, normalizeEmail } from '@/utils/authValidation';

// 외부 사이트로 이어지지 않는 앱 내부 리다이렉트 경로만 허용한다.
const getSafeRedirectPath = (value: unknown): string | null =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : null;

// 로그인 화면의 입력 검증과 인증 후 이동 흐름을 제공한다.
export const useLoginForm = () => {
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const { errorMessage, isSubmitting } = storeToRefs(authStore);

  // 이메일 로그인 폼에서 편집 중인 입력값이다.
  const email = ref('');
  const password = ref('');

  // 오류를 너무 일찍 표시하지 않기 위한 필드 방문 상태다.
  const emailTouched = ref(false);
  const passwordTouched = ref(false);
  const submitted = ref(false);

  // 이메일과 비밀번호가 로그인 요청에 필요한 최소 조건을 만족하는지 나타낸다.
  const canSubmit = computed(
    () => isValidEmail(email.value) && password.value.length > 0 && !isSubmitting.value
  );

  // 이메일 입력란 가까이에 표시할 형식 오류 문구다.
  const emailError = computed(() => {
    if (!emailTouched.value && !submitted.value) return '';
    if (!email.value.trim()) return '이메일을 입력해주세요.';
    return isValidEmail(email.value) ? '' : '올바른 이메일 형식으로 입력해주세요.';
  });

  // 비밀번호 입력란 가까이에 표시할 필수값 오류 문구다.
  const passwordError = computed(() => {
    if (!passwordTouched.value && !submitted.value) return '';
    return password.value.length > 0 ? '' : '비밀번호를 입력해주세요.';
  });

  // 유효한 입력으로 로그인을 요청하고 보호된 다음 화면으로 이동한다.
  const submit = async (): Promise<void> => {
    submitted.value = true;
    authStore.clearError();
    if (!canSubmit.value) return;

    const didLogin = await authStore.login({
      email: normalizeEmail(email.value),
      password: password.value,
    });
    if (!didLogin) return;

    const redirectPath = getSafeRedirectPath(route.query.redirect);
    if (redirectPath) {
      await router.replace(redirectPath);
      return;
    }
    await router.replace({ name: AUTH_ROUTE_NAMES.SESSION });
  };

  // 카카오 인증 주소가 설정돼 있으면 해당 인증 흐름으로 진입한다.
  const startKakaoLogin = (): void => {
    authStore.clearError();
    const kakaoLoginUrl = authApi.getKakaoLoginUrl();
    if (!kakaoLoginUrl) {
      errorMessage.value = '카카오 로그인 주소가 아직 설정되지 않았어요.';
      return;
    }
    window.location.assign(kakaoLoginUrl);
  };

  return {
    email,
    password,
    emailTouched,
    passwordTouched,
    isSubmitting,
    errorMessage,
    canSubmit,
    emailError,
    passwordError,
    submit,
    startKakaoLogin,
  };
};
