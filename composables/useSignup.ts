import { computed, ref, watch } from 'vue';
import { isAxiosError } from 'axios';
import { useRouter } from 'vue-router';
import type { SignupRequestDto, SignupResponseDto, SignupRoleDto } from '@/types/dto/auth';

export type SignupGateway = (request: SignupRequestDto) => Promise<SignupResponseDto>;

const ONBOARDING_ROUTE_NAME = 'onboarding';
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

// API 함수를 주입하지 않으면 입력값만 준비하고 온보딩으로 이동한다.
export function useSignup(signupGateway?: SignupGateway) {
  const router = useRouter();
  const name = ref('');
  const phone = ref('');
  const role = ref<SignupRoleDto | ''>('');
  const password = ref('');
  const passwordConfirm = ref('');
  const serviceTermsAgreed = ref(false);
  const privacyTermsAgreed = ref(false);
  const marketingTermsAgreed = ref(false);
  const signupError = ref('');
  const signupResponse = ref<SignupResponseDto | null>(null);
  const isSubmitting = ref(false);

  const passwordsMatch = computed(
    () => passwordConfirm.value.length === 0 || password.value === passwordConfirm.value
  );

  watch(
    [
      name,
      phone,
      role,
      password,
      passwordConfirm,
      serviceTermsAgreed,
      privacyTermsAgreed,
      marketingTermsAgreed,
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
      marketingTermsAgreed: marketingTermsAgreed.value,
    };
  }

  async function submitSignup() {
    if (isSubmitting.value) return;

    if (password.value !== passwordConfirm.value) {
      signupError.value = PASSWORD_MISMATCH_MESSAGE;
      return;
    }

    if (!serviceTermsAgreed.value || !privacyTermsAgreed.value) {
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

      await router.replace({ name: ONBOARDING_ROUTE_NAME });
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
    isSubmitting,
    marketingTermsAgreed,
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
