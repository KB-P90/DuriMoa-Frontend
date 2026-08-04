export interface CategoryStatus {
  goalItemId: number;
  category: string;
  targetAmount: number;
  currentAmount: number;
  progressRate: number | null;
  completed: boolean;
}

export interface OverallStatus {
  targetAmount: number;
  currentAmount: number;
  progressRate: number;
  completedItemCount: number;
  totalItemCount: number;
  items: CategoryStatus[];
}

export interface MemberStatus {
  userId: number;
  name: string;
  assetShared: boolean;
  assetAmount: number | null;
  targetAmount: number;
  currentAmount: number | null;
  progressRate: number;
}

export interface PersonalStatus {
  members: MemberStatus[];
}

export interface MonthlyProgressItem {
  yearMonth: string;
  expenseAmount: number;
  cumulativeExpenseAmount: number;
  progressRate: number;
}

export interface MonthlyProgress {
  overallProgressRate: number;
  months: MonthlyProgressItem[];
}

export interface ProgressStatusResponse {
  overall: OverallStatus;
  personal: PersonalStatus;
  monthlyProgress: MonthlyProgress;
}
