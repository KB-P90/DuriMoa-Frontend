import { api } from '@/apis/axios.js';
import type { ApiResponse } from '@/types/common';
import type {
  DailyCalendarResponseDto,
  MonthlyCalendarResponseDto,
  RecordRequestDto,
  RecordResponseDto,
} from '@/types/dto/calendar.dto';

export type CalendarApiType = 'PERSONAL' | 'WEDDING';

export async function getMonthlyCalendar(month: string, type: CalendarApiType) {
  const { data } = await api.get<ApiResponse<MonthlyCalendarResponseDto>>('/api/records/monthly', {
    params: { month, type },
  });

  return data.data;
}

export async function getDailyCalendar(date: string, type: CalendarApiType) {
  const { data } = await api.get<ApiResponse<DailyCalendarResponseDto>>('/api/records/daily', {
    params: { date, type },
  });

  return data.data;
}

export async function createRecord(request: RecordRequestDto) {
  const { data } = await api.post<ApiResponse<RecordResponseDto>>('/api/records', request);
  return data.data;
}

export async function updateRecord(recordId: number, request: RecordRequestDto) {
  const { data } = await api.patch<ApiResponse<RecordResponseDto>>(
    `/api/records/${recordId}`,
    request
  );
  return data.data;
}

export async function deleteRecord(recordId: number) {
  const { data } = await api.delete<ApiResponse<RecordResponseDto>>(`/api/records/${recordId}`);
  return data.data;
}
