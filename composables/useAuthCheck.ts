import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { refreshAccessToken } from '@/server/axios.js';
import { clearAccessToken, isAccessTokenValid } from '@/utils/auth';

const LOGIN_ROUTE_NAME = 'login';

export function useAuthCheck() {
  const router = useRouter();

  async function checkAuth() {
    if (isAccessTokenValid()) return true;

    try {
      await refreshAccessToken();
      return true;
    } catch {
      clearAccessToken();
      await router.replace({ name: LOGIN_ROUTE_NAME });
      return false;
    }
  }

  onMounted(checkAuth);

  return { checkAuth };
}
