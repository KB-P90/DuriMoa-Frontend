import { defineStore } from 'pinia';
import { getHomeDashboard, getMonthlySavingMissions } from '@/server/homeApi';
import { toHomeDashboard, toSavingMission } from '@/models/Home';
import type { HomeDashboard, SavingMission } from '@/types/home';

const EMPTY_DASHBOARD: HomeDashboard = {
  coupleStatus: 'WAIT',
  groomName: '',
  brideName: '',
  totalAccumulatedAmount: 0,
  usedAmount: 0,
  remainingAmount: 0,
  savingAlert: null,
  totalMissionCount: 0,
  inProgressMissionCount: 0,
  jointGoal: { targetAmount: 0, currentAmount: 0, achievementRate: 0 },
  personalGoal: { targetAmount: 0, currentAmount: 0, achievementRate: 0 },
  setupCompleted: false,
  setupChecklist: {
    totalCount: 0,
    completedCount: 0,
    currentStep: null,
    steps: [],
  },
};

export const useHomeStore = defineStore('home', {
  state: () => ({
    dashboard: EMPTY_DASHBOARD,
    missions: [] as SavingMission[],
    isLoading: false,
  }),
  actions: {
    async fetchHome(year = 2026, month = 7) {
      this.isLoading = true;

      try {
        const [dashboardDto, missionsDto] = await Promise.all([
          getHomeDashboard(),
          getMonthlySavingMissions(year, month),
        ]);

        if (dashboardDto) {
          this.dashboard = toHomeDashboard(dashboardDto);
        }
        this.missions = missionsDto.missions.map(toSavingMission);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
