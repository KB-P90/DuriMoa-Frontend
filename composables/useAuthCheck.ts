import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isAccessTokenValid } from '@/utils/auth';

export function useAuthCheck() {
  const router = useRouter();

  function checkAuth() {
    if (isAccessTokenValid()) return true;

    router.replace({ name: 'login' });
    return false;
  }

  onMounted(checkAuth);

  return { checkAuth };
}
