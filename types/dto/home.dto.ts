export interface HomeDashboardResponseDto {
  setup_completed: boolean;
  couple: {
    couple_id: number;
    user_id: number;
    user_name: string;
    user_role: 'G' | 'B';
    partner_user_id: number;
    partner_name: string;
    partner_role: 'G' | 'B';
    couple_status: 'CONNECTED' | 'WAIT' | 'DISCONNECTED';
    goal_id: number | null;
    wedding_date: string | null;
    remaining_months: number | null;
    budget_plan_id: number | null;
  };
  asset_summary: {
    total_budget_amount: number;
    total_saved_amount: number;
    wedding_expense_amount: number;
    remaining_wedding_fund_amount: number;
    base_date: string;
  };
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
  };
  goal_summary: {
    joint_goal: GoalSummaryDto;
    personal_goal: GoalSummaryDto;
  };
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
  target_amount: number;
  current_amount: number;
  achievement_rate: number;
  setup_required?: boolean;
}
