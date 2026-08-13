import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { PushDeviceDto } from '@/types/push';

export async function registerPushDevice(token: string): Promise<PushDeviceDto> {
  const { data } = await api.put<ApiResponse<PushDeviceDto>>('/push-devices', {
    token,
    platform: 'WEB',
  });
  return data.data;
}

export async function unregisterPushDevice(deviceId: number): Promise<void> {
  await api.delete<ApiResponse<null>>(`/push-devices/${deviceId}`);
}
