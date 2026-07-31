export interface SavingMission {
  id: string;
  title: string;
  actionMethod: string;
  status: string;
  expectedSavingAmount: number;
}

export interface BudgetGoal {
  targetAmount: number;
  currentAmount: number;
  achievementRate: number;
}

export interface HomeDashboard {
  coupleStatus: 'CONNECTED' | 'WAIT' | 'DISCONNECTED';
  groomName: string;
  brideName: string;
  totalAccumulatedAmount: number;
  usedAmount: number;
  remainingAmount: number;
  savingAlert: {
    isShortage: boolean;
    message: string;
  };
  totalMissionCount: number;
  inProgressMissionCount: number;
  jointGoal: BudgetGoal;
  personalGoal: BudgetGoal;
}
