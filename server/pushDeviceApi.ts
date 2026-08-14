import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { PushDevicePlatform, PushDeviceRegisterResponseDto } from '@/types/pushDevice';

export const registerPushDevice = async (token: string, platform: PushDevicePlatform) => {
  const { data } = await api.put<ApiResponse<PushDeviceRegisterResponseDto>>('/push-devices', {
    token,
    platform,
  });
  return data.data;
};

export const unregisterPushDevice = async (deviceId: number) => {
  const { data } = await api.delete<ApiResponse<unknown>>(`/push-devices/${deviceId}`);
  return data.data;
};
