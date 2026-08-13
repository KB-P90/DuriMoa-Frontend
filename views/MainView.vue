<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { Bell, BellDot, ChevronRight, Coffee } from '@lucide/vue';
import HeroThermometer from '@/components/home/HeroThermometer.vue';
import HomeChecklistCard from '@/components/home/HomeChecklistCard.vue';
import HomeBudgetPreview from '@/components/home/HomeBudgetPreview.vue';
import HomeUsageTips from '@/components/home/HomeUsageTips.vue';
import HomeQuickMenu from '@/components/home/HomeQuickMenu.vue';
import { useHomeStore } from '@/stores/homeStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { formatWon } from '@/utils/format';
import { isAccessTokenValid } from '@/utils/auth';

const homeStore = useHomeStore();
const { dashboard, missions } = storeToRefs(homeStore);
const notificationStore = useNotificationStore();

// 로그인 직후 토큰이 바뀌는 경우는 라우팅으로 이 화면에 다시 진입하니, 진입 시 1회 판정이면 충분하다.
const isLoggedIn = isAccessTokenValid();

const missionCarousel = ref<HTMLElement | null>(null);
const dragStartX = ref<number | null>(null);
const dragStartScrollLeft = ref(0);
const missionActiveIndex = ref(0);

// 두리모아 체크리스트 3단계. code는 백엔드 setup_checklist.steps의 code와 매칭된다.
const STEP_DEFS = [
  {
    label: '계좌 연결',
    code: 'ACCOUNT_LINKED',
    ctaLabel: '계좌 연결하기',
    to: { name: 'onboarding', query: { screen: 'account' } },
  },
  {
    label: '커플 연결',
    code: 'COUPLE_CONNECTED',
    ctaLabel: '커플 연결 시작하기',
    to: { name: 'onboarding', query: { screen: 'couple' } },
  },
  {
    label: '결혼 목표',
    code: 'WEDDING_GOAL_CREATED',
    ctaLabel: '결혼 목표 설정하기',
    to: { name: 'goal-schedule' },
  },
] as const;

const stepLabels = STEP_DEFS.map((step) => step.label);

const ONBOARDING_TIPS = [
  {
    label: 'TIP · 1/3',
    title: '함께 목표를 세우면\n저축이 쉬워져요',
    description: '예식·신혼집·예물 목표를 정하고 둘이서 진행률을 확인해요.',
    actionLabel: '우리 목표 세우러 가기',
    to: { name: 'goal-schedule' },
  },
  {
    label: 'TIP · 2/3',
    title: '캘린더에 지출을 기록하면\n절약 미션이 생겨요',
    description: '하루 지출을 기록할수록 우리에게 맞는 절약 미션을 추천해드려요.',
    actionLabel: '캘린더 보러 가기',
    to: { name: 'calendar' },
  },
  {
    label: 'TIP · 3/3',
    title: '카드 추천으로\n혜택을 챙겨보세요',
    description: '결혼 준비에 도움이 되는 카드 혜택을 비교해드려요.',
    actionLabel: '카드 추천 보러 가기',
    to: { name: 'card' },
  },
];

// 온보딩 완료 후 "우리의 목표" 자리에 보여주는 추천 카드. 달성률은 이미 상단 온도계에서 보여주므로 중복 대신 다음 행동을 제안한다.
const RECOMMENDATION_TIPS = [
  {
    label: 'TIP · 1/2',
    title: '이번 달 카드 혜택을\n놓치지 마세요',
    description: '다음 결제에 딱 맞는 카드를 추천해드려요.',
    actionLabel: '카드 추천 보러 가기',
    to: { name: 'card' },
    cardClass: 'bg-dm-mint-darker',
    ctaTextClass: 'text-dm-mint-darker',
  },
  {
    label: 'TIP · 2/2',
    title: '서로의 지출을 보고\n한마디 남겨보세요',
    description: '상대방의 지출 내역에 짧은 응원과 피드백을 남길 수 있어요.',
    actionLabel: '지출 확인하러 가기',
    to: { name: 'expense' },
    cardClass: 'bg-pink-06',
    ctaTextClass: 'text-pink-06',
  },
];

// 백엔드 current_step은 1부터 시작하는 첫 미완료 단계이며, 전체 완료 시 null이다.
const currentStepIndex = computed(() => {
  const currentStep = dashboard.value.setupChecklist.currentStep;

  if (currentStep === null) {
    return dashboard.value.setupCompleted ? -1 : 0;
  }

  const currentIndex = currentStep - 1;
  return currentIndex >= 0 && currentIndex < STEP_DEFS.length ? currentIndex : 0;
});

const isOnboardingComplete = computed(() => isLoggedIn && dashboard.value.setupCompleted);

const heroCtaLabel = computed(() => {
  if (!isLoggedIn) return '로그인 하기';
  if (currentStepIndex.value === -1) return '확인';
  return STEP_DEFS[currentStepIndex.value].ctaLabel;
});

const heroCtaTo = computed(() => {
  if (!isLoggedIn) return { name: 'login' };
  if (currentStepIndex.value === -1) return { name: 'progress' };
  return STEP_DEFS[currentStepIndex.value].to;
});

// 체크 표시는 홈 API가 알려준 현재 단계에 맞춰 이동한다.
const checklistActiveIndex = computed(() => (isLoggedIn ? Math.max(currentStepIndex.value, 0) : 0));
const checklistSettingsTo = computed(() => heroCtaTo.value ?? { name: 'goal-list' });

// 비로그인이거나 홈 API의 현재 단계가 1~3단계면 예산 미리보기를 보여준다.
const showBudgetPreview = computed(
  () => !isLoggedIn || (currentStepIndex.value >= 0 && currentStepIndex.value < 3)
);

// 로그인 전에는 실제 달성률이 없어 장식용 고정값을 보여준다.
const personalRate = computed(() =>
  isLoggedIn ? dashboard.value.personalGoal.achievementRate : 15
);
const jointRate = computed(() => (isLoggedIn ? dashboard.value.jointGoal.achievementRate : 30));

const startMissionDrag = (event: PointerEvent) => {
  if (!missionCarousel.value) return;
  dragStartX.value = event.clientX;
  dragStartScrollLeft.value = missionCarousel.value.scrollLeft;
  missionCarousel.value.setPointerCapture(event.pointerId);
};

const moveMissionDrag = (event: PointerEvent) => {
  if (dragStartX.value === null || !missionCarousel.value) return;
  missionCarousel.value.scrollLeft = dragStartScrollLeft.value - (event.clientX - dragStartX.value);
};

const endMissionDrag = () => {
  dragStartX.value = null;
};

const handleMissionScroll = () => {
  if (!missionCarousel.value) return;
  const index = Math.round(missionCarousel.value.scrollLeft / missionCarousel.value.clientWidth);
  missionActiveIndex.value = Math.min(Math.max(index, 0), missions.value.length - 1);
};

onMounted(() => {
  if (!isLoggedIn) return;
  void homeStore.fetchHome();
  void notificationStore.fetchUnreadCount();
});
</script>

<template>
  <div class="mx-auto w-full overflow-hidden bg-white text-[#292934]">
    <section
      class="home-hero relative overflow-hidden bg-white bg-[url('/MainBackground.png')] bg-right bg-no-repeat bg-contain"
    >
      <header class="flex h-[42px] items-center justify-end gap-[10px] px-4 py-[10px]">
        <button
          type="button"
          aria-label="알림"
          class="relative grid h-5 w-5 cursor-pointer place-items-center text-[#2B2B2B]"
          @click="notificationStore.openPanel()"
        >
          <component
            :is="notificationStore.unreadCount > 0 ? BellDot : Bell"
            class="h-5 w-5"
            :class="notificationStore.unreadCount > 0 ? `text-brand` : `text-pink-04`"
            :stroke-width="2.5"
          />
        </button>
      </header>

      <div class="flex h-[300px] items-center justify-between gap-3 p-4 md:px-15">
        <div class="flex h-full min-w-0 flex-1 flex-col gap-3 self-start ml-3">
          <div
            v-if="isOnboardingComplete"
            class="flex flex-col gap-2"
          >
            <h1 class="text-xl font-bold leading-7 text-[#292934] max-[381px]:text-lg md:text-2xl">
              {{ dashboard.groomName }}님과 {{ dashboard.brideName }}님은
            </h1>
            <h1 class="text-xl font-bold leading-7 text-[#292934] max-[381px]:text-lg md:text-2xl">
              <span class="bg-[linear-gradient(to_top,#ffdfea_45%,transparent_45%)]">{{
                formatWon(dashboard.totalAccumulatedAmount)
              }}</span>
              모았어요!
            </h1>
          </div>
          <div
            v-else
            class="flex flex-col gap-2"
          >
            <h1 class="text-xl font-bold leading-7 text-[#292934] max-[381px]:text-lg md:text-2xl">
              결혼 준비의
              <span class="bg-[linear-gradient(to_top,#ffdfea_45%,transparent_45%)]">첫걸음</span>을
            </h1>
            <h1 class="text-xl font-bold leading-7 text-[#292934] max-[381px]:text-lg md:text-2xl">
              함께 시작해볼까요?
            </h1>
          </div>
          <div class="flex flex-1 flex-col items-start justify-between">
            <RouterLink
              v-if="heroCtaTo"
              :to="heroCtaTo"
              class="hero-confirm inline-flex h-[34px] items-center rounded-full bg-brand pl-4 pr-3 text-sm font-bold text-white shadow-sm"
            >
              {{ heroCtaLabel }}
              <ChevronRight
                class="ml-1 h-4 w-4"
                :stroke-width="2"
              />
            </RouterLink>
            <button
              v-else
              type="button"
              class="hero-confirm inline-flex h-[34px] items-center rounded-full bg-brand pl-4 pr-3 text-sm font-bold text-white"
            >
              {{ heroCtaLabel }}
              <ChevronRight
                class="ml-1 h-4 w-4"
                :stroke-width="2"
              />
            </button>

            <div
              v-if="isLoggedIn"
              class="space-y-1.5 text-xs text-[#5A5B69] mb-5"
            >
              <p class="flex items-center gap-1.5">
                <i class="h-2 w-2 rounded-full bg-dm-mint-darker" />개인 예산 달성률
              </p>
              <p class="flex items-center gap-1.5">
                <i class="h-2 w-2 rounded-full bg-brand" />공동 예산 달성률
              </p>
            </div>
          </div>
        </div>

        <HeroThermometer
          :personal-rate="personalRate"
          :joint-rate="jointRate"
        />
      </div>
    </section>

    <section
      class="home-content relative -mt-[14px] rounded-t-[24px] bg-white px-4 pb-8 md:min-h-[359px] md:px-10 md:pb-9 md:pt-5"
    >
      <template v-if="!isOnboardingComplete">
        <HomeChecklistCard
          :steps="stepLabels"
          :active-index="checklistActiveIndex"
          :settings-to="checklistSettingsTo"
        />
        <HomeBudgetPreview
          v-if="showBudgetPreview"
          class="mt-3"
        />
        <HomeUsageTips
          v-else
          :tips="ONBOARDING_TIPS"
          class="mt-3"
        />
      </template>

      <template v-else>
        <button
          v-if="dashboard.savingAlert"
          type="button"
          class="saving-alert flex h-[39px] w-full items-center gap-2 rounded-[11px] bg-pink-01 px-[13px] text-left md:h-11"
        >
          <span class="text-[10px] font-extrabold leading-3 text-brand">알림</span>
          <span class="truncate text-[11.5px] font-medium leading-[14px] text-[#5A5B69]">{{
            dashboard.savingAlert?.message
          }}</span>
        </button>

        <HomeQuickMenu class="mt-3" />

        <div class="flex h-[19px] items-center justify-between my-3">
          <h2 class="text-base font-bold leading-4 text-gray-900">이번 달 절약 미션</h2>
          <span
            v-if="missions.length > 0"
            class="text-[11px] leading-4 text-dm-gray-dark"
            >{{ dashboard.inProgressMissionCount }} / {{ dashboard.totalMissionCount }} 진행</span
          >
        </div>

        <div
          v-if="missions.length > 0"
          ref="missionCarousel"
          aria-label="절약 미션 목록"
          class="mt-2 flex snap-x snap-mandatory overflow-x-auto gap-3 scrollbar-none"
          @pointerdown="startMissionDrag"
          @pointermove="moveMissionDrag"
          @pointerup="endMissionDrag"
          @pointercancel="endMissionDrag"
          @pointerleave="endMissionDrag"
          @scroll="handleMissionScroll"
        >
          <TransitionGroup
            tag="div"
            name="mission-item"
            appear
            class="contents"
          >
            <button
              v-for="(mission, index) in missions"
              :key="mission.id"
              type="button"
              class="mission-card flex h-[62px] w-full shrink-0 snap-center items-center rounded-2xl border border-[#F0E7E5] bg-white p-4 text-left md:h-[72px]"
              :style="{ transitionDelay: `${index * 60}ms` }"
            >
              <span
                class="grid h-8 w-8 place-items-center rounded-[11px] bg-[#FFFAFA] text-[#5A5B69]"
                ><Coffee
                  class="h-3 w-3"
                  :stroke-width="1.6"
              /></span>
              <span class="ml-[18px] flex flex-1 flex-col gap-px">
                <strong class="text-[12.5px] font-bold leading-[15px] tracking-[-0.25px]">{{
                  mission.title
                }}</strong>
                <span class="text-[11px] leading-4 text-dm-gray-dark">{{
                  mission.actionMethod
                }}</span>
              </span>
              <span
                class="rounded-full bg-dm-mint-light px-[9px] py-[4px] text-[10px] font-extrabold leading-3 text-btn-mt-dark"
                >{{ mission.status }}</span
              >
            </button>
          </TransitionGroup>
        </div>

        <div
          v-if="missions.length > 1"
          class="mt-2 flex items-center justify-center gap-1.5"
        >
          <span
            v-for="(mission, index) in missions"
            :key="mission.id"
            class="h-1.5 w-1.5 rounded-full"
            :class="index === missionActiveIndex ? 'bg-brand' : 'bg-[#E5E5EA]'"
          />
        </div>

        <RouterLink
          v-if="missions.length === 0"
          :to="{ name: 'expense' }"
          class="mission-empty mt-2 flex h-[62px] items-center gap-3 rounded-2xl border border-[#F0E7E5] bg-white px-4 text-left md:h-[72px]"
        >
          <span
            class="grid h-8 w-8 shrink-0 place-items-center rounded-[11px] bg-pink-01 text-brand"
            ><Coffee
              class="h-3.5 w-3.5"
              :stroke-width="1.6"
          /></span>
          <span class="flex-1 text-sm font-bold leading-[18px] tracking-[-0.25px] text-[#292934]">
            이번 달엔 무엇부터 아껴볼까요?
          </span>
          <ChevronRight
            class="h-4 w-4 shrink-0 text-dm-gray-dark"
            :stroke-width="2"
          />
        </RouterLink>

        <HomeUsageTips
          heading="이런 것도 확인해보세요"
          more-label=""
          :tips="RECOMMENDATION_TIPS"
          class="mt-[20px]"
        />
      </template>
    </section>
  </div>
</template>

<style scoped>
.mission-item-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.mission-item-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
</style>
