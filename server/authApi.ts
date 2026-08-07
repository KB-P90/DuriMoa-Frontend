import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type {
  LoginRequestDto,
  LoginResponseDto,
  SignupRequestDto,
  SignupResponseDto,
} from '@/types/dto/auth.dto';

const AUTH_ENDPOINT_PREFIX = '/auth';

export async function login(request: LoginRequestDto): Promise<LoginResponseDto> {
  const { data } = await api.post<ApiResponse<LoginResponseDto>>(
    `${AUTH_ENDPOINT_PREFIX}/login`,
    request
  );
  return data.data;
}

// 회원가입 화면에 주입하면 백엔드 연동이 활성화되는 API 경계다.
export async function signup(request: SignupRequestDto): Promise<SignupResponseDto> {
  const { data } = await api.post<ApiResponse<SignupResponseDto>>(
    `${AUTH_ENDPOINT_PREFIX}/signup`,
    request
  );
  return data.data;
}

export async function logoutAuth(): Promise<void> {
  await api.post(`${AUTH_ENDPOINT_PREFIX}/logout`);
}
