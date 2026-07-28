const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^010\d{8}$/;
const PASSWORD_LETTER_PATTERN = /[A-Za-z]/;
const PASSWORD_NUMBER_PATTERN = /\d/;
const PASSWORD_SPECIAL_PATTERN = /[^A-Za-z0-9\s]/;

// 이메일 비교와 전송에 사용할 정규화된 값을 반환한다.
export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

// 로그인 식별자로 사용할 수 있는 이메일 형식인지 검사한다.
export const isValidEmail = (email: string): boolean => EMAIL_PATTERN.test(normalizeEmail(email));

// 휴대폰 번호에서 숫자 이외의 문자를 제거한다.
export const normalizePhone = (phone: string): string => phone.replace(/\D/g, '').slice(0, 11);

// 국내 휴대폰 번호 형식인지 검사한다.
export const isValidPhone = (phone: string): boolean => PHONE_PATTERN.test(normalizePhone(phone));

// 입력 중인 휴대폰 번호를 하이픈이 포함된 표시 형태로 바꾼다.
export const formatPhone = (phone: string): string => {
  const normalized = normalizePhone(phone);

  if (normalized.length <= 3) return normalized;
  if (normalized.length <= 7) return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
  return `${normalized.slice(0, 3)}-${normalized.slice(3, 7)}-${normalized.slice(7)}`;
};

// 이름이 필수 길이와 공백 규칙을 만족하는지 검사한다.
export const isValidName = (name: string): boolean => {
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && trimmedName.length <= 20;
};

// 비밀번호가 영문·숫자·특수문자를 포함한 8자 이상인지 검사한다.
export const isValidPassword = (password: string): boolean =>
  password.length >= 8 &&
  PASSWORD_LETTER_PATTERN.test(password) &&
  PASSWORD_NUMBER_PATTERN.test(password) &&
  PASSWORD_SPECIAL_PATTERN.test(password);

// 인증번호가 6자리 숫자인지 검사한다.
export const isValidVerificationCode = (code: string): boolean => /^\d{6}$/.test(code);
