import { computed, toValue, watch, type MaybeRefOrGetter } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
  if (!value || !/^\d{6}$/.test(value)) return currentYearMonth();

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));

  if (month < 1 || month > 12) return currentYearMonth();

  return { year, month };
}

export function useMonthlyExpense(yearMonth: MaybeRefOrGetter<string | undefined>) {
  useAuthCheck();
  const route = useRoute();
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

  function changeMonth({ year, month }: { year: number; month: number }) {
    void router.replace({
      name: 'expense',
      params: {
        yearMonth: `${year}${String(month).padStart(2, '0')}`,
      },
      query: route.query.from ? { from: route.query.from } : undefined,
    });
  }

  function goBack() {
    const routeName = route.query.from === 'home' ? 'home' : 'calendar';
    void router.push({ name: routeName });
  }

  return { selectedMonth, expenseLoading, missionLoading, changeMonth, goBack };
}
