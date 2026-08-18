import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useExpenseStore } from '@/stores/expenseStore';
import { ExpenseCategoryName } from '@/types/category';
import { getMonthlyExpenseCategoryIcon } from '@/utils/expense';

export function useSavingMissionList() {
  const expenseStore = useExpenseStore();
  const { savingMissions } = storeToRefs(expenseStore);

  const missions = computed(() =>
    savingMissions.value.missions.map((mission) => {
      const isChallenging = mission.status === '도전중';
      return {
        ...mission,
        categoryName: ExpenseCategoryName[mission.categoryCode],
        icon: getMonthlyExpenseCategoryIcon(mission.categoryCode),
        // TODO: 토큰 등록 검토
        amountClass: isChallenging
          ? 'text-[#EF826F]'
          : mission.isSelectable
            ? 'text-dm-mint-darker'
            : 'text-dm-gray',
        // TODO: 토큰 등록 검토
        buttonClass: isChallenging
          ? 'bg-[#F39A89] text-white'
          : mission.isSelectable
            ? 'bg-dm-mint text-deep-green'
            : 'bg-disable text-white',
      };
    })
  );

  return { savingMissions, missions };
}
