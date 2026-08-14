import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type { AppNotification, NotificationListResponseDto } from '@/types/notification';

export const getNotifications = async () => {
  const { data } = await api.get<ApiResponse<NotificationListResponseDto>>('/notifications');
  return data.data.notices.map((notice): AppNotification => ({
    id: notice.noticeId,
    type: notice.type,
    title: notice.title,
    content: notice.content,
    isRead: notice.isRead,
    createdAt: notice.createdAt,
  }));
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

export const deleteNotification = async (notificationId: number) => {
  const { data } = await api.delete<ApiResponse<unknown>>(`/notifications/${notificationId}`);
  return data.data;
};

export const deleteSelectedNotifications = async (noticeIds: number[]) => {
  const { data } = await api.delete<ApiResponse<unknown>>('/notifications/batch', {
    data: { noticeIds },
  });
  return data.data;
};
