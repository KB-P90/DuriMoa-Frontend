import { isAxiosError } from 'axios';
import { ONBOARDING_API_ERROR_MESSAGES } from '@/constants/onboard';

// API 오류 응답에 사용자에게 표시할 message가 있는지 확인한다.
function hasErrorMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  );
}

// Axios 오류 응답을 온보딩 화면에 표시할 안내 문구로 변환한다.
export function getOnboardingApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (!isAxiosError(error)) {
    return fallbackMessage;
  }

  if (!error.response) {
    return ONBOARDING_API_ERROR_MESSAGES.NETWORK;
  }

  return hasErrorMessage(error.response.data) ? error.response.data.message : fallbackMessage;
}
