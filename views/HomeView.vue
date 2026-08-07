<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Bell, ChevronRight, Coffee, Menu } from '@lucide/vue';
import MenuPanel from '@/components/common/MenuPanel.vue';
import { useHomeStore } from '@/stores/homeStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { formatWon } from '@/utils/format';
import NewUserHome from '@/components/home/NewUserHome.vue';

const homeStore = useHomeStore();
const { dashboard, missions } = storeToRefs(homeStore);
const notificationStore = useNotificationStore();

const missionCarousel = ref<HTMLElement | null>(null);
const dragStartX = ref<number | null>(null);
const dragStartScrollLeft = ref(0);
const isMenuOpen = ref(false);
const isNewUser = computed(() => dashboard.value.coupleStatus === 'DISCONNECTED');
const jointGoalGraphHeight = computed(
  () => `${Math.min(Math.max(dashboard.value.jointGoal.achievementRate, 0), 100)}%`
);

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

onMounted(() => {
  void homeStore.fetchHome();
  void notificationStore.fetchUnreadCount();
});
</script>

<template>
  <NewUserHome v-if="isNewUser" />
  <div
    v-else
    class="mx-auto w-full overflow-hidden bg-white text-[#292934]"
  >
    <section
      class="home-hero relative h-[379px] overflow-hidden bg-gradient-to-b from-pink-01 to-white md:h-[440px]"
    >
      <header class="flex h-[42px] items-center justify-end gap-[10px] px-4 py-[10px]">
        <button
          type="button"
          aria-label="알림"
          class="relative grid h-5 w-5 cursor-pointer place-items-center text-[#2B2B2B]"
          @click="notificationStore.openPanel()"
        >
          <Bell
            class="h-5 w-5"
            :stroke-width="2.5"
          />
          <span
            v-if="notificationStore.unreadCount > 0"
            class="absolute right-0 top-0 h-2 w-2 rounded-full bg-brand-dark"
          />
        </button>
        <button
          type="button"
          aria-label="메뉴"
          class="grid h-[22px] w-[22px] place-items-center text-[#2B2B2B]"
          @click="isMenuOpen = true"
        >
          <Menu
            class="h-[22px] w-[22px]"
            :stroke-width="2"
          />
        </button>
      </header>

      <div class="px-4 pt-2 md:px-10 md:pt-4">
        <h1
          class="hero-title text-[16.4px] font-bold leading-[26px] tracking-[-0.577px] text-[#292934] md:w-[280px] md:text-[21px] md:leading-[1.45]"
        >
          {{ dashboard.groomName }}님과 {{ dashboard.brideName }}님은<br />
          <span
            class="text-[23.8px] leading-[37px] tracking-[-0.72px] text-brand md:text-[31px] md:leading-[1.3]"
            >{{ formatWon(dashboard.totalAccumulatedAmount) }}</span
          >
          모았어요!
        </h1>

        <button
          type="button"
          class="hero-confirm mt-3 flex h-[25px] w-[62px] items-center rounded-full bg-brand pl-3 text-xs font-bold leading-[14px] text-white md:mt-5 md:h-[34px] md:w-20 md:text-sm"
        >
          확인
          <ChevronRight
            class="ml-1 h-4 w-4"
            :stroke-width="2"
          />
        </button>

        <div
          class="hero-stats mt-7 flex h-[35px] w-[123px] gap-[7px] md:mt-9 md:scale-[1.12] md:origin-top-left"
        >
          <div class="flex w-[58px] flex-col items-center gap-[3px]">
            <span class="whitespace-nowrap text-[9px] font-bold leading-[11px] text-[#5A5B69]"
              ><i class="mr-[5px] inline-block h-2 w-2 rounded-[2.5px] bg-brand" />사용한 돈</span
            >
            <strong
              class="text-[12.9px] font-extrabold leading-4 tracking-[-0.42px] text-[#5A5B69]"
              >{{ formatWon(dashboard.usedAmount) }}</strong
            >
          </div>
          <div class="flex w-[58px] flex-col items-center gap-[3px]">
            <span class="whitespace-nowrap text-[9px] font-bold leading-[11px] text-[#5A5B69]"
              ><i
                class="mr-[5px] inline-block h-2 w-2 rounded-[2.5px] border-[0.1px] border-black bg-white"
              />남은 돈</span
            >
            <strong class="text-[12.9px] font-bold leading-4 tracking-[-0.42px] text-[#5A5B69]">{{
              formatWon(dashboard.remainingAmount)
            }}</strong>
          </div>
        </div>
      </div>

      <img
        src="/characters/groom.png"
        alt=""
        class="groom-character absolute right-[51px] top-[100px] z-20 h-[245px] w-[146px] object-contain md:right-[130px] md:top-[73px] md:h-[352px] md:w-[209px]"
      />
      <img
        src="/characters/bride.png"
        alt=""
        class="bride-character absolute right-[159px] top-[210px] z-10 h-[124px] w-[91px] object-contain md:right-[340px] md:top-[198px] md:h-[182px] md:w-[132px]"
      />
      <div
        aria-hidden="true"
        class="saving-graph absolute right-[34px] top-[100px] h-[251px] w-[42px] rounded-xl bg-white/80 p-[6px] shadow-sm md:right-14 md:top-[92px] md:h-[270px] md:w-11"
      >
        <div class="relative h-full overflow-hidden rounded-lg bg-[#F1F2F5]">
          <div
            class="absolute inset-x-0 bottom-0 rounded-lg bg-brand"
            :style="{ height: jointGoalGraphHeight }"
          />
          <i class="absolute right-[3px] top-[18%] h-px w-[9px] bg-[#D7D9DE]" />
          <i class="absolute right-[3px] top-[36%] h-px w-[9px] bg-[#D7D9DE]" />
          <i class="absolute right-[3px] top-[54%] h-px w-[9px] bg-[#D7D9DE]" />
          <i class="absolute right-[3px] top-[72%] h-px w-[9px] bg-[#D7D9DE]" />
        </div>
      </div>
    </section>

    <section
      class="home-content relative -mt-[14px] rounded-t-[24px] bg-white px-4 pb-8 pt-[18px] md:min-h-[359px] md:px-10 md:pb-9 md:pt-5"
    >
      <button
        type="button"
        class="saving-alert flex h-[39px] w-full items-center gap-2 rounded-[11px] bg-pink-01 px-[13px] text-left md:h-11"
      >
        <span class="text-[10px] font-extrabold leading-3 text-brand">알림</span>
        <span class="truncate text-[11.5px] font-medium leading-[14px] text-[#5A5B69]">{{
          dashboard.savingAlert.message
        }}</span>
      </button>

      <div class="-mx-4 my-[10px] h-[6px] bg-[#F5F5F9] md:-mx-10" />

      <div class="flex h-[19px] items-center justify-between">
        <h2 class="text-[13.5px] font-bold leading-4 tracking-[-0.27px]">이번 달 절약 미션</h2>
        <span class="text-[11px] leading-4 text-dm-gray-dark"
          >{{ dashboard.inProgressMissionCount }} / {{ dashboard.totalMissionCount }} 진행</span
        >
      </div>

      <div
        ref="missionCarousel"
        aria-label="절약 미션 목록"
        @pointerdown="startMissionDrag"
        @pointermove="moveMissionDrag"
        @pointerup="endMissionDrag"
        @pointercancel="endMissionDrag"
        @pointerleave="endMissionDrag"
      >
        <button
          v-for="mission in missions"
          :key="mission.id"
          type="button"
          class="mission-card flex h-[62px] min-w-full snap-center items-center rounded-2xl border border-[#F0E7E5] bg-white mt-2 p-4 text-left md:h-[72px]"
        >
          <span class="grid h-8 w-8 place-items-center rounded-[11px] bg-[#FFFAFA] text-[#5A5B69]"
            ><Coffee
              class="h-3 w-3"
              :stroke-width="1.6"
          /></span>
          <span class="ml-[18px] flex flex-1 flex-col gap-px">
            <strong class="text-[12.5px] font-bold leading-[15px] tracking-[-0.25px]">{{
              mission.title
            }}</strong>
            <span class="text-[11px] leading-4 text-dm-gray-dark">{{ mission.actionMethod }}</span>
          </span>
          <span
            class="rounded-full bg-dm-mint-light px-[9px] py-[4px] text-[10px] font-extrabold leading-3 text-btn-mt-dark"
            >{{ mission.status }}</span
          >
        </button>
      </div>

      <h2 class="mt-[20px] text-[13.5px] font-bold leading-4 tracking-[-0.27px] text-[#5A5B69]">
        우리의 목표
      </h2>

      <div class="goal-grid mt-[10px] flex h-[144px] gap-[13px] py-[5px] md:h-auto">
        <article
          class="goal-card h-[134px] flex-1 rounded-2xl border border-white/90 bg-pink-01 p-4 md:h-[150px] md:p-[18px]"
        >
          <p class="text-[11px] font-extrabold leading-4 text-[#5A5B69]">공동 예산 달성률</p>
          <p class="mt-[7px] text-[24.6px] font-bold leading-[30px] tracking-[-1.35px] text-brand">
            {{ dashboard.jointGoal.achievementRate }}<span class="text-[15px]">%</span>
          </p>
          <div class="mt-[7px] h-2 w-[130px] overflow-hidden rounded-full bg-white">
            <span
              class="block h-full rounded-full bg-brand"
              :style="{ width: `${dashboard.jointGoal.achievementRate}%` }"
            />
          </div>
          <p
            class="mt-[7px] text-[12.3px] font-bold leading-[19px] tracking-[-0.375px] text-[#5A5B69]"
          >
            {{ formatWon(dashboard.jointGoal.currentAmount) }} /
            {{ formatWon(dashboard.jointGoal.targetAmount) }}
          </p>
        </article>
        <article
          class="goal-card h-[134px] flex-1 rounded-2xl border border-white/90 bg-[#F4FFFF] p-4 md:h-[150px] md:p-[18px]"
        >
          <p class="text-[11px] font-extrabold leading-4 text-[#5A5B69]">개인 예산 달성률</p>
          <p
            class="mt-[7px] text-[24.6px] font-bold leading-[30px] tracking-[-1.35px] text-dm-mint-darker"
          >
            {{ dashboard.personalGoal.achievementRate }}<span class="text-[15px]">%</span>
          </p>
          <div class="mt-[7px] h-2 w-[131px] overflow-hidden rounded-full bg-white">
            <span
              class="block h-full rounded-full bg-dm-mint-darker"
              :style="{ width: `${dashboard.personalGoal.achievementRate}%` }"
            />
          </div>
          <p
            class="mt-[7px] text-[12.3px] font-bold leading-[19px] tracking-[-0.375px] text-[#5A5B69]"
          >
            {{ formatWon(dashboard.personalGoal.currentAmount) }} /
            {{ formatWon(dashboard.personalGoal.targetAmount) }}
          </p>
        </article>
      </div>
    </section>

    <MenuPanel
      v-if="isMenuOpen"
      @close="isMenuOpen = false"
    />
  </div>
</template>
