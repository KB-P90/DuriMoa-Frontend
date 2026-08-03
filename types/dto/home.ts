export interface CoupleMemberDto {
  user_id: number;
  name: string;
  profile_image: string | null;
}

export interface HomeDashboardResponseDto {
  couple: {
    id: number;
    groom: CoupleMemberDto;
    bride: CoupleMemberDto;
    status: 'CONNECTED' | 'WAIT' | 'DISCONNECTED';
  };
  asset_summary: {
    total_accumulated_amount: number;
    used_amount: number;
    remaining_amount: number;
  };
  saving_alert: {
    is_shortage: boolean;
    shortage_amount: number;
    remaining_days: number;
    message: string;
  };
  saving_mission_summary: {
    total_count: number;
    in_progress_count: number;
    mission: SavingMissionDto | null;
  };
  goal_summary: {
    joint_goal: GoalSummaryDto;
    personal_goal: GoalSummaryDto;
  };
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
  target_amount: number;
  current_amount: number;
  achievement_rate: number;
}
