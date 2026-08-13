<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

import { getGoalCategoryStat, getGoalProposals } from '@/server/goalApi';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import PageHeader from '@/components/common/PageHeader.vue';
import { BUDGET_TYPES, GOAL_CATEGORIES } from '@/constants/goal';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useGoalStore } from '@/stores/goalStore';
import type { BudgetTypeCode, GoalCategoryCode, GoalCategoryStat } from '@/types/goal';
import { formatSignedAmount, formatWon } from '@/utils/format';

const props = defineProps<{ goalId?: string }>();

useAuthCheck();

const router = useRouter();
const goalStore = useGoalStore();

const isEditing = computed(() => goalStore.editingGoalId !== null);

const goalName = computed({
  get: () => goalStore.draft.name ?? '',
  set: (value: string) => {
    goalStore.draft.name = value;
  },
});

// GoalBudgetTypeView와 동일한 목업 표. GET /api/goal/stat이 전국 평균까지 함께
// 내려주게 되면 그쪽 응답으로 교체한다.
const NATIONAL_AVERAGE: Record<BudgetTypeCode, number> = {
  saving: 5418,
  balanced: 6120,
  flex: 7450,
};

// 자산/저축 가능액은 마이페이지·홈 도메인 데이터가 필요해서 아직 목업.
const CURRENT_ASSET = 3119;
const AVAILABLE_MONTHLY = 180;

// 예식장 / 스튜디오·드레스·메이크업 / 예비비 3개 그룹으로 묶어서 예산 비중 막대를 그린다.
const CATEGORY_BUDGET_GROUPS: { codes: GoalCategoryCode[]; colorClass: string }[] = [
  { codes: ['venue'], colorClass: 'bg-pink-03' },
  { codes: ['studio', 'dress', 'makeup'], colorClass: 'bg-brand-dark' },
  { codes: ['reserve'], colorClass: 'bg-pink-04' },
];

const totalManwon = computed(() => Math.round(goalStore.totalBudget / 10_000));
const nationalAverage = computed(() => NATIONAL_AVERAGE[goalStore.draft.budgetType ?? 'balanced']);

const brideRatio = computed(() => 100 - goalStore.draft.groomRatio);
const groomAmount = computed(() =>
  Math.round((goalStore.totalBudget * goalStore.draft.groomRatio) / 100)
);
const brideAmount = computed(() => goalStore.totalBudget - groomAmount.value);

function handleRatioChange(value: number[] | undefined) {
  if (value?.[0] === undefined) return;
  goalStore.setGroomRatio(value[0]);
}
const totalDiff = computed(() => nationalAverage.value - totalManwon.value);

const remainingMonths = computed(() => {
  if (!goalStore.draft.weddingDate) return null;

  const today = new Date();
  const target = new Date(goalStore.draft.weddingDate);
  const months =
    (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());

  return Math.max(months, 1);
});
const requiredMonthly = computed(() =>
  remainingMonths.value
    ? Math.max(Math.round((totalManwon.value - CURRENT_ASSET) / remainingMonths.value), 0)
    : null
);

const categorySegments = computed(() =>
  CATEGORY_BUDGET_GROUPS.map((group) => {
    const amount = group.codes.reduce((sum, code) => sum + (goalStore.draft.items[code] ?? 0), 0);
    const percent = goalStore.totalBudget > 0 ? (amount / goalStore.totalBudget) * 100 : 0;
    return { key: group.codes.join('-'), percent, colorClass: group.colorClass };
  })
);

// 카테고리별 하위25/상위25 구간을 알아야 알뜰형/균형형/플렉스형 배지를 매길 수 있어서,
// 화면 진입 시 6개 카테고리 시세를 한 번에 불러온다.
const categoryStats = ref<Partial<Record<GoalCategoryCode, GoalCategoryStat>>>({});

// 목록 카드를 눌러 들어오면 goalStore.draft가 이미 채워져 있지만, URL로 바로 들어오거나
// 새로고침한 경우엔 draft가 비어있으므로 목록을 다시 불러와 채운다.
async function ensureDraftForEditing() {
  if (!props.goalId || goalStore.editingGoalId === Number(props.goalId)) return;

  try {
    const proposals = await getGoalProposals();
    const goal = proposals.find((item) => item.goalId === Number(props.goalId));
    if (goal) goalStore.loadFromProposal(goal);
  } catch {
    // 무시: 실패해도 화면은 빈 draft로 렌더링될 뿐 깨지지 않는다.
  }
}

onMounted(async () => {
  await ensureDraftForEditing();

  // 새로 만드는 흐름에서는 시안 이름을 아직 안 정했을 테니, 이름 입력창에 기본값을 채워둔다.
  if (!isEditing.value && !goalStore.draft.name) {
    goalStore.draft.name = goalStore.defaultName;
  }

  if (!goalStore.draft.region) return;

  const results = await Promise.all(
    GOAL_CATEGORIES.map(async (category) => {
      try {
        return [
          category.code,
          await getGoalCategoryStat(goalStore.draft.region!, category.label),
        ] as const;
      } catch {
        return [category.code, null] as const;
      }
    })
  );

  for (const [code, stat] of results) {
    if (stat) categoryStats.value[code] = stat;
  }
});

function budgetTypeFor(code: GoalCategoryCode): BudgetTypeCode {
  const stat = categoryStats.value[code];
  const amount = goalStore.draft.items[code] ?? 0;

  if (stat) {
    if (amount <= stat.lower25) return 'saving';
    if (amount >= stat.upper25) return 'flex';
  }

  return 'balanced';
}

// 예비비는 사용자가 임의로 정하는 금액이라 알뜰형/균형형/플렉스형 구분을 두지 않는다.
function budgetTypeLabelFor(code: GoalCategoryCode) {
  if (code === 'reserve') return '';
  return BUDGET_TYPES.find((budgetType) => budgetType.code === budgetTypeFor(code))?.label ?? '-';
}

// 알뜰형/균형형/플렉스형 배지 색을 dm-mint 팔레트 농도로 구분한다.
const BUDGET_TYPE_BADGE_CLASS: Record<BudgetTypeCode, string> = {
  saving: 'bg-dm-mint text-dm-mint-darker',
  balanced: 'bg-dm-mint-dark text-white',
  flex: 'bg-dm-mint-darker text-white',
};

function budgetTypeBadgeClass(code: GoalCategoryCode) {
  return BUDGET_TYPE_BADGE_CLASS[budgetTypeFor(code)];
}

function diffFor(code: GoalCategoryCode) {
  const stat = categoryStats.value[code];
  if (!stat) return 0;

  const amount = goalStore.draft.items[code] ?? 0;
  return Math.round((amount - stat.median) / 10_000);
}

function editCategory(code: GoalCategoryCode) {
  router.push({
    name: 'goal-category-budget',
    params: { categoryCode: code },
    query: { from: 'summary' },
  });
}

const submitting = ref(false);

const submitLabel = computed(() => {
  if (submitting.value) return '저장 중이에요...';
  return isEditing.value ? '수정 내용 저장하기' : '예산 시안 저장하고 파트너에게 공유';
});

async function handleShare() {
  const categoryTypeLabels = Object.fromEntries(
    GOAL_CATEGORIES.map((category) => [category.code, budgetTypeLabelFor(category.code)])
  );

  submitting.value = true;
  try {
    await goalStore.submitGoal(categoryTypeLabels);
    toast.success(isEditing.value ? '시안을 수정했어요.' : '예산 시안을 저장했어요.');
    goalStore.reset();
    router.push({ name: 'goal-list' });
  } catch {
    toast.error('저장에 실패했어요. 다시 시도해주세요.');
  } finally {
    submitting.value = false;
  }
}

const deleteDialogOpen = ref(false);

function openDeleteDialog() {
  deleteDialogOpen.value = true;
}

// AlertDialogAction은 클릭 시 응답을 기다리지 않고 모달을 바로 닫기 때문에,
// 삭제 성공/실패 결과는 토스트로 알려준다.
async function confirmDelete() {
  try {
    await goalStore.deleteEditingGoal();
    toast.success('시안을 삭제했어요.');
    router.push({ name: 'goal-list' });
  } catch {
    toast.error('삭제에 실패했어요. 다시 시도해주세요.');
  }
}
</script>

<template>
  <PageHeader
    title="결혼 예상 시안"
    :showBack="true"
  />
  <div class="p-4 pb-[calc(9rem+env(safe-area-inset-bottom))]">
    <div class="mt-6 mb-6 text-center">
      <h1 class="text-lg font-extrabold text-[#232631]">
        {{ isEditing ? '예산 시안을 수정하고 있어요' : '예산 시안이 완성됐어요' }}
      </h1>

      <div class="mx-auto mt-3 w-[220px]">
        <label
          for="goal-name"
          class="sr-only"
        >
          시안 이름
        </label>
        <Input
          id="goal-name"
          v-model="goalName"
          maxlength="12"
          placeholder="시안 이름을 입력하세요"
          class="h-9 rounded-lg border-dm-gray/40 text-center text-sm font-medium text-[#232631] shadow-none focus-visible:border-pink-03 focus-visible:ring-3 focus-visible:ring-brand/10"
        />
        <p
          v-if="goalName.length >= 12"
          class="mt-1 text-[11px] font-semibold text-destructive"
        >
          시안 이름은 최대 12자까지 입력할 수 있어요.
        </p>
      </div>
    </div>

    <div class="rounded-2xl bg-pink-01 p-5 text-center">
      <p class="text-xs font-bold text-brand-dark">우리의 결혼 예산</p>
      <p class="mt-2 flex items-end justify-center gap-1">
        <span class="text-4xl font-extrabold text-brand-dark">{{
          totalManwon.toLocaleString()
        }}</span>
        <span class="mb-1 text-sm font-bold text-brand-dark">만원</span>
      </p>
      <p class="mt-2 text-xs text-dm-gray-dark">
        전국 평균 {{ nationalAverage.toLocaleString() }}만원보다 {{ Math.abs(totalDiff) }}만원
        {{ totalDiff >= 0 ? '낮아요' : '높아요' }}
      </p>

      <div class="mt-4 flex h-2 w-full overflow-hidden rounded-full">
        <div
          v-for="segment in categorySegments"
          :key="segment.key"
          class="h-full"
          :class="segment.colorClass"
          :style="{ width: `${segment.percent}%` }"
        />
      </div>
    </div>

    <div class="mt-4 divide-y divide-dm-gray/10 rounded-2xl border border-dm-gray/40 px-4">
      <button
        v-for="category in GOAL_CATEGORIES"
        :key="category.code"
        type="button"
        class="flex w-full items-center justify-between py-3 text-left"
        @click="editCategory(category.code)"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ category.icon }}</span>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-bold text-[#232631]">{{ category.label }}</span>
              <span
                v-if="category.code !== 'reserve'"
                class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                :class="budgetTypeBadgeClass(category.code)"
              >
                {{ budgetTypeLabelFor(category.code) }}
              </span>
            </div>
            <p class="mt-0.5 text-[11px] text-dm-gray-dark">
              평균 대비 {{ formatSignedAmount(diffFor(category.code)) }}만원
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <span class="text-base font-extrabold text-[#232631]">
            {{ formatWon(goalStore.draft.items[category.code] ?? 0) }}
          </span>
          <ChevronRight class="h-4 w-4 text-dm-gray" />
        </div>
      </button>

      <div class="flex items-center justify-between py-3">
        <span class="text-sm font-bold text-dm-gray-dark">합계</span>
        <span class="text-base font-extrabold text-brand-dark">{{
          formatWon(goalStore.totalBudget)
        }}</span>
      </div>
    </div>

    <div class="mt-4 rounded-2xl border border-dm-gray/40 p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-bold text-[#232631]">부부간 분담 비율</span>
        <span class="text-[11px] font-semibold text-dm-gray-dark">직접 설정 · 합계 100%</span>
      </div>

      <div class="mt-4 flex items-center justify-between text-xs font-bold">
        <span class="text-dm-mint-darker">🤵 신랑 {{ goalStore.draft.groomRatio }}%</span>
        <span class="text-brand-dark">{{ brideRatio }}% 신부 👰</span>
      </div>

      <!--
        shadcn Slider는 Track/Range/Thumb 색을 전부 --primary 토큰으로 고정해두고
        하위 요소별 class prop은 안 열어놔서, Slider.vue 자체를 고치는 대신
        여기서만 --primary를 덮어써서 브랜드 색(민트)이 나오게 한다.
      -->
      <div
        class="mt-2"
        style="--primary: #15aea9"
      >
        <Slider
          :model-value="[goalStore.draft.groomRatio]"
          :min="0"
          :max="100"
          :step="1"
          @update:model-value="handleRatioChange"
        />
      </div>

      <div class="mt-4 grid grid-cols-2 gap-2">
        <div class="rounded-xl bg-dm-mint-light p-3 text-center">
          <p class="text-[11px] text-dm-gray-dark">신랑 분담금</p>
          <p class="mt-1 text-base font-extrabold text-dm-mint-darker">
            {{ formatWon(groomAmount) }}
          </p>
        </div>
        <div class="rounded-xl bg-pink-01 p-3 text-center">
          <p class="text-[11px] text-dm-gray-dark">신부 분담금</p>
          <p class="mt-1 text-base font-extrabold text-brand-dark">{{ formatWon(brideAmount) }}</p>
        </div>
      </div>

      <p class="mt-3 text-center text-[11px] text-dm-gray-dark">
        슬라이더를 움직이면 두 사람의 분담금이 바로 계산돼요.
      </p>
    </div>

    <div class="mt-4 flex gap-2 rounded-xl bg-dm-mint-light p-4">
      <span aria-hidden="true">⚠️</span>
      <p class="text-xs leading-5 text-[#232631]">
        <template v-if="requiredMonthly !== null">
          현재 자산 {{ CURRENT_ASSET.toLocaleString() }}만원 · 남은 {{ remainingMonths }}개월 기준
          월 {{ requiredMonthly.toLocaleString() }}만원을 모아야 해요. 지금 저축 가능액(월
          {{ AVAILABLE_MONTHLY.toLocaleString() }}만원)보다
          {{ requiredMonthly > AVAILABLE_MONTHLY ? '많아요' : '적어요' }}.
        </template>
        <template v-else>결혼 예정일을 입력하면 필요 저축액을 계산해드려요.</template>
      </p>
    </div>

    <p class="mt-3 text-[11px] text-dm-gray-dark">
      지역 평균 출처 · 2025년 결혼 비용 통계 (기준연도 2025 · 갱신 2026.06.30)
    </p>

    <div
      class="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[768px] flex-col gap-2 border-t border-dm-gray/15 bg-white px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]"
    >
      <Button
        type="button"
        :disabled="submitting"
        class="h-[52px] w-full rounded-xl bg-brand text-[15px] font-extrabold text-dm-gray-light shadow-none hover:bg-brand-dark"
        @click="handleShare"
      >
        {{ submitLabel }}
      </Button>

      <Button
        v-if="isEditing"
        type="button"
        variant="outline"
        class="h-[52px] w-full rounded-xl border-dm-mint-dark/60 bg-dm-mint-dark text-[15px] font-extrabold text-white shadow-none hover:bg-dm-mint-darker hover:text-white"
        @click="openDeleteDialog"
      >
        시안 삭제
      </Button>
    </div>

    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <template v-if="goalStore.editingGoalIsMain">
          <AlertDialogHeader>
            <AlertDialogTitle>삭제할 수 없어요</AlertDialogTitle>
            <AlertDialogDescription>
              메인 시안은 다른 시안으로 변경해야만 삭제할 수 있어요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter class="flex-row">
            <AlertDialogAction class="h-12 w-full rounded-xl bg-brand hover:bg-brand-dark">
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </template>

        <template v-else>
          <AlertDialogHeader>
            <AlertDialogTitle>시안을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>삭제하면 되돌릴 수 없어요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter class="flex-row gap-2">
            <AlertDialogCancel class="h-12 flex-1 rounded-xl"> 취소 </AlertDialogCancel>
            <AlertDialogAction
              class="h-12 flex-1 rounded-xl bg-brand text-white hover:bg-brand-dark"
              @click="confirmDelete"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </template>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
