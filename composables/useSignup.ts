import { computed, ref, watch } from 'vue';
import { isAxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useSignupStore } from '@/stores/signupStore';
import type { SignupRequestDto, SignupResponseDto } from '@/types/dto/auth.dto';
import { formatPhoneNumber } from '@/utils/phone';
import { PENDING_NOTIFICATION_CONSENT_KEY } from '@/constants/notificationConsent';

export type SignupGateway = (request: SignupRequestDto) => Promise<SignupResponseDto>;

const LOGIN_ROUTE_NAME = 'login';
const PASSWORD_MISMATCH_MESSAGE = '비밀번호가 일치하지 않습니다.';
const REQUIRED_TERMS_MESSAGE = '필수 약관에 모두 동의해주세요.';
const SIGNUP_ERROR_MESSAGE = '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

function hasMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  );
}

// 주입된 회원가입 API로 요청하고 성공하면 로그인 화면으로 이동한다.
export function useSignup(signupGateway?: SignupGateway) {
  const router = useRouter();
  const signupStore = useSignupStore();
  const {
    financeTermsAgreed,
    name,
    password,
    passwordConfirm,
    phone,
    privacyTermsAgreed,
    role,
    serviceTermsAgreed,
  } = storeToRefs(signupStore);
  const notificationAgreed = ref(false);

  const signupError = ref('');
  const signupResponse = ref<SignupResponseDto | null>(null);
  const isSubmitting = ref(false);

  const passwordsMatch = computed(
    () => passwordConfirm.value.length === 0 || password.value === passwordConfirm.value
  );

  watch(phone, (value) => {
    const formattedPhone = formatPhoneNumber(value);
    if (value !== formattedPhone) phone.value = formattedPhone;
  });

  watch(
    [
      name,
      phone,
      role,
      password,
      passwordConfirm,
      serviceTermsAgreed,
      privacyTermsAgreed,
      financeTermsAgreed,
    ],
    () => {
      signupError.value = '';
    }
  );

  function createSignupRequest(): SignupRequestDto | null {
    if (!role.value) return null;

    return {
      phone: phone.value,
      password: password.value,
      passwordConfirm: passwordConfirm.value,
      name: name.value,
      role: role.value,
      serviceTermsAgreed: serviceTermsAgreed.value,
      privacyTermsAgreed: privacyTermsAgreed.value,
      financeTermsAgreed: financeTermsAgreed.value,
    };
  }

  async function submitSignup() {
    if (isSubmitting.value) return;

    if (password.value !== passwordConfirm.value) {
      signupError.value = PASSWORD_MISMATCH_MESSAGE;
      return;
    }

    if (!serviceTermsAgreed.value || !privacyTermsAgreed.value || !financeTermsAgreed.value) {
      signupError.value = REQUIRED_TERMS_MESSAGE;
      return;
    }

    const request = createSignupRequest();
    if (!request) return;

    isSubmitting.value = true;
    signupError.value = '';

    try {
      if (signupGateway) {
        signupResponse.value = await signupGateway(request);
      }

      localStorage.setItem(PENDING_NOTIFICATION_CONSENT_KEY, String(notificationAgreed.value));
      signupStore.reset();
      await router.replace({ name: LOGIN_ROUTE_NAME });
    } catch (error: unknown) {
      signupError.value =
        isAxiosError(error) && hasMessage(error.response?.data)
          ? error.response.data.message
          : SIGNUP_ERROR_MESSAGE;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    financeTermsAgreed,
    isSubmitting,
    notificationAgreed,
    name,
    password,
    passwordConfirm,
    passwordsMatch,
    phone,
    privacyTermsAgreed,
    role,
    serviceTermsAgreed,
    signupError,
    signupResponse,
    submitSignup,
  };
}
