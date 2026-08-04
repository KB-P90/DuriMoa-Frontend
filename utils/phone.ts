const MAX_PHONE_NUMBER_DIGITS = 11;

// 휴대폰 번호 입력값에서 숫자만 남기고 010-0000-0000 형태로 표시한다.
export function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, MAX_PHONE_NUMBER_DIGITS);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}
