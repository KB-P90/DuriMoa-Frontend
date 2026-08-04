export interface HomeDashboardResponseDto {
  setup_completed?: boolean;
  couple: HomeCoupleDto;
  setup_checklist?: SetupChecklistDto | null;
  expected_budget_preview?: ExpectedBudgetPreviewDto | null;
  asset_summary: AssetSummaryDto | null;
  saving_alert: SavingAlertDto | null;
  saving_mission_summary: SavingMissionSummaryDto | null;
  goal_summary: HomeGoalSummaryDto | null;
}

export interface HomeCoupleDto {
  couple_id: number | null;
  user_id: number;
  user_name: string;
  user_role: 'G' | 'B';
  partner_user_id: number | null;
  partner_name: string | null;
  partner_role: 'G' | 'B' | null;
  couple_status: 'CONNECTED' | 'WAIT' | 'DISCONNECTED' | null;
  goal_id: number | null;
  wedding_date: string | null;
  remaining_months: number | null;
  budget_plan_id: number | null;
}

export interface SetupChecklistDto {
  total_count: number;
  completed_count: number;
  current_step: number | null;
  steps: SetupChecklistStepDto[];
}

export interface SetupChecklistStepDto {
  step: number;
  code: string;
  title: string;
  completed: boolean;
  status: 'CURRENT' | 'LOCKED' | 'COMPLETED' | string;
}

export interface ExpectedBudgetPreviewDto {
  budget_type: string;
  amount_basis: string;
  categories: string[];
  regions: ExpectedBudgetRegionDto[];
}

export interface ExpectedBudgetRegionDto {
  region: string;
  display_region: string;
  balanced_amount: number;
  rank: number;
}

export interface AssetSummaryDto {
  total_budget_amount: number | null;
  total_saved_amount: number | null;
  wedding_expense_amount: number | null;
  remaining_wedding_fund_amount: number | null;
  base_date: string | null;
}

export interface SavingAlertDto {
  alert_type: string | null;
  title: string | null;
  message: string | null;
  created_at: string | null;
}

export interface SavingMissionSummaryDto {
  total_expected_saving_amount: number;
  in_progress_mission_count: number;
  completed_mission_count: number;
  mission: SavingMissionDto | null;
  navigation_message: string;
}

export interface HomeGoalSummaryDto {
  joint_goal: GoalSummaryDto;
  personal_goal: GoalSummaryDto;
}

export interface SavingMissionDto {
  mission_id?: number;
  missionId?: number;
  mission_key?: string;
  user_id?: number;
  category_code?: string;
  categoryCode?: string;
  expense_category?: string;
  mission_title?: string;
  title?: string;
  action_method?: string;
  actionMethod?: string;
  expected_saving_amount?: number;
  expectedSavingAmount?: number;
  mission_status?: string;
  status?: string;
  is_selectable?: boolean;
  isSelectable?: boolean;
  created_at?: string;
}

export interface MonthlySavingMissionsResponseDto {
  year_month?: string;
  yearMonth?: string;
  total_expected_saving_amount?: number;
  totalExpectedSavingAmount?: number;
  missions: SavingMissionDto[];
}

export interface GoalSummaryDto {
  goal_id: number | null;
  user_id?: number;
  status: string | null;
  target_amount: number | null;
  current_amount: number | null;
  achievement_rate: number | null;
  setup_required: boolean | null;
}
