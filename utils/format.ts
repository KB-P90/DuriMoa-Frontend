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

export const formatWon = (amount: number) =>
  `${new Intl.NumberFormat('ko-KR').format(amount / 10_000)}만원`;

// 'YYYY-MM-DD HH:mm:ss' 형식의 날짜를 'YYYY.MM.DD'로 표시합니다.
export function formatDateDot(dateTime: string): string {
  return dateTime.slice(0, 10).replaceAll('-', '.');
}
