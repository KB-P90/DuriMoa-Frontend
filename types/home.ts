export interface BudgetGoal {
  targetAmount: number;
  currentAmount: number;
  achievementRate: number;
}

export interface SetupChecklistStep {
  step: number;
  code: string;
  title: string;
  completed: boolean;
}

export interface SetupChecklist {
  totalCount: number;
  completedCount: number;
  currentStep: number | null;
  steps: SetupChecklistStep[];
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
  } | null;
  totalMissionCount: number;
  inProgressMissionCount: number;
  jointGoal: BudgetGoal;
  personalGoal: BudgetGoal;
  setupCompleted: boolean;
  setupChecklist: SetupChecklist;
}
