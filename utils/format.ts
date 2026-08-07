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
