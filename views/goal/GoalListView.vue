<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

import BudgetProposalCard from '@/components/goal/BudgetProposalCard.vue';
import MainProposalDialog from '@/components/goal/MainProposalDialog.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { Separator } from '@/components/ui/separator';
import { useAuthCheck } from '@/composables/useAuthCheck';
import {
  cancelMainProposalRequest,
  decideMainProposalRequest,
  getGoalProposals,
  requestMainProposal,
} from '@/server/goalApi';
import { useGoalStore } from '@/stores/goalStore';
import type {
  BudgetProposalStatus,
  GoalProposal,
  MainProposalRequest,
  ProposalCardItem,
} from '@/types/goal';
import { formatDateDot } from '@/utils/format';
import Button from '@/components/ui/button/Button.vue';

useAuthCheck();

const router = useRouter();
const goalStore = useGoalStore();

const proposals = ref<GoalProposal[]>([]);

// 자산 데이터는 마이페이지 도메인이 필요해서 GoalSummaryView와 동일한 값으로 목업.
const CURRENT_ASSET = 3119;

function remainingMonthsUntil(weddingDate: string) {
  const today = new Date();
  const target = new Date(weddingDate);
  const months =
    (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
  return Math.max(months, 1);
}

function requiredMonthly(totalBudgetWon: number, weddingDate: string) {
  const totalManwon = Math.round(totalBudgetWon / 10_000);
  return Math.max(Math.round((totalManwon - CURRENT_ASSET) / remainingMonthsUntil(weddingDate)), 0);
}

function resolveStatus(goal: GoalProposal): BudgetProposalStatus {
  if (goal.isMain) return 'main';
  if (goal.status !== 'NORMAL') return goal.requestedByMe ? 'pending' : 'incoming';
  return 'general';
}

// 메인 시안을 맨 위에 고정하고, 나머지는 최신순(생성일 내림차순)으로 정렬한다.
function compareProposals(a: GoalProposal, b: GoalProposal) {
  if (a.isMain !== b.isMain) return a.isMain ? -1 : 1;
  return a.createdAt < b.createdAt ? 1 : -1;
}

const cardItems = computed<ProposalCardItem[]>(() =>
  [...proposals.value].sort(compareProposals).map((goal) => ({
    id: goal.goalId,
    title: goal.name,
    createdAt: formatDateDot(goal.createdAt),
    amount: Math.round(goal.totalBudget / 10_000),
    status: resolveStatus(goal),
  }))
);

const mainProposal = computed(() => proposals.value.find((goal) => goal.isMain) ?? null);

async function loadProposals() {
  try {
    proposals.value = await getGoalProposals();
  } catch {
    proposals.value = [];
  }
}

onMounted(loadProposals);

const dialogOpen = ref(false);
const dialogMode = ref<'request' | 'accept'>('request');
const activeGoalId = ref<number | null>(null);
const activeRequest = ref<MainProposalRequest | null>(null);

function openRequestDialog(goalId: number) {
  activeGoalId.value = goalId;
  dialogMode.value = 'request';
  activeRequest.value = null;
  dialogOpen.value = true;
}

function openAcceptDialog(goalId: number) {
  const goal = proposals.value.find((item) => item.goalId === goalId);
  if (!goal || !mainProposal.value) return;

  activeGoalId.value = goalId;
  dialogMode.value = 'accept';
  activeRequest.value = {
    proposerName: '상대방',
    proposal: { title: goal.name, amount: Math.round(goal.totalBudget / 10_000) },
    diffFromCurrentMain: Math.round((goal.totalBudget - mainProposal.value.totalBudget) / 10_000),
    monthlySaving: {
      before: requiredMonthly(mainProposal.value.totalBudget, mainProposal.value.weddingDate),
      after: requiredMonthly(goal.totalBudget, goal.weddingDate),
    },
  };
  dialogOpen.value = true;
}

// 신청 취소는 별도 확인 모달 없이 바로 처리한다 (디자인에 확인 모달 없음).
async function cancelRequest(goalId: number) {
  try {
    await cancelMainProposalRequest(goalId);
    await loadProposals();
    toast.success('신청을 취소했어요.');
  } catch {
    toast.error('요청 취소에 실패했어요. 다시 시도해주세요.');
  }
}

// AlertDialogAction/Cancel은 클릭하면 API 응답을 기다리지 않고 모달을 바로 닫기 때문에,
// 성공/실패 결과는 (이미 닫힌) 모달 안이 아니라 토스트로 알려준다.
async function handleDialogConfirm() {
  if (activeGoalId.value === null) return;

  try {
    if (dialogMode.value === 'request') {
      await requestMainProposal(activeGoalId.value);
      toast.success('메인 시안 신청을 보냈어요.');
    } else {
      await decideMainProposalRequest(activeGoalId.value, 'APPROVE');
      toast.success('메인 시안으로 확정했어요.');
    }
    await loadProposals();
  } catch {
    toast.error('요청 처리에 실패했어요. 다시 시도해주세요.');
  }
}

async function handleDialogCancel() {
  // 신청 확인 모달의 '취소'는 아직 아무것도 보내지 않은 상태라 별도 처리가 필요 없다.
  if (dialogMode.value !== 'accept' || activeGoalId.value === null) return;

  try {
    await decideMainProposalRequest(activeGoalId.value, 'REJECT');
    await loadProposals();
    toast.success('요청을 거절했어요.');
  } catch {
    toast.error('요청 처리에 실패했어요. 다시 시도해주세요.');
  }
}

function openProposalDetail(goalId: number) {
  const goal = proposals.value.find((item) => item.goalId === goalId);
  if (!goal) return;

  goalStore.loadFromProposal(goal);
  router.push({ name: 'goal-summary', params: { goalId: String(goalId) } });
}

function handleNewProposal() {
  goalStore.reset();
  router.push({ name: 'goal-schedule' });
}
</script>

<template>
  <div>
    <PageHeader title="예산 시안" />
    <Separator />

    <div class="p-4">
      <div class="flex flex-row justify-between items-center">
        <h2 class="text-base font-bold text-gray-900">우리의 예산 시안</h2>

        <Button
          class="cursor-pointer rounded-lg text-sm font-semibold text-brand border border-pink-05 text-pink-05 h-[30px] shadow-none"
          @click="handleNewProposal"
        >
          + 새 시안
        </Button>
      </div>
      <p class="mt-2 text-sm leading-5 text-dm-gray-dark">
        신청 버튼을 누르면 메인 시안 요청이 상대에게 전송돼요.<br />
        상대가 승인하면 메인 시안으로 최종 확정돼요.
      </p>

      <div class="mt-5 flex flex-col gap-4">
        <BudgetProposalCard
          v-for="proposal in cardItems"
          :key="proposal.id"
          :proposal="proposal"
          @open="openProposalDetail"
          @apply="openRequestDialog"
          @cancel="cancelRequest"
          @review="openAcceptDialog"
        />
      </div>
    </div>

    <MainProposalDialog
      v-model:open="dialogOpen"
      :mode="dialogMode"
      :request="activeRequest"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogCancel"
    />
  </div>
</template>
