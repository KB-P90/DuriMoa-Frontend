import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { AppNotification } from '@/types/notification';

export const getNotifications = async () => {
  const { data } = await api.get<ApiResponse<AppNotification[]>>('/notifications');
  return data.data;
};

export const markNotificationRead = async (notificationId: number) => {
  const { data } = await api.patch<ApiResponse<unknown>>(`/notifications/${notificationId}/read`);
  return data.data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await api.patch<ApiResponse<unknown>>('/notifications/read-all');
  return data.data;
};

export const getUnreadNotificationCount = async () => {
  const { data } = await api.get<ApiResponse<number>>('/notifications/unread-count');
  return data.data;
};
