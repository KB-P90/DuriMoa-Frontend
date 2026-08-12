import { api } from '@/server/axios.js';

export async function registerPushToken(token: string): Promise<void> {
  await api.post('/push-tokens', { token });
}

export async function unregisterPushToken(token: string): Promise<void> {
  await api.delete('/push-tokens', {
    params: { token },
  });
}
