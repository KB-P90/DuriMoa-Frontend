import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type {
  AppNotification,
  NotificationListResponseDto,
  NotificationSettingResponseDto,
  NotificationSettingUpdateRequestDto,
} from '@/types/notification';

export const getNotifications = async () => {
  const { data } = await api.get<ApiResponse<NotificationListResponseDto>>('/notifications');
  return {
    notifications: data.data.notices.map((notice): AppNotification => ({
      id: notice.noticeId,
      type: notice.type,
      title: notice.title,
      content: notice.content,
      isRead: notice.isRead,
      createdAt: notice.createdAt,
      targetType: notice.targetType,
      targetId: notice.targetId,
    })),
    // 별도 안읽음 개수 API(getUnreadNotificationCount)가 실제 스펙과 맞는지 확인이
    // 안 돼서 배지가 갱신 안 되는 문제가 있었다. 목록 응답에 이미 unreadCount가
    // 같이 오므로(검증됨) 목록을 불러올 때마다 이 값으로 동기화한다.
    unreadCount: data.data.unreadCount,
  };
};

export const markNotificationRead = async (notificationId: number) => {
  const { data } = await api.patch<ApiResponse<unknown>>(`/notifications/${notificationId}/read`);
  return data.data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await api.patch<ApiResponse<unknown>>('/notifications/read-all');
  return data.data;
};

type UnreadCountResponse = {
  unreadCount: number;
};

export const getUnreadNotificationCount = async () => {
  const { data } = await api.get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count');
  return data.data.unreadCount;
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

export const getNotificationSettings = async () => {
  const { data } =
    await api.get<ApiResponse<NotificationSettingResponseDto[]>>('/notification-settings');
  return data.data;
};

export const updateNotificationSettings = async (
  settings: NotificationSettingUpdateRequestDto[]
) => {
  const { data } = await api.patch<ApiResponse<unknown>>('/notification-settings', { settings });
  return data.data;
};
