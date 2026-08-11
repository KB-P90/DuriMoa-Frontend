import type { HomeDashboardResponseDto, SavingMissionDto } from '@/types/dto/home.dto';
import type { HomeDashboard, SavingMission } from '@/types/home';

export const toHomeDashboard = (dto: HomeDashboardResponseDto): HomeDashboard => ({
  coupleStatus: dto.couple.couple_status,
  groomName: dto.couple.user_role === 'G' ? dto.couple.user_name : dto.couple.partner_name,
  brideName: dto.couple.user_role === 'B' ? dto.couple.user_name : dto.couple.partner_name,
  totalAccumulatedAmount: dto.asset_summary.total_saved_amount,
  usedAmount: dto.asset_summary.wedding_expense_amount,
  remainingAmount: dto.asset_summary.remaining_wedding_fund_amount,
  savingAlert: dto.saving_alert
    ? {
        isShortage: dto.saving_alert.is_shortage,
        message: dto.saving_alert.message,
      }
    : null,
  totalMissionCount:
    dto.saving_mission_summary.in_progress_mission_count +
    dto.saving_mission_summary.completed_mission_count,
  inProgressMissionCount: dto.saving_mission_summary.in_progress_mission_count,
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
});

export const toSavingMission = (dto: SavingMissionDto, index: number): SavingMission => ({
  id: String(dto.mission_id ?? dto.mission_key ?? index),
  title: dto.mission_title ?? dto.title ?? dto.expense_category ?? '절약 미션',
  actionMethod: dto.action_method ?? dto.title ?? '',
  status: dto.mission_status ?? dto.status ?? '도전하기',
  expectedSavingAmount: dto.expected_saving_amount,
});
