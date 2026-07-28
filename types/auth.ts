export type AuthProvider = 'email' | 'signup' | 'kakao';

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'DORMANT_ACCOUNT'
  | 'WITHDRAWN_ACCOUNT'
  | 'DUPLICATE_ACCOUNT'
  | 'INVALID_VERIFICATION_CODE'
  | 'NETWORK'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN';

export type TermId = 'service' | 'privacy' | 'finance';

export type EmailAvailability = 'idle' | 'checking' | 'available' | 'duplicate';

export type PhoneVerificationStatus = 'idle' | 'requesting' | 'codeSent' | 'verifying' | 'verified';

export interface AuthMember {
  name: string;
  email: string;
}

export interface AuthSession {
  authenticated: true;
  provider: AuthProvider;
  member: AuthMember;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCommand {
  name: string;
  email: string;
  phone: string;
  password: string;
  agreements: Record<TermId, boolean>;
}

export interface PhoneVerificationCommand {
  phone: string;
  code: string;
}

export interface TermDocumentSection {
  heading: string;
  paragraphs: readonly string[];
}

export interface TermDocument {
  id: TermId;
  title: string;
  effectiveDate: string;
  updatedDate: string;
  required: boolean;
  summary: string;
  sections: readonly TermDocumentSection[];
}

export interface AuthApiAdapter {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  checkEmailAvailability(email: string): Promise<boolean>;
  requestPhoneVerification(phone: string): Promise<void>;
  verifyPhone(command: PhoneVerificationCommand): Promise<void>;
  signUp(command: SignUpCommand): Promise<AuthSession>;
  getKakaoLoginUrl(): string | null;
}
