import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { AUTH_ROUTE_NAMES } from '@/constants/auth';
import { useAuthStore } from '@/stores/authStore';

// 인증 완료 화면에 현재 세션과 로그아웃 흐름을 제공한다.
export const useAuthSession = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const { session, isSubmitting } = storeToRefs(authStore);

  // 인증 상태를 제거한 뒤 다시 접근 가능한 로그인 화면으로 이동한다.
  const logout = async (): Promise<void> => {
    await authStore.logout();
    await router.replace({ name: AUTH_ROUTE_NAMES.LOGIN });
  };

  return {
    session,
    isSubmitting,
    logout,
  };
};
