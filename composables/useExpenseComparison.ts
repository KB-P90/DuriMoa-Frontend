import { computed, nextTick, onScopeDispose, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useExpenseStore } from '@/stores/expenseStore';
import type { MonthlyExpenseCategoryCode } from '@/types/expense';
import { getMonthlyExpenseCategoryIcon } from '@/utils/expense';

const DISPLAY_CATEGORIES = [
  { code: 'FOOD', label: '식비' },
  { code: 'LIVING', label: '생활' },
  { code: 'SHOPPING', label: '쇼핑' },
  { code: 'CULTURE_TRAVEL', label: '문화/여가' },
  { code: 'ETC', label: '기타' },
] as const satisfies ReadonlyArray<{
  code: MonthlyExpenseCategoryCode;
  label: string;
}>;

export function useExpenseComparison() {
  const expenseStore = useExpenseStore();
  const { monthlyExpense } = storeToRefs(expenseStore);
  const isChartAnimated = ref(false);
  let animationFrameId: number | null = null;

  const rows = computed(() => {
    const myCategories = new Map(
      monthlyExpense.value.me.expenseCategories.map((category) => [category.categoryCode, category])
    );
    const partnerCategories = new Map(
      monthlyExpense.value.partner.expenseCategories.map((category) => [
        category.categoryCode,
        category,
      ])
    );
    const maxRate = Math.max(
      ...monthlyExpense.value.me.expenseCategories.map((category) => category.rate),
      ...monthlyExpense.value.partner.expenseCategories.map((category) => category.rate),
      1
    );

    return DISPLAY_CATEGORIES.map((displayCategory) => {
      const mine = myCategories.get(displayCategory.code);
      const partner = partnerCategories.get(displayCategory.code);
      return {
        ...displayCategory,
        icon: getMonthlyExpenseCategoryIcon(displayCategory.code),
        mineWidth: `${((mine?.rate ?? 0) / maxRate) * 100}%`,
        partnerWidth: `${((partner?.rate ?? 0) / maxRate) * 100}%`,
      };
    });
  });

  const insight = computed(() => {
    const expense = monthlyExpense.value;
    if (!expense.me.expenseCategories.length) return null;

    const partnerCategories = new Map(
      expense.partner.expenseCategories.map((category) => [category.categoryCode, category])
    );
    const myTotal = expense.me.expenseCategories.reduce(
      (sum, category) => sum + category.amount,
      0
    );
    const partnerTotal = expense.partner.expenseCategories.reduce(
      (sum, category) => sum + category.amount,
      0
    );
    const largestDifference = [...expense.me.expenseCategories].sort((a, b) => {
      const aDifference = Math.abs(a.amount - (partnerCategories.get(a.categoryCode)?.amount ?? 0));
      const bDifference = Math.abs(b.amount - (partnerCategories.get(b.categoryCode)?.amount ?? 0));
      return bDifference - aDifference;
    })[0];

    return {
      higherSpenderName: myTotal >= partnerTotal ? expense.me.name : expense.partner.name,
      categoryLabel: largestDifference.categoryName,
    };
  });

  watch(
    rows,
    async (currentRows) => {
      isChartAnimated.value = false;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      if (!currentRows.length) return;

      await nextTick();
      animationFrameId = requestAnimationFrame(() => {
        animationFrameId = requestAnimationFrame(() => {
          isChartAnimated.value = true;
          animationFrameId = null;
        });
      });
    },
    { immediate: true }
  );

  onScopeDispose(() => {
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
  });

  return { rows, insight, isChartAnimated };
}
