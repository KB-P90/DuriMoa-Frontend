const MONTHLY_EXPENSE_CATEGORY_ICONS: Readonly<Record<string, string>> = {
  FOOD: '☕',
  LIVING: '🍽️',
  SHOPPING: '🏠',
  CULTURE_TRAVEL: '🚗',
  ETC: '🛍️',
};

export function getMonthlyExpenseCategoryIcon(categoryCode: string): string {
  return MONTHLY_EXPENSE_CATEGORY_ICONS[categoryCode] ?? '💰';
}
