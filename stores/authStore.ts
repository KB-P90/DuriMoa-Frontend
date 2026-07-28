import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { authApi, toAuthErrorMessage } from '@/api/authApi';
import { AUTH_SESSION_STORAGE_KEY } from '@/constants/auth';
import type { AuthSession, LoginCredentials, SignUpCommand } from '@/types/auth';

// 저장된 데모 세션이 화면에서 사용할 수 있는 최소 형태인지 확인한다.
const isAuthSession = (value: unknown): value is AuthSession => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (candidate.authenticated !== true || typeof candidate.member !== 'object') return false;

  const member = candidate.member as Record<string, unknown>;
  return (
    typeof candidate.provider === 'string' &&
    typeof member.name === 'string' &&
    typeof member.email === 'string'
  );
};

// 데모 모드에서만 새로고침 전 인증 화면 확인용 세션을 복원한다.
const readDemoSession = (): AuthSession | null => {
  if (import.meta.env.VITE_AUTH_MODE !== 'demo' || typeof sessionStorage === 'undefined')
    return null;

  try {
    const storedSession = sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!storedSession) return null;

    const parsedSession: unknown = JSON.parse(storedSession);
    return isAuthSession(parsedSession) ? parsedSession : null;
  } catch {
    sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
};

// 데모 세션을 새로고침 후에도 확인할 수 있도록 브라우저 세션에 보관한다.
const writeDemoSession = (session: AuthSession | null): void => {
  if (import.meta.env.VITE_AUTH_MODE !== 'demo' || typeof sessionStorage === 'undefined') return;

  if (session) {
    sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    return;
  }

  sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
};

export const useAuthStore = defineStore('auth', () => {
  // 현재 로그인한 회원의 비민감 세션 정보다.
  const session = ref<AuthSession | null>(readDemoSession());

  // 인증 요청이 진행 중인지 나타낸다.
  const isSubmitting = ref(false);

  // 로그인·회원가입·로그아웃 요청에서 표시할 안전한 오류 문구다.
  const errorMessage = ref('');

  // 보호 라우트 진입 가능 여부다.
  const isAuthenticated = computed(() => session.value?.authenticated === true);

  // 인증 세션을 메모리와 개발용 세션 저장소에 반영한다.
  const acceptSession = (nextSession: AuthSession): void => {
    session.value = nextSession;
    writeDemoSession(nextSession);
  };

  // 이메일 자격 증명으로 로그인하고 성공한 세션을 저장한다.
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    if (isSubmitting.value) return false;

    isSubmitting.value = true;
    errorMessage.value = '';
    try {
      const nextSession = await authApi.login(credentials);
      acceptSession(nextSession);
      return true;
    } catch (error: unknown) {
      errorMessage.value = toAuthErrorMessage(error);
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  // 회원가입을 완료하고 발급된 세션을 인증 상태에 반영한다.
  const signUp = async (command: SignUpCommand): Promise<boolean> => {
    if (isSubmitting.value) return false;

    isSubmitting.value = true;
    errorMessage.value = '';
    try {
      const nextSession = await authApi.signUp(command);
      acceptSession(nextSession);
      return true;
    } catch (error: unknown) {
      errorMessage.value = toAuthErrorMessage(error);
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  // 서버 로그아웃 결과와 관계없이 로컬 인증 상태를 안전하게 제거한다.
  const logout = async (): Promise<void> => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;
    errorMessage.value = '';
    try {
      await authApi.logout();
    } catch (error: unknown) {
      errorMessage.value = toAuthErrorMessage(
        error,
        '서버 연결은 확인하지 못했지만 이 기기에서는 로그아웃했어요.'
      );
    } finally {
      session.value = null;
      writeDemoSession(null);
      isSubmitting.value = false;
    }
  };

  // 이전 요청의 오류 문구를 새 입력 전에 제거한다.
  const clearError = (): void => {
    errorMessage.value = '';
  };

  return {
    session,
    isSubmitting,
    errorMessage,
    isAuthenticated,
    login,
    signUp,
    logout,
    clearError,
  };
});
