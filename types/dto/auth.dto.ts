export interface LoginRequestDto {
  phone: string;
  password: string;
}

export interface LoginUserResponseDto {
  userId: number;
  phone: string | null;
  name: string;
  role: string;
  profileImage: string | null;
  provider: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: LoginUserResponseDto;
}

export type SignupRoleDto = 'B' | 'G';

export interface SignupRequestDto {
  phone: string;
  password: string;
  passwordConfirm: string;
  name: string;
  role: SignupRoleDto;
  serviceTermsAgreed: boolean;
  privacyTermsAgreed: boolean;
  financeTermsAgreed: boolean;
}

export interface SignupResponseDto {
  userId: number;
  phone: string;
  name: string;
  role: SignupRoleDto;
  provider: string;
  profileImage: string | null;
  createdAt: string;
}

export interface KakaoLoginRequestDto {
  code: string;
}

export interface KakaoLoginResponseDto {
  signupRequired: boolean;
  signupToken: string | null;
  accessToken: string | null;
  user: LoginUserResponseDto | null;
  name: string | null;
  profileImage: string | null;
}

export interface KakaoSignupRequestDto {
  signupToken: string;
  role: SignupRoleDto;
  serviceTermsAgreed: boolean;
  privacyTermsAgreed: boolean;
  financeTermsAgreed: boolean;
}
