import { defineStore } from 'pinia';
import { getHomeDashboard, getMonthlySavingMissions } from '@/server/homeApi';
import { toHomeDashboard } from '@/models/Home';
import type { HomeDashboard } from '@/types/home';
import type { SavingMission } from '@/types/expense';

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
    isRefreshingDashboard: false,
    hasPendingDashboardRefresh: false,
  }),
  actions: {
    // 실시간 알림 수신 시 홈 대시보드만 다시 조회한다. 연속 요청은 한 번 더 갱신하도록 합친다.
    async refreshDashboard() {
      if (this.isRefreshingDashboard) {
        this.hasPendingDashboardRefresh = true;
        return;
      }

      this.isRefreshingDashboard = true;

      try {
        do {
          this.hasPendingDashboardRefresh = false;

          try {
            const dashboard = await getHomeDashboard();
            if (dashboard) {
              this.dashboard = toHomeDashboard(dashboard);
            }
          } catch {
            // 실시간 갱신 실패 시 현재 홈 데이터를 유지한다.
          }
        } while (this.hasPendingDashboardRefresh);
      } finally {
        this.isRefreshingDashboard = false;
      }
    },
    async fetchHome(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
      this.isLoading = true;

      try {
        const [dashboardResult, missionsResult] = await Promise.allSettled([
          getHomeDashboard(),
          getMonthlySavingMissions(year, month),
        ]);

        if (dashboardResult.status === 'fulfilled' && dashboardResult.value) {
          this.dashboard = toHomeDashboard(dashboardResult.value);
        }
        if (missionsResult.status === 'fulfilled') {
          this.missions = missionsResult.value.missions;
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
});
