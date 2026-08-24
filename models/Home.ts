import type { HomeDashboardResponseDto } from '@/types/dto/home.dto';
import type { HomeDashboard } from '@/types/home';

export const toHomeDashboard = (dto: HomeDashboardResponseDto): HomeDashboard => {
  const assetSummary = dto.asset_summary;
  const missionSummary = dto.saving_mission_summary;
  const jointGoal = dto.goal_summary?.joint_goal;
  const personalGoal = dto.goal_summary?.personal_goal;

  return {
    coupleStatus: dto.couple.couple_status ?? 'DISCONNECTED',
    userName: dto.couple.user_name,
    partnerName: dto.couple.partner_name ?? '',
    groomName:
      dto.couple.user_role === 'G' ? dto.couple.user_name : (dto.couple.partner_name ?? ''),
    brideName:
      dto.couple.user_role === 'B' ? dto.couple.user_name : (dto.couple.partner_name ?? ''),
    totalAccumulatedAmount: assetSummary?.total_saved_amount ?? 0,
    usedAmount: assetSummary?.wedding_expense_amount ?? 0,
    remainingAmount: assetSummary?.remaining_wedding_fund_amount ?? 0,
    savingAlert: dto.saving_alert
      ? {
          isShortage: dto.saving_alert.is_shortage,
          message: dto.saving_alert.message,
        }
      : null,
    totalMissionCount:
      (missionSummary?.in_progress_mission_count ?? 0) +
      (missionSummary?.completed_mission_count ?? 0),
    inProgressMissionCount: missionSummary?.in_progress_mission_count ?? 0,
    jointGoal: {
      targetAmount: jointGoal?.target_amount ?? 0,
      currentAmount: jointGoal?.current_amount ?? 0,
      achievementRate: jointGoal?.achievement_rate ?? 0,
    },
    personalGoal: {
      targetAmount: personalGoal?.target_amount ?? 0,
      currentAmount: personalGoal?.current_amount ?? 0,
      achievementRate: personalGoal?.achievement_rate ?? 0,
    },
    setupCompleted: dto.setup_completed,
    setupChecklist: {
      totalCount: dto.setup_checklist.total_count,
      completedCount: dto.setup_checklist.completed_count,
      currentStep: dto.setup_checklist.current_step,
      steps: dto.setup_checklist.steps.map((step) => ({
        step: step.step,
        code: step.code,
        title: step.title,
        completed: step.completed,
      })),
    },
  };
};
