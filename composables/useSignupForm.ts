import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { AUTH_ROUTE_NAMES } from '@/constants/auth';
import { useAuthStore } from '@/stores/authStore';
import { useSignupStore } from '@/stores/signupStore';

// 회원가입 화면이 전용 store의 작성 상태와 요청 동작을 사용하도록 연결한다.
export const useSignupForm = () => {
  const router = useRouter();
  const signupStore = useSignupStore();
  const authStore = useAuthStore();
  const signupState = storeToRefs(signupStore);
  const { isSubmitting } = storeToRefs(authStore);

  // 가입 요청을 한 번만 처리하고 성공 시 지정된 온보딩 진입 화면으로 이동한다.
  const submit = async (): Promise<void> => {
    if (isSubmitting.value) return;

    const didSignUp = await signupStore.submit();
    if (!didSignUp) return;

    await router.replace({ name: AUTH_ROUTE_NAMES.ONBOARDING });
    signupStore.resetDraft();
  };

  return {
    ...signupState,
    isSubmitting,
    checkEmail: signupStore.checkEmail,
    requestPhoneVerification: signupStore.requestPhoneVerification,
    verifyPhone: signupStore.verifyPhone,
    setAllAgreements: signupStore.setAllAgreements,
    setAgreement: signupStore.setAgreement,
    submit,
  };
};
