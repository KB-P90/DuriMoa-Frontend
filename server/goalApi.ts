import { api } from '@/server/axios.js';
import type { ApiResponse } from '@/types/common';
import type {
  GoalCategoryStat,
  GoalProposal,
  GoalSubmission,
  MainProposalDecision,
} from '@/types/goal';

export const getGoalCategoryStat = async (region: string, category: string) => {
  const { data } = await api.get<ApiResponse<GoalCategoryStat>>('/goal/stat', {
    params: { region, category },
  });
  return data.data;
};

export const getGoalProposals = async () => {
  const { data } = await api.get<ApiResponse<GoalProposal[]>>('/goal');
  return data.data;
};

export const postGoal = async (payload: GoalSubmission) => {
  const { data } = await api.post<ApiResponse<unknown>>('/goal', payload);
  return data.data;
};

export const updateGoal = async (goalId: number, payload: GoalSubmission) => {
  const { data } = await api.put<ApiResponse<unknown>>('/goal', payload, { params: { goalId } });
  return data.data;
};

// 메인 시안 승인 요청
export const requestMainProposal = async (goalId: number) => {
  const { data } = await api.patch<ApiResponse<unknown>>(`/goal/${goalId}/request`);
  return data.data;
};

// 메인 시안 승인 요청 취소 (요청자 본인)
export const cancelMainProposalRequest = async (goalId: number) => {
  const { data } = await api.patch<ApiResponse<unknown>>(`/goal/${goalId}/cancel`);
  return data.data;
};

// 메인 시안 승인 요청 응답 (요청자가 아닌 커플 상대방만 호출 가능)
export const decideMainProposalRequest = async (goalId: number, decision: MainProposalDecision) => {
  const { data } = await api.patch<ApiResponse<unknown>>(`/goal/${goalId}/decision`, { decision });
  return data.data;
};
