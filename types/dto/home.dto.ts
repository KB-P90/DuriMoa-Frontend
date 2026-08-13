export interface HomeDashboardResponseDto {
  setup_completed: boolean;
  couple: {
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
  };
  asset_summary: {
    total_budget_amount: number | null;
    total_saved_amount: number | null;
    wedding_expense_amount: number | null;
    remaining_wedding_fund_amount: number | null;
    base_date: string | null;
  } | null;
  saving_alert: {
    is_shortage: boolean;
    shortage_amount: number;
    remaining_days: number;
    message: string;
  } | null;
  saving_mission_summary: {
    total_expected_saving_amount: number;
    in_progress_mission_count: number;
    completed_mission_count: number;
    mission: SavingMissionDto | null;
    navigation_message: string;
  } | null;
  goal_summary: {
    joint_goal: GoalSummaryDto;
    personal_goal: GoalSummaryDto;
  } | null;
  setup_checklist: {
    total_count: number;
    completed_count: number;
    current_step: number | null;
    steps: SetupChecklistStepDto[];
  };
  expected_budget_preview: unknown | null;
}

export interface SetupChecklistStepDto {
  step: number;
  code: string;
  title: string;
  completed: boolean;
  status: string;
}

export interface SavingMissionDto {
  mission_id?: number;
  mission_key?: string;
  user_id?: number;
  category_code?: string;
  expense_category?: string;
  mission_title?: string;
  title?: string;
  action_method?: string;
  expected_saving_amount: number;
  mission_status?: string;
  status?: string;
  is_selectable?: boolean;
  created_at?: string;
}

export interface MonthlySavingMissionsResponseDto {
  year_month: string;
  total_expected_saving_amount: number;
  missions: SavingMissionDto[];
}

export interface GoalSummaryDto {
  goal_id?: number;
  user_id?: number;
  status?: string;
  target_amount: number | null;
  current_amount: number | null;
  achievement_rate: number | null;
  setup_required?: boolean;
}
