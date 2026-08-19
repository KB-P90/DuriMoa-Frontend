// 금액의 절댓값에 천 단위 구분자를 적용합니다.
export function formatAmount(amount: number): string {
  return Math.abs(amount).toLocaleString('ko-KR');
}

// 금액에 부호와 선택적인 단위를 붙여 표시합니다.
export function formatSignedAmount(amount: number, unit = ''): string {
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}${formatAmount(amount)}${unit}`;
}

// 천 단위 구분자가 포함된 금액 문자열을 숫자로 변환합니다.
export function parseFormattedAmount(amount: string): number {
  return Number(amount.replaceAll(',', ''));
}

// 입력값에서 숫자만 남기고 최대 자릿수와 천 단위 구분자를 적용합니다.
export function formatAmountInput(value: string, maxDigits = 10): string {
  const digits = value.replace(/\D/g, '').slice(0, maxDigits);
  return digits ? formatAmount(Number(digits)) : '';
}

// 금액에 원 단위를 붙여 표시합니다.
export function formatWonAmount(amount: number): string {
  return `${formatAmount(amount)} 원`;
}

// 1억 원 이상의 금액을 소수 첫째 자리까지 버림한 억 단위로 표시합니다.
export function formatCompactWonAmount(amount: number): string {
  const oneHundredMillionWon = 100_000_000;
  if (Math.abs(amount) < oneHundredMillionWon) return formatWonAmount(amount);

  const amountInHundredMillions = Math.trunc((amount / oneHundredMillionWon) * 10) / 10;
  return `${formatAmount(amountInHundredMillions)} 억 원`;
}

export const formatWon = (amount: number) =>
  `${new Intl.NumberFormat('ko-KR').format(Math.round(amount / 10_000))}만원`;

// 입력값에서 숫자만 남기고 010-1234-5678 형식으로 하이픈을 붙입니다.
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length < 4) {
    return digits;
  }
  if (digits.length < 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  if (digits.length < 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

// 'YYYY-MM-DD HH:mm:ss' 형식의 날짜를 'YYYY.MM.DD'로 표시합니다.
export function formatDateDot(dateTime: string): string {
  return dateTime.slice(0, 10).replaceAll('-', '.');
}

// 'YYYY-MM-DD HH:mm:ss' 형식의 날짜를 '2시간 전' 같은 상대 시간으로 표시합니다.
export function formatRelativeTime(dateTime: string): string {
  const target = new Date(dateTime.replace(' ', 'T'));
  const diffMinutes = Math.floor((Date.now() - target.getTime()) / (60 * 1000));

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}주 전`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}개월 전`;

  return `${Math.floor(diffDays / 365)}년 전`;
}

// 'YYYY-MM-DD HH:mm:ss' 형식의 날짜를 '오전 12:16' 같은 시각으로 표시합니다.
export function formatClockTime(dateTime: string): string {
  const target = new Date(dateTime.includes('T') ? dateTime : dateTime.replace(' ', 'T'));
  return new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit' }).format(target);
}
