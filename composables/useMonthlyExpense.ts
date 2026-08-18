import { computed, toValue, watch, type MaybeRefOrGetter } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useExpenseStore } from '@/stores/expenseStore';
import { storeToRefs } from 'pinia';

interface YearMonth {
  year: number;
  month: number;
}

function currentYearMonth(): YearMonth {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function parseYearMonth(value?: string): YearMonth {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return currentYearMonth();
  const [year, month] = value.split('-').map(Number);
  if (month < 1 || month > 12) return currentYearMonth();
  return { year, month };
}

export function useMonthlyExpense(yearMonth: MaybeRefOrGetter<string | undefined>) {
  useAuthCheck();
  const router = useRouter();
  const expenseStore = useExpenseStore();
  const { expenseLoading, missionLoading } = storeToRefs(expenseStore);
  const selectedMonth = computed(() => parseYearMonth(toValue(yearMonth)));

  watch(
    selectedMonth,
    ({ year, month }) => {
      void Promise.all([
        expenseStore.fetchMonthlyExpense(year, month),
        expenseStore.fetchSavingMissions(year, month),
      ]);
    },
    { immediate: true }
  );

  function goHome() {
    void router.push({ name: 'home' });
  }

  return { selectedMonth, expenseLoading, missionLoading, goHome };
}
