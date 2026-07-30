<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Bell, CalendarDays, ChevronRight, Coffee, Menu } from '@lucide/vue';
import MenuPanel from '@/components/common/MenuPanel.vue';
import { useHomeStore } from '@/stores/homeStore';
import { formatWon } from '@/utils/format';

const homeStore = useHomeStore();
const { dashboard, missions } = storeToRefs(homeStore);

const activeMissionIndex = ref(0);
const missionCarousel = ref<HTMLElement | null>(null);
const dragStartX = ref<number | null>(null);
const dragStartScrollLeft = ref(0);
const isMenuOpen = ref(false);

const updateMissionIndex = (event: Event) => {
  const carousel = event.currentTarget as HTMLElement;
  activeMissionIndex.value = Math.round(carousel.scrollLeft / carousel.clientWidth);
};

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
});
</script>

<template>
  <div class="h-[799px] w-[390px] overflow-hidden bg-white font-[Pretendard,Inter,sans-serif] text-[#292934]">
    <div class="flex h-[27px] items-center justify-between px-[22px] text-[11px] font-bold leading-[13px]">
      <span>9:41</span>
      <span class="flex items-center gap-[3px] text-[8px] tracking-[1px]">●●●<i class="h-2 w-[13px] rounded-[2px] border border-[#292934]" /></span>
    </div>

    <section class="relative h-[379px] overflow-hidden bg-gradient-to-b from-[#FDDFDD] to-white">
      <header class="absolute inset-x-0 top-0 flex h-[42px] items-center justify-end gap-[10px] px-5 py-[10px]">
        <button type="button" aria-label="알림" class="grid h-5 w-5 place-items-center text-[#2B2B2B]">
          <Bell class="h-5 w-5" :stroke-width="1.6" />
        </button>
        <button type="button" aria-label="메뉴" class="grid h-[22px] w-[22px] place-items-center text-[#2B2B2B]" @click="isMenuOpen = true">
          <Menu class="h-[22px] w-[22px]" :stroke-width="2" />
        </button>
      </header>

      <h1 class="absolute left-[44px] top-[61px] text-[16.4px] font-bold leading-[26px] tracking-[-0.577px] text-[#292934]">
        {{ dashboard.groomName }}님과 {{ dashboard.brideName }}님은<br />
        <span class="text-[23.8px] leading-[37px] tracking-[-0.72px] text-[#FF6464]">{{ formatWon(dashboard.totalAccumulatedAmount) }}</span>
        모았어요!
      </h1>

      <button type="button" class="absolute left-[44px] top-[128px] flex h-[25px] w-[62px] items-center rounded-full bg-[#FF6464] pl-3 text-[12px] font-bold leading-[14px] text-[#FBF0EF] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]">
        확인
        <ChevronRight class="ml-1 h-4 w-4" :stroke-width="2" />
      </button>

      <div class="absolute left-[40px] top-[178px] flex h-[35px] w-[123px] gap-[7px]">
        <div class="flex w-[58px] flex-col items-center gap-[3px]">
          <span class="whitespace-nowrap text-[9px] font-bold leading-[11px] text-[#5A5B69]"><i class="mr-[5px] inline-block h-2 w-2 rounded-[2.5px] bg-[#FF6464]" />사용한 돈</span>
          <strong class="text-[12.9px] font-extrabold leading-4 tracking-[-0.42px] text-[#5A5B69]">{{ formatWon(dashboard.usedAmount) }}</strong>
        </div>
        <div class="flex w-[58px] flex-col items-center gap-[3px]">
          <span class="whitespace-nowrap text-[9px] font-bold leading-[11px] text-[#5A5B69]"><i class="mr-[5px] inline-block h-2 w-2 rounded-[2.5px] border-[0.1px] border-black bg-white/55" />남은 돈</span>
          <strong class="text-[12.9px] font-bold leading-4 tracking-[-0.42px] text-[#5A5B69]">{{ formatWon(dashboard.remainingAmount) }}</strong>
        </div>
      </div>

      <p class="absolute left-[40px] top-[256px] w-[98px] text-[12.9px] font-extrabold leading-4 tracking-[-0.42px] text-[#5A5B69]">
        커플 연결 후<br />목표설정하러가기<br />(추후 수정)
      </p>

      <img src="/characters/groom.png" alt="" class="absolute left-[193px] top-[100px] z-10 h-[245px] w-[146px] object-contain" />
      <img src="/characters/bride.png" alt="" class="absolute left-[140px] top-[195px] z-20 h-[124px] w-[91px] object-contain" />
      <div aria-hidden="true" class="absolute left-[314px] top-[125px] h-[251px] w-[42px] rounded-xl bg-white/80 p-[6px] shadow-sm">
        <div class="relative h-full overflow-hidden rounded-lg bg-[#F1F2F5]">
          <div class="absolute inset-x-0 bottom-0 rounded-lg bg-[#FF8580]" style="height: 62%" />
          <i class="absolute right-[3px] top-[18%] h-px w-[9px] bg-[#D7D9DE]" />
          <i class="absolute right-[3px] top-[36%] h-px w-[9px] bg-[#D7D9DE]" />
          <i class="absolute right-[3px] top-[54%] h-px w-[9px] bg-[#D7D9DE]" />
          <i class="absolute right-[3px] top-[72%] h-px w-[9px] bg-[#D7D9DE]" />
        </div>
      </div>
    </section>

    <section class="relative -mt-[14px] h-[393px] rounded-t-[24px] bg-white px-5 pt-[18px]">
      <button type="button" class="flex h-[39px] w-[350px] items-center gap-2 rounded-[11px] bg-[#FFF8F8] px-[13px] text-left">
        <span class="text-[10px] font-extrabold leading-3 text-[#FF8F84]">알림</span>
        <span class="truncate text-[11.5px] font-medium leading-[14px] text-[#5A5B69]">{{ dashboard.savingAlert.message }}</span>
      </button>

      <div class="-mx-5 my-[10px] h-[6px] bg-[#F5F5F9]" />

      <div class="flex h-[19px] items-center justify-between">
        <h2 class="text-[13.5px] font-bold leading-4 tracking-[-0.27px]">이번 달 절약 미션</h2>
        <span class="text-[11px] leading-4 text-[#9293A2]">{{ dashboard.inProgressMissionCount }} / {{ dashboard.totalMissionCount }} 진행</span>
      </div>

      <div
        ref="missionCarousel"
        class="mt-[9px] flex h-[62px] snap-x snap-mandatory overflow-x-auto overscroll-x-contain touch-pan-y select-none [&::-webkit-scrollbar]:hidden"
        aria-label="절약 미션 목록"
        @scroll.passive="updateMissionIndex"
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
          class="flex h-[62px] min-w-full snap-center items-center rounded-2xl border border-[#F0E7E5] bg-white px-[14px] py-3 text-left shadow-[0_1px_2px_rgba(60,40,38,0.03),0_6px_18px_-10px_rgba(60,40,38,0.1)]"
        >
          <span class="grid h-8 w-8 place-items-center rounded-[11px] bg-[#FFFAFA] text-[#5A5B69]"><Coffee class="h-3 w-3" :stroke-width="1.6" /></span>
          <span class="ml-[18px] flex flex-1 flex-col gap-px">
            <strong class="text-[12.5px] font-bold leading-[15px] tracking-[-0.25px]">{{ mission.title }}</strong>
            <span class="text-[11px] leading-4 text-[#9293A2]">{{ mission.actionMethod }}</span>
          </span>
          <span class="rounded-full bg-[#E4F5F4] px-[9px] py-[4px] text-[10px] font-extrabold leading-3 text-[#2CAEAA]">{{ mission.status }}</span>
        </button>
      </div>

      <h2 class="mt-[20px] text-[13.5px] font-bold leading-4 tracking-[-0.27px] text-[#5A5B69]">우리의 목표</h2>

      <div class="mt-[10px] flex h-[144px] gap-[13px] py-[5px]">
        <article class="h-[134px] w-[164px] rounded-2xl border border-white/90 bg-[#FFF1EF] p-4">
          <p class="text-[11px] font-extrabold leading-4 text-[#5A5B69]">공동 예산 달성률</p>
          <p class="mt-[7px] text-[24.6px] font-bold leading-[30px] tracking-[-1.35px] text-[#FF6464]">{{ dashboard.jointGoal.achievementRate }}<span class="text-[15px]">%</span></p>
          <div class="mt-[7px] h-2 w-[130px] overflow-hidden rounded-full bg-white"><span class="block h-full rounded-full bg-[#FF6464]" :style="{ width: `${dashboard.jointGoal.achievementRate}%` }" /></div>
          <p class="mt-[7px] text-[12.3px] font-bold leading-[19px] tracking-[-0.375px] text-[#5A5B69]">{{ formatWon(dashboard.jointGoal.currentAmount) }} / {{ formatWon(dashboard.jointGoal.targetAmount) }}</p>
        </article>
        <article class="h-[134px] w-[165px] rounded-2xl border border-white/90 bg-[#F4FFFF] p-4">
          <p class="text-[11px] font-extrabold leading-4 text-[#5A5B69]">개인 예산 달성률</p>
          <p class="mt-[7px] text-[24.6px] font-bold leading-[30px] tracking-[-1.35px] text-[#15AEA9]">{{ dashboard.personalGoal.achievementRate }}<span class="text-[15px]">%</span></p>
          <div class="mt-[7px] h-2 w-[131px] overflow-hidden rounded-full bg-white"><span class="block h-full rounded-full bg-[#15AEA9]" :style="{ width: `${dashboard.personalGoal.achievementRate}%` }" /></div>
          <p class="mt-[7px] text-[12.3px] font-bold leading-[19px] tracking-[-0.375px] text-[#5A5B69]">{{ formatWon(dashboard.personalGoal.currentAmount) }} / {{ formatWon(dashboard.personalGoal.targetAmount) }}</p>
        </article>
      </div>
    </section>

    <MenuPanel v-if="isMenuOpen" @close="isMenuOpen = false" />
  </div>
</template>
