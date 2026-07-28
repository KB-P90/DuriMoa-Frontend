import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { createDemoAuthApi, setAuthApiAdapter } from '@/api/authApi';
import { AUTH_DEMO } from '@/constants/auth';
import { useAuthStore } from './authStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    setAuthApiAdapter(createDemoAuthApi(0));
  });

  it('유효한 이메일 계정으로 로그인하고 로그아웃하면 인증 상태를 제거한다', async () => {
    const store = useAuthStore();

    const didLogin = await store.login({
      email: AUTH_DEMO.EMAIL,
      password: AUTH_DEMO.PASSWORD,
    });

    expect(didLogin).toBe(true);
    expect(store.isAuthenticated).toBe(true);
    expect(store.session?.member.email).toBe(AUTH_DEMO.EMAIL);

    await store.logout();

    expect(store.isAuthenticated).toBe(false);
    expect(store.session).toBeNull();
  });

  it('잘못된 계정 정보에는 비밀번호를 노출하지 않는 오류를 제공한다', async () => {
    const store = useAuthStore();

    const didLogin = await store.login({
      email: 'wrong@durimoa.test',
      password: 'secret-value',
    });

    expect(didLogin).toBe(false);
    expect(store.errorMessage).toContain('이메일 또는 비밀번호');
    expect(store.errorMessage).not.toContain('secret-value');
  });
});
