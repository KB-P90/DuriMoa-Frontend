import type { HomeDashboardResponseDto, SavingMissionDto } from '@/types/dto/home';
import type { HomeDashboard, SavingMission } from '@/types/home';

export const toHomeDashboard = (dto: HomeDashboardResponseDto): HomeDashboard => ({
  coupleStatus: dto.couple.status,
  groomName: dto.couple.groom.name,
  brideName: dto.couple.bride.name,
  totalAccumulatedAmount: dto.asset_summary.total_accumulated_amount,
  usedAmount: dto.asset_summary.used_amount,
  remainingAmount: dto.asset_summary.remaining_amount,
  savingAlert: {
    isShortage: dto.saving_alert.is_shortage,
    message: dto.saving_alert.message,
  },
  totalMissionCount: dto.saving_mission_summary.total_count,
  inProgressMissionCount: dto.saving_mission_summary.in_progress_count,
  jointGoal: {
    targetAmount: dto.goal_summary.joint_goal.target_amount,
    currentAmount: dto.goal_summary.joint_goal.current_amount,
    achievementRate: dto.goal_summary.joint_goal.achievement_rate,
  },
  personalGoal: {
    targetAmount: dto.goal_summary.personal_goal.target_amount,
    currentAmount: dto.goal_summary.personal_goal.current_amount,
    achievementRate: dto.goal_summary.personal_goal.achievement_rate,
  },
});

export const toSavingMission = (dto: SavingMissionDto, index: number): SavingMission => ({
  id: String(dto.mission_id ?? dto.mission_key ?? index),
  title: dto.mission_title ?? dto.title ?? dto.expense_category ?? '절약 미션',
  actionMethod: dto.action_method ?? dto.title ?? '',
  status: dto.mission_status ?? dto.status ?? '도전하기',
  expectedSavingAmount: dto.expected_saving_amount,
});
