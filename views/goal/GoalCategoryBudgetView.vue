<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getGoalCategoryStat } from '@/server/goalApi';
import GoalCategoryRangeChart from '@/components/goal/GoalCategoryRangeChart.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BUDGET_TYPES, GOAL_CATEGORIES } from '@/constants/goal';
import { useGoalStore } from '@/stores/goalStore';
import type { BudgetTypeCode, GoalCategoryCode, GoalCategoryStat } from '@/types/goal';
import { formatAmount } from '@/utils/format';

const props = defineProps<{
  categoryCode: GoalCategoryCode;
}>();

const router = useRouter();
const route = useRoute();
const goalStore = useGoalStore();

const isEditMode = computed(() => route.query.from === 'summary');

const categoryIndex = computed(() =>
  GOAL_CATEGORIES.findIndex((item) => item.code === props.categoryCode)
);
const category = computed(() => GOAL_CATEGORIES[categoryIndex.value]);
const step = computed(() => `${categoryIndex.value + 1}/${GOAL_CATEGORIES.length}`);

const amount = ref(goalStore.draft.items[props.categoryCode] ?? 0);

const amountInManwon = computed({
  get: () => amount.value / 10_000,
  set: (value: number) => {
    amount.value = Math.round(value * 10_000);
  },
});

const stat = ref<GoalCategoryStat | null>(null);
const statLoading = ref(false);

function amountForBudgetType(type: BudgetTypeCode, categoryStat: GoalCategoryStat) {
  if (type === 'saving') return categoryStat.lower10;
  if (type === 'flex') return categoryStat.upper10;
  return categoryStat.median;
}

// 한 번도 값을 저장한 적 없는 카테고리는 0이 아니라, 처음에 고른 예산 유형 기준값으로 채워둔다.
function applyDefaultAmount() {
  if (!stat.value) return;
  if (goalStore.draft.items[props.categoryCode] !== undefined) return;

  amount.value = amountForBudgetType(goalStore.draft.budgetType ?? 'balanced', stat.value);
}

async function loadStat() {
  if (!goalStore.draft.region) {
    stat.value = null;
    return;
  }

  statLoading.value = true;
  try {
    stat.value = await getGoalCategoryStat(goalStore.draft.region, category.value.label);
    applyDefaultAmount();
  } catch {
    stat.value = null;
  } finally {
    statLoading.value = false;
  }
}

onMounted(loadStat);

function saveCurrentAmount() {
  goalStore.setCategoryAmount(props.categoryCode, amount.value);
}

function goToCategory(code: GoalCategoryCode) {
  saveCurrentAmount();
  router.push({ name: 'goal-category-budget', params: { categoryCode: code } });
}

watch(
  () => props.categoryCode,
  () => {
    amount.value = goalStore.draft.items[props.categoryCode] ?? 0;
    loadStat();
  }
);

// 하위25 이하: 알뜰형 / 하위25 초과~상위25 미만: 균형형 / 상위25 이상: 플렉스형
const activeBudgetType = computed<BudgetTypeCode>(() => {
  if (!stat.value) return 'balanced';
  if (amount.value <= stat.value.lower25) return 'saving';
  if (amount.value >= stat.value.upper25) return 'flex';
  return 'balanced';
});

function selectBudgetType(code: BudgetTypeCode) {
  if (!stat.value) return;

  amount.value = amountForBudgetType(code, stat.value);
}

const cumulativeBudget = computed(() => {
  const others = Object.entries(goalStore.draft.items)
    .filter(([code]) => code !== props.categoryCode)
    .reduce((sum, [, value]) => sum + (value ?? 0), 0);

  return others + amount.value;
});

const nextCategory = computed(() => GOAL_CATEGORIES[categoryIndex.value + 1]);
const nextLabel = computed(() => {
  if (isEditMode.value) return '확인';
  return nextCategory.value ? '다음 항목 설정하기' : '예산 시안 완성하기';
});

function handleNext() {
  saveCurrentAmount();

  if (isEditMode.value) {
    router.push({ name: 'goal-summary' });
    return;
  }

  if (nextCategory.value) {
    router.push({
      name: 'goal-category-budget',
      params: { categoryCode: nextCategory.value.code },
    });
  } else {
    router.push({ name: 'goal-summary' });
  }
}

function handleExclude() {
  goalStore.excludeCategory(props.categoryCode);
  amount.value = 0;
  handleNext();
}
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex items-center justify-between">
      <p class="text-xs font-bold text-dm-mint-darker">{{ step }}</p>
      <Button
        type="button"
        variant="outline"
        class="h-7 rounded-full border-dm-gray/40 bg-dm-gray-light px-3 text-[11px] font-bold text-dm-gray-dark shadow-none hover:bg-dm-gray-light"
        @click="handleExclude"
      >
        이 항목 제외하기
      </Button>
    </div>

    <Tabs
      :model-value="categoryCode"
      class="w-full"
      @update:model-value="goToCategory($event as GoalCategoryCode)"
    >
      <TabsList
        class="h-auto w-full justify-start gap-0 rounded-none border-b border-dm-gray/20 bg-transparent p-0"
      >
        <TabsTrigger
          v-for="item in GOAL_CATEGORIES"
          :key="item.code"
          :value="item.code"
          class="flex-1 rounded-none border-b-2 border-transparent bg-transparent px-1 py-2 text-xs font-bold text-dm-gray-dark shadow-none data-[state=active]:border-dm-mint-darker data-[state=active]:bg-transparent data-[state=active]:text-dm-mint-darker data-[state=active]:shadow-none"
        >
          {{ item.label }}
        </TabsTrigger>
      </TabsList>
    </Tabs>

    <div class="mt-6 flex flex-col items-center text-center">
      <span class="text-4xl">{{ category.icon }}</span>
      <h1 class="mt-2 text-xl font-extrabold text-[#232631]">{{ category.label }}</h1>
      <p class="mt-1 text-sm text-dm-gray-dark">{{ category.description }}</p>
    </div>

    <form
      class="mt-6 flex flex-col gap-4"
      @submit.prevent="handleNext"
    >
      <div class="rounded-2xl border border-dm-gray/40 p-4">
        <Tabs
          :model-value="activeBudgetType"
          class="w-full"
          @update:model-value="selectBudgetType($event as BudgetTypeCode)"
        >
          <TabsList class="grid w-full grid-cols-3 bg-dm-gray-light">
            <TabsTrigger
              v-for="type in BUDGET_TYPES"
              :key="type.code"
              :value="type.code"
              class="text-dm-gray-dark data-[state=active]:text-dm-mint-darker"
            >
              {{ type.label }}{{ type.code === 'balanced' ? ' · 추천' : '' }}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <GoalCategoryRangeChart
          v-if="stat"
          :stat="stat"
          :value="amount"
          class="mt-4"
        />
        <p
          v-else-if="statLoading"
          class="mt-4 text-center text-xs text-dm-gray-dark"
        >
          지역별 시세를 불러오는 중이에요...
        </p>

        <div class="flex mx-auto items-center justify-center relative mt-4">
          <Input
            :id="`goal-amount-${categoryCode}`"
            :model-value="amountInManwon"
            aria-label="목표 금액"
            class="h-[56px] w-full rounded-xl border-dm-gray/40 pr-16 text-center text-2xl font-extrabold text-[#232631] shadow-none outline-none transition placeholder:font-medium placeholder:text-dm-gray hover:border-dm-gray/60 focus-visible:border-btn-pk focus-visible:ring-3 focus-visible:ring-btn-pk/10"
            type="number"
            min="0"
            inputmode="numeric"
            @update:model-value="amountInManwon = Number($event) || 0"
          />
          <span
            class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-dm-gray-dark"
          >
            만원
          </span>
        </div>
      </div>

      <div class="rounded-2xl bg-dm-rose-light p-4 text-center">
        <p class="text-xs font-bold text-dm-btn-pk">누적 결혼 예산</p>
        <p class="mt-1 text-2xl font-extrabold text-btn-pk-dark">
          {{ formatAmount(cumulativeBudget / 10_000) }} 만원
        </p>
      </div>

      <Button
        type="submit"
        class="h-[52px] w-full rounded-xl bg-btn-pk text-[15px] font-extrabold text-dm-gray-light shadow-none hover:bg-btn-pk-dark"
      >
        {{ nextLabel }}
      </Button>
    </form>

    <div
      class="mt-4 flex items-center gap-2 rounded-xl bg-dm-mint-light px-4 py-3 text-xs text-dm-mint-darker"
    >
      <span aria-hidden="true">ⓘ</span>
      <span>{{ category.tip }}</span>
    </div>
  </div>
</template>
