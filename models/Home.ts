import type { HomeDashboardResponseDto, SavingMissionDto } from '@/types/dto/home.dto';
import type { HomeDashboard, SavingMission } from '@/types/home';

const getCoupleNames = (dto: HomeDashboardResponseDto) => {
  const userName = dto.couple.user_name;
  const partnerName = dto.couple.partner_name ?? '';

  if (dto.couple.user_role === 'G') {
    return {
      groomName: userName,
      brideName: partnerName,
    };
  }

  return {
    groomName: partnerName,
    brideName: userName,
  };
};

export const toHomeDashboard = (dto: HomeDashboardResponseDto): HomeDashboard => ({
  coupleStatus: dto.couple.couple_status ?? 'DISCONNECTED',
  ...getCoupleNames(dto),
  totalAccumulatedAmount: dto.asset_summary?.total_saved_amount ?? 0,
  usedAmount: dto.asset_summary?.wedding_expense_amount ?? 0,
  remainingAmount: dto.asset_summary?.remaining_wedding_fund_amount ?? 0,
  savingAlert: {
    isShortage: dto.saving_alert?.alert_type === 'SHORTAGE',
    message: dto.saving_alert?.message ?? '',
  },
  totalMissionCount:
    (dto.saving_mission_summary?.in_progress_mission_count ?? 0) +
    (dto.saving_mission_summary?.completed_mission_count ?? 0),
  inProgressMissionCount: dto.saving_mission_summary?.in_progress_mission_count ?? 0,
  jointGoal: {
    targetAmount: dto.goal_summary?.joint_goal.target_amount ?? 0,
    currentAmount: dto.goal_summary?.joint_goal.current_amount ?? 0,
    achievementRate: dto.goal_summary?.joint_goal.achievement_rate ?? 0,
  },
  personalGoal: {
    targetAmount: dto.goal_summary?.personal_goal.target_amount ?? 0,
    currentAmount: dto.goal_summary?.personal_goal.current_amount ?? 0,
    achievementRate: dto.goal_summary?.personal_goal.achievement_rate ?? 0,
  },
});

export const toSavingMission = (dto: SavingMissionDto, index: number): SavingMission => ({
  id: String(dto.mission_id ?? dto.missionId ?? dto.mission_key ?? index),
  title: dto.mission_title ?? dto.title ?? dto.expense_category ?? '절약 미션',
  actionMethod: dto.action_method ?? dto.actionMethod ?? dto.title ?? '',
  status: dto.mission_status ?? dto.status ?? '도전하기',
  expectedSavingAmount: dto.expected_saving_amount ?? dto.expectedSavingAmount ?? 0,
});
