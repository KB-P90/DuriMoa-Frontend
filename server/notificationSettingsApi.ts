import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { NotificationSettingsDto } from '@/types/push';

export async function getNotificationSettings(): Promise<NotificationSettingsDto> {
  const { data } = await api.get<ApiResponse<NotificationSettingsDto>>('/notification-settings');
  return data.data;
}

export async function updateNotificationSettings(
  pushEnabled: boolean
): Promise<NotificationSettingsDto> {
  const { data } = await api.patch<ApiResponse<NotificationSettingsDto>>(
    '/notification-settings',
    { pushEnabled }
  );
  return data.data;
}
