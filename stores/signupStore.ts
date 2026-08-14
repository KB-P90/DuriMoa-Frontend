import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { SignupRoleDto } from '@/types/dto/auth.dto';

export const useSignupStore = defineStore('signup', () => {
  const name = ref('');
  const phone = ref('');
  const role = ref<SignupRoleDto | ''>('');
  const password = ref('');
  const passwordConfirm = ref('');
  const serviceTermsAgreed = ref(false);
  const privacyTermsAgreed = ref(false);
  const marketingTermsAgreed = ref(false);
  const financeTermsAgreed = ref(false);

  function reset() {
    name.value = '';
    phone.value = '';
    role.value = '';
    password.value = '';
    passwordConfirm.value = '';
    serviceTermsAgreed.value = false;
    privacyTermsAgreed.value = false;
    marketingTermsAgreed.value = false;
    financeTermsAgreed.value = false;
  }

  return {
    financeTermsAgreed,
    marketingTermsAgreed,
    name,
    password,
    passwordConfirm,
    phone,
    privacyTermsAgreed,
    role,
    serviceTermsAgreed,
    reset,
  };
});
