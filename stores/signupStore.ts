import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';

import { authApi, toAuthErrorMessage } from '@/api/authApi';
import { TERM_ORDER } from '@/constants/auth';
import type { EmailAvailability, PhoneVerificationStatus, TermId } from '@/types/auth';
import {
  formatPhone,
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidPhone,
  isValidVerificationCode,
  normalizeEmail,
  normalizePhone,
} from '@/utils/authValidation';
import { useAuthStore } from './authStore';

// 새 회원가입 작성 상태에 사용할 미동의 약관 값을 만든다.
const initialAgreements = (): Record<TermId, boolean> => ({
  service: false,
  privacy: false,
  finance: false,
});

export const useSignupStore = defineStore('auth-signup', () => {
  // 약관 화면을 오가도 유지되는 회원 이름 입력값이다.
  const name = ref('');

  // 로그인 식별자로 사용할 회원 이메일 입력값이다.
  const email = ref('');

  // 화면 표시 형식이 적용된 휴대폰 번호 입력값이다.
  const phone = ref('');

  // 휴대폰으로 전달받았다고 가정하는 인증번호 입력값이다.
  const verificationCode = ref('');

  // 회원이 입력한 비밀번호와 확인값이다.
  const password = ref('');
  const passwordConfirmation = ref('');

  // 약관별 동의 여부를 회원가입 작성 중 유지한다.
  const agreements = ref<Record<TermId, boolean>>(initialAgreements());

  // 마지막으로 확인한 이메일의 중복 확인 상태다.
  const emailAvailability = ref<EmailAvailability>('idle');
  const checkedEmail = ref('');

  // 휴대폰 인증 요청부터 완료까지의 현재 단계다.
  const phoneVerificationStatus = ref<PhoneVerificationStatus>('idle');
  const verifiedPhone = ref('');

  // 회원가입 화면 전체에서 안내할 오류 문구다.
  const formError = ref('');

  // 이름이 회원가입 입력 규칙을 만족하는지 나타낸다.
  const isNameValid = computed(() => isValidName(name.value));

  // 이메일 형식이 올바른지 나타낸다.
  const isEmailValid = computed(() => isValidEmail(email.value));

  // 휴대폰 번호 형식이 올바른지 나타낸다.
  const isPhoneValid = computed(() => isValidPhone(phone.value));

  // 비밀번호가 보안 규칙을 충족하는지 나타낸다.
  const isPasswordValid = computed(() => isValidPassword(password.value));

  // 비밀번호 확인값이 원본과 일치하는지 나타낸다.
  const isPasswordMatching = computed(
    () => passwordConfirmation.value.length > 0 && password.value === passwordConfirmation.value
  );

  // 필수 약관 두 항목이 모두 동의됐는지 나타낸다.
  const hasRequiredAgreements = computed(
    () => agreements.value.service && agreements.value.privacy
  );

  // 선택 항목을 포함한 모든 약관이 동의됐는지 나타낸다.
  const hasAllAgreements = computed(() => TERM_ORDER.every((termId) => agreements.value[termId]));

  // 모든 필수 검증과 인증이 끝나 가입 요청을 보낼 수 있는지 나타낸다.
  const canSubmit = computed(
    () =>
      isNameValid.value &&
      isEmailValid.value &&
      emailAvailability.value === 'available' &&
      isPhoneValid.value &&
      phoneVerificationStatus.value === 'verified' &&
      isPasswordValid.value &&
      isPasswordMatching.value &&
      hasRequiredAgreements.value
  );

  // 이메일이 바뀌면 이전 중복 확인 결과를 무효화한다.
  watch(email, (nextEmail) => {
    if (normalizeEmail(nextEmail) !== checkedEmail.value) {
      emailAvailability.value = 'idle';
    }
  });

  // 휴대폰 번호를 보기 쉬운 형태로 정리하고 이전 인증 결과를 무효화한다.
  watch(phone, (nextPhone) => {
    const formattedPhone = formatPhone(nextPhone);
    if (nextPhone !== formattedPhone) {
      phone.value = formattedPhone;
      return;
    }

    if (normalizePhone(nextPhone) !== verifiedPhone.value) {
      phoneVerificationStatus.value = 'idle';
      verificationCode.value = '';
    }
  });

  // 현재 이메일이 가입 가능한지 인증 API 경계에서 확인한다.
  const checkEmail = async (): Promise<void> => {
    if (!isEmailValid.value || emailAvailability.value === 'checking') return;

    emailAvailability.value = 'checking';
    formError.value = '';
    try {
      const normalizedEmail = normalizeEmail(email.value);
      const isAvailable = await authApi.checkEmailAvailability(normalizedEmail);
      checkedEmail.value = normalizedEmail;
      emailAvailability.value = isAvailable ? 'available' : 'duplicate';
    } catch (error: unknown) {
      emailAvailability.value = 'idle';
      formError.value = toAuthErrorMessage(error);
    }
  };

  // 입력한 휴대폰 번호로 인증번호 발송을 요청한다.
  const requestPhoneVerification = async (): Promise<void> => {
    if (!isPhoneValid.value || phoneVerificationStatus.value === 'requesting') return;

    phoneVerificationStatus.value = 'requesting';
    formError.value = '';
    try {
      await authApi.requestPhoneVerification(normalizePhone(phone.value));
      phoneVerificationStatus.value = 'codeSent';
    } catch (error: unknown) {
      phoneVerificationStatus.value = 'idle';
      formError.value = toAuthErrorMessage(error);
    }
  };

  // 입력한 인증번호를 확인하고 인증 완료 휴대폰 번호를 기록한다.
  const verifyPhone = async (): Promise<void> => {
    if (
      !isValidVerificationCode(verificationCode.value) ||
      phoneVerificationStatus.value === 'verifying'
    ) {
      return;
    }

    phoneVerificationStatus.value = 'verifying';
    formError.value = '';
    try {
      const normalizedPhone = normalizePhone(phone.value);
      await authApi.verifyPhone({
        phone: normalizedPhone,
        code: verificationCode.value,
      });
      verifiedPhone.value = normalizedPhone;
      phoneVerificationStatus.value = 'verified';
    } catch (error: unknown) {
      phoneVerificationStatus.value = 'codeSent';
      formError.value = toAuthErrorMessage(error);
    }
  };

  // 전체 약관 체크 상태를 세 개의 개별 동의에 함께 반영한다.
  const setAllAgreements = (agreed: boolean): void => {
    agreements.value = {
      service: agreed,
      privacy: agreed,
      finance: agreed,
    };
  };

  // 선택한 약관 한 항목의 동의 상태를 갱신한다.
  const setAgreement = (termId: TermId, agreed: boolean): void => {
    agreements.value = {
      ...agreements.value,
      [termId]: agreed,
    };
  };

  // 검증된 작성 정보를 인증 store를 통해 회원가입 요청으로 전달한다.
  const submit = async (): Promise<boolean> => {
    if (!canSubmit.value) {
      formError.value = '필수 입력, 휴대폰 인증, 약관 동의를 모두 확인해주세요.';
      return false;
    }

    const authStore = useAuthStore();
    formError.value = '';
    const didSignUp = await authStore.signUp({
      name: name.value.trim(),
      email: normalizeEmail(email.value),
      phone: normalizePhone(phone.value),
      password: password.value,
      agreements: { ...agreements.value },
    });

    if (!didSignUp) {
      formError.value = authStore.errorMessage;
    }
    return didSignUp;
  };

  // 가입 완료 후 작성 중이던 민감 입력과 동의 상태를 모두 초기화한다.
  const resetDraft = (): void => {
    name.value = '';
    email.value = '';
    phone.value = '';
    verificationCode.value = '';
    password.value = '';
    passwordConfirmation.value = '';
    agreements.value = initialAgreements();
    emailAvailability.value = 'idle';
    checkedEmail.value = '';
    phoneVerificationStatus.value = 'idle';
    verifiedPhone.value = '';
    formError.value = '';
  };

  return {
    name,
    email,
    phone,
    verificationCode,
    password,
    passwordConfirmation,
    agreements,
    emailAvailability,
    phoneVerificationStatus,
    formError,
    isNameValid,
    isEmailValid,
    isPhoneValid,
    isPasswordValid,
    isPasswordMatching,
    hasRequiredAgreements,
    hasAllAgreements,
    canSubmit,
    checkEmail,
    requestPhoneVerification,
    verifyPhone,
    setAllAgreements,
    setAgreement,
    submit,
    resetDraft,
  };
});
