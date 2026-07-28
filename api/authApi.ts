import { AUTH_DEMO } from '@/constants/auth';
import type {
  AuthApiAdapter,
  AuthErrorCode,
  AuthSession,
  LoginCredentials,
  PhoneVerificationCommand,
  SignUpCommand,
} from '@/types/auth';
import { normalizeEmail, normalizePhone } from '@/utils/authValidation';

export class AuthApiError extends Error {
  readonly code: AuthErrorCode;

  // 인증 오류를 화면에서 안전하게 분류할 수 있도록 코드와 메시지를 보관한다.
  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = 'AuthApiError';
    this.code = code;
  }
}

// 민감정보를 포함하지 않는 사용자용 인증 오류 문구로 변환한다.
export const toAuthErrorMessage = (
  error: unknown,
  fallback = '요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.'
): string => {
  if (!(error instanceof AuthApiError)) return fallback;

  const messages: Record<AuthErrorCode, string> = {
    INVALID_CREDENTIALS: '이메일 또는 비밀번호를 다시 확인해주세요.',
    DORMANT_ACCOUNT: '휴면 상태인 계정이에요. 고객센터를 통해 계정을 복구해주세요.',
    WITHDRAWN_ACCOUNT: '탈퇴 처리된 계정이에요. 다른 이메일을 이용해주세요.',
    DUPLICATE_ACCOUNT: '이미 가입된 정보예요. 로그인 또는 계정 찾기를 이용해주세요.',
    INVALID_VERIFICATION_CODE: '인증번호가 일치하지 않아요. 다시 확인해주세요.',
    NETWORK: '네트워크 연결을 확인한 뒤 다시 시도해주세요.',
    SERVICE_UNAVAILABLE: '인증 서버 연결 정보가 아직 설정되지 않았어요.',
    UNKNOWN: fallback,
  };

  return messages[error.code];
};

// 데모 요청 상태를 실제 네트워크 호출처럼 확인할 수 있도록 잠시 대기한다.
const wait = (delayMs: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

// 백엔드 계약이 없는 환경에서 임의의 요청을 보내지 않는 안전한 어댑터를 만든다.
const createUnavailableAuthApi = (): AuthApiAdapter => {
  // 계약이 없는 인증 요청을 임의로 전송하지 않고 설정 오류를 반환한다.
  const unavailable = async (): Promise<never> => {
    throw new AuthApiError('SERVICE_UNAVAILABLE', 'Auth API contract is not configured.');
  };

  return {
    // 이메일 로그인 API가 설정되지 않았음을 알린다.
    login: unavailable,
    // 로컬 로그아웃을 막지 않도록 서버 호출 없이 완료한다.
    logout: async () => undefined,
    // 이메일 중복 확인 API가 설정되지 않았음을 알린다.
    checkEmailAvailability: unavailable,
    // 휴대폰 인증 요청 API가 설정되지 않았음을 알린다.
    requestPhoneVerification: unavailable,
    // 휴대폰 인증 확인 API가 설정되지 않았음을 알린다.
    verifyPhone: unavailable,
    // 회원가입 API가 설정되지 않았음을 알린다.
    signUp: unavailable,
    // 환경에 지정된 카카오 인증 진입 주소만 노출한다.
    getKakaoLoginUrl: () => import.meta.env.VITE_KAKAO_AUTH_URL ?? null,
  };
};

// 서버 구현 전에도 화면 흐름과 오류 상태를 확인할 수 있는 개발 전용 어댑터를 만든다.
export const createDemoAuthApi = (delayMs = 350): AuthApiAdapter => ({
  // 고정 데모 계정과 입력값을 비교해 로그인 상태를 반환한다.
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await wait(delayMs);
    const email = normalizeEmail(credentials.email);

    if (email === 'dormant@durimoa.test') {
      throw new AuthApiError('DORMANT_ACCOUNT', 'Dormant demo account.');
    }
    if (email === 'withdrawn@durimoa.test') {
      throw new AuthApiError('WITHDRAWN_ACCOUNT', 'Withdrawn demo account.');
    }
    if (email === 'network@durimoa.test') {
      throw new AuthApiError('NETWORK', 'Demo network error.');
    }
    if (email !== AUTH_DEMO.EMAIL || credentials.password !== AUTH_DEMO.PASSWORD) {
      throw new AuthApiError('INVALID_CREDENTIALS', 'Invalid demo credentials.');
    }

    return {
      authenticated: true,
      provider: 'email',
      member: {
        name: '두리',
        email,
      },
    };
  },

  // 데모 로그아웃 요청 지연을 재현한다.
  async logout(): Promise<void> {
    await wait(delayMs);
  },

  // 데모 중복 이메일을 제외한 이메일의 사용 가능 상태를 반환한다.
  async checkEmailAvailability(email: string): Promise<boolean> {
    await wait(delayMs);
    return normalizeEmail(email) !== AUTH_DEMO.DUPLICATE_EMAIL;
  },

  // 데모 중복 휴대폰 번호를 제외한 번호로 인증 발송 상태를 진행한다.
  async requestPhoneVerification(phone: string): Promise<void> {
    await wait(delayMs);
    if (normalizePhone(phone) === AUTH_DEMO.DUPLICATE_PHONE) {
      throw new AuthApiError('DUPLICATE_ACCOUNT', 'Duplicate demo phone.');
    }
  },

  // 고정 데모 인증번호와 입력값이 일치하는지 확인한다.
  async verifyPhone(command: PhoneVerificationCommand): Promise<void> {
    await wait(delayMs);
    if (command.code !== AUTH_DEMO.VERIFICATION_CODE) {
      throw new AuthApiError('INVALID_VERIFICATION_CODE', 'Invalid demo verification code.');
    }
  },

  // 작성한 회원 정보로 데모 가입 세션을 생성한다.
  async signUp(command: SignUpCommand): Promise<AuthSession> {
    await wait(delayMs);
    return {
      authenticated: true,
      provider: 'signup',
      member: {
        name: command.name.trim(),
        email: normalizeEmail(command.email),
      },
    };
  },

  // 설정된 경우에만 카카오 인증 진입 주소를 반환한다.
  getKakaoLoginUrl(): string | null {
    return import.meta.env.VITE_KAKAO_AUTH_URL ?? null;
  },
});

// TODO(auth-api): 백엔드의 이메일 필드·엔드포인트·세션 계약 확정 후 실제 axios 어댑터를 연결한다.
let currentAuthApi: AuthApiAdapter =
  import.meta.env.VITE_AUTH_MODE === 'demo' ? createDemoAuthApi() : createUnavailableAuthApi();

// 실제 API 계약 또는 테스트 어댑터로 인증 구현을 교체한다.
export const setAuthApiAdapter = (adapter: AuthApiAdapter): void => {
  currentAuthApi = adapter;
};

export const authApi: AuthApiAdapter = {
  // 현재 선택된 어댑터로 로그인 요청을 전달한다.
  login: (credentials) => currentAuthApi.login(credentials),
  // 현재 선택된 어댑터로 로그아웃 요청을 전달한다.
  logout: () => currentAuthApi.logout(),
  // 현재 선택된 어댑터로 이메일 중복 확인을 전달한다.
  checkEmailAvailability: (email) => currentAuthApi.checkEmailAvailability(email),
  // 현재 선택된 어댑터로 휴대폰 인증 요청을 전달한다.
  requestPhoneVerification: (phone) => currentAuthApi.requestPhoneVerification(phone),
  // 현재 선택된 어댑터로 휴대폰 인증번호 확인을 전달한다.
  verifyPhone: (command) => currentAuthApi.verifyPhone(command),
  // 현재 선택된 어댑터로 회원가입 요청을 전달한다.
  signUp: (command) => currentAuthApi.signUp(command),
  // 현재 선택된 어댑터에서 카카오 인증 진입 주소를 가져온다.
  getKakaoLoginUrl: () => currentAuthApi.getKakaoLoginUrl(),
};
