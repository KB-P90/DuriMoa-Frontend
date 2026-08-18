import { computed, onScopeDispose, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';
import { useExpenseStore } from '@/stores/expenseStore';
import { ExpenseCategoryName } from '@/types/category';
import { getMonthlyExpenseCategoryIcon } from '@/utils/expense';
import type { SavingMissionStatus } from '@/types/expense';

const MISSION_STATUS_LABELS: Record<SavingMissionStatus, string> = {
  도전하기: '도전하기',
  도전중: '도전중',
  성공: '성공',
  실패: '실패',
  만료: '만료',
};

const MISSION_BUTTON_CLASSES: Record<SavingMissionStatus, string> = {
  도전하기: 'bg-dm-mint text-deep-green',
  도전중: 'bg-orange text-white',
  성공: 'bg-dm-mint-darker text-white',
  실패: 'bg-red-01 text-red',
  만료: 'bg-disable text-dm-gray-dark',
};

const CHALLENGE_CONFIRMATION_DURATION = 3000;

export function useSavingMissionList() {
  const expenseStore = useExpenseStore();
  const { savingMissions, challengingMissionId } = storeToRefs(expenseStore);
  const confirmedMissionId = ref<number | null>(null);
  let confirmationTimer: ReturnType<typeof setTimeout> | null = null;

  const missions = computed(() =>
    savingMissions.value.missions.map((mission) => {
      const isChallenging = mission.status === '도전중';
      return {
        ...mission,
        categoryName: ExpenseCategoryName[mission.categoryCode],
        icon: getMonthlyExpenseCategoryIcon(mission.categoryCode),
        amountClass: isChallenging
          ? 'text-orange'
          : mission.status === '도전하기'
            ? 'text-dm-mint-darker'
            : 'text-dm-gray',
        statusLabel:
          confirmedMissionId.value === mission.missionId
            ? '도전!'
            : MISSION_STATUS_LABELS[mission.status],
        buttonClass: MISSION_BUTTON_CLASSES[mission.status],
        canChallenge: mission.status === '도전하기' && challengingMissionId.value === null,
        isChallenging: challengingMissionId.value === mission.missionId,
      };
    })
  );

  async function challengeMission(missionId: number) {
    confirmedMissionId.value = missionId;
    const confirmationDelay = new Promise<void>((resolve) => {
      confirmationTimer = setTimeout(() => {
        confirmationTimer = null;
        resolve();
      }, CHALLENGE_CONFIRMATION_DURATION);
    });

    try {
      const [challengeStarted] = await Promise.all([
        expenseStore.challengeSavingMission(missionId),
        confirmationDelay,
      ]);
      if (!challengeStarted) return;
    } catch {
      if (confirmationTimer) {
        clearTimeout(confirmationTimer);
        confirmationTimer = null;
      }
      toast.error('절약 미션 도전에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      confirmedMissionId.value = null;
    }
  }

  onScopeDispose(() => {
    if (confirmationTimer) clearTimeout(confirmationTimer);
  });

  return {
    savingMissions,
    missions,
    challengeMission,
  };
}
