import { defineStore } from 'pinia';
import { getHomeDashboard, getMonthlySavingMissions } from '@/api/homeApi';
import { toHomeDashboard, toSavingMission } from '@/models/Home';
import type { HomeDashboard, SavingMission } from '@/types/home';

const MOCK_DASHBOARD: HomeDashboard = {
  groomName: '김준',
  brideName: '이서연',
  totalAccumulatedAmount: 31_190_000,
  usedAmount: 18_790_000,
  remainingAmount: 12_400_000,
  savingAlert: { isShortage: true, message: '이번 달 저축이 32만원 부족해요. 남은 5일 동안 채워보세요.' },
  totalMissionCount: 3,
  inProgressMissionCount: 2,
  jointGoal: { targetAmount: 50_000_000, currentAmount: 31_190_000, achievementRate: 62 },
  personalGoal: { targetAmount: 30_000_000, currentAmount: 11_190_000, achievementRate: 32 },
};

const MOCK_MISSIONS: SavingMission[] = [
  { id: 'MISSION-001', title: '카페 / 간식', actionMethod: '주 3회 → 주 1회', status: '도전중', expectedSavingAmount: 30_000 },
  { id: 'MISSION-002', title: '외식 줄이기', actionMethod: '주 2회 → 주 1회', status: '도전중', expectedSavingAmount: 40_000 },
  { id: 'MISSION-003', title: '쇼핑 횟수 줄이기', actionMethod: '월 4회 → 월 2회', status: '도전하기', expectedSavingAmount: 30_000 },
];

export const useHomeStore = defineStore('home', {
  state: () => ({
    dashboard: MOCK_DASHBOARD,
    missions: MOCK_MISSIONS,
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

        this.dashboard = toHomeDashboard(dashboardDto);
        this.missions = missionsDto.missions.map(toSavingMission);
      } catch {
        this.dashboard = MOCK_DASHBOARD;
        this.missions = MOCK_MISSIONS;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
