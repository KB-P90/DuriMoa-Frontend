import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { createDemoAuthApi, setAuthApiAdapter } from '@/api/authApi';
import { AUTH_DEMO } from '@/constants/auth';
import { useSignupStore } from './signupStore';

describe('useSignupStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    setAuthApiAdapter(createDemoAuthApi(0));
  });

  it('필수 인증과 동의가 모두 끝난 경우에만 가입을 완료한다', async () => {
    const store = useSignupStore();
    store.name = '김민정';
    store.email = 'new@durimoa.test';
    store.phone = '010-4561-8234';
    store.password = 'Duri1234!';
    store.passwordConfirmation = 'Duri1234!';

    await store.checkEmail();
    await store.requestPhoneVerification();
    store.verificationCode = AUTH_DEMO.VERIFICATION_CODE;
    await store.verifyPhone();
    store.setAgreement('service', true);
    store.setAgreement('privacy', true);

    expect(store.canSubmit).toBe(true);
    expect(await store.submit()).toBe(true);
  });

  it('약관 전문 화면을 오가는 동안 사용할 작성 상태를 store에 유지한다', () => {
    const firstAccess = useSignupStore();
    firstAccess.name = '김민정';
    firstAccess.setAgreement('service', true);

    const afterNavigation = useSignupStore();

    expect(afterNavigation.name).toBe('김민정');
    expect(afterNavigation.agreements.service).toBe(true);
    expect(afterNavigation.agreements.privacy).toBe(false);
  });

  it('선택 약관 없이도 필수 약관을 동의하면 가입 조건을 충족할 수 있다', async () => {
    const store = useSignupStore();
    store.name = '김민정';
    store.email = 'optional@durimoa.test';
    store.phone = '010-1234-5678';
    store.password = 'Duri1234!';
    store.passwordConfirmation = 'Duri1234!';

    await store.checkEmail();
    await store.requestPhoneVerification();
    store.verificationCode = AUTH_DEMO.VERIFICATION_CODE;
    await store.verifyPhone();
    store.setAgreement('service', true);
    store.setAgreement('privacy', true);

    expect(store.agreements.finance).toBe(false);
    expect(store.canSubmit).toBe(true);
  });
});
