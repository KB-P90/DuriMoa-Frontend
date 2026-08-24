export function getWeekdayIntensityClass(relativeStrength: number): string {
  if (relativeStrength >= 140) return 'bg-dm-mint-darker text-white';
  if (relativeStrength >= 100) return 'bg-dm-mint-dark text-gray-900';
  if (relativeStrength >= 60) return 'bg-dm-mint text-gray-800';
  return 'bg-dm-mint-light text-dm-gray-dark';
}

export function formatComparisonRatio(ratio: number | null): string {
  if (ratio === null) return '비교할 평일 지출이 아직 없어요';
  if (ratio === 100) return '평일과 주말의 일평균 지출이 같아요';

  const difference = Math.abs(Math.round(ratio - 100));
  return ratio > 100
    ? `주말 일평균이 평일보다 ${difference}% 높아요`
    : `주말 일평균이 평일보다 ${difference}% 낮아요`;
}
