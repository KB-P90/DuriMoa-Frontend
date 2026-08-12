export interface CategoryProgress {
  goalItemId: number;
  category: string;
  targetAmount: number;
  currentAmount: number;
  progressRate: number | null;
  completed: boolean;
}

export interface OverallProgress {
  targetAmount: number;
  currentAmount: number;
  progressRate: number;
  completedItemCount: number;
  totalItemCount: number;
  items: CategoryProgress[];
}

export interface MemberProgress {
  userId: number;
  name: string;
  assetShared: boolean;
  assetAmount: number | null;
  targetAmount: number;
  currentAmount: number | null;
  progressRate: number;
}

export interface PersonalProgress {
  members: MemberProgress[];
}

export interface ProgressResponse {
  overall: OverallProgress;
  personal: PersonalProgress;
}

export interface MonthlyProgressItem {
  yearMonth: string;
  expenseAmount: number;
  cumulativeExpenseAmount: number;
  progressRate: number;
}

export interface MonthlyProgressResponse {
  overallProgressRate: number;
  months: MonthlyProgressItem[];
}

export interface ProgressCompletionResponse {
  goalItemId: number;
  completed: boolean;
  completedItemCount: number;
  totalItemCount: number;
}
