<script setup lang="ts">
import { ref } from 'vue';
import { Bell, ChevronRight, ClipboardList, Heart, Info, MapPin, Menu } from '@lucide/vue';
import MenuPanel from '@/components/common/MenuPanel.vue';

const isMenuOpen = ref(false);

const CHECKLIST_STEPS = [
  { label: '커플 연결', value: '✓', active: true },
  { label: '계좌 연결', value: '2', active: false },
  { label: '결혼 목표 설정', value: '3', active: false },
  { label: '지역 선택', value: '4', active: false },
  { label: '첫 저축 등록', value: '5', active: false },
] as const;

const REGIONAL_BUDGETS = [
  { region: '서울', amount: '4,980', height: 152, active: true },
  { region: '경기', amount: '4,450', height: 135, active: false },
  { region: '인천', amount: '4,280', height: 129, active: false },
  { region: '부산', amount: '4,120', height: 123, active: false },
  { region: '대구', amount: '3,850', height: 114, active: false },
  { region: '광주', amount: '3,780', height: 111, active: false },
  { region: '대전', amount: '3,760', height: 109, active: false },
] as const;
</script>

<template>
  <div class="new-user-page relative mx-auto min-h-full w-full bg-white pb-24 font-[Pretendard,Inter,sans-serif] text-[#222432]">
    <section class="new-user-hero relative h-[390px] overflow-hidden bg-[radial-gradient(139%_109%_at_82%_12%,rgba(255,226,220,0.85)_0%,rgba(255,226,220,0)_38%),linear-gradient(180deg,#FFF7F4_0%,#FFFAF8_100%)] px-7 pt-[59px]">
      <div class="new-user-header absolute right-6 top-[6px] flex items-center gap-4">
        <button type="button" aria-label="알림" class="grid h-[30px] w-[30px] place-items-center">
          <Bell class="h-[30px] w-[30px]" :stroke-width="2.25" />
        </button>
        <button type="button" aria-label="메뉴" class="grid h-[30px] w-[30px] place-items-center" @click="isMenuOpen = true">
          <Menu class="h-[30px] w-[30px]" :stroke-width="2.25" />
        </button>
      </div>

      <h1 class="intro-title relative z-10 w-[220px] text-[24px] font-black leading-9 tracking-[-1.1px]">
        안녕하세요!<br />
        결혼 준비의 <span class="text-[#FF7772]">첫걸음</span>을<br />
        함께 시작해볼까요?
      </h1>
      <p class="intro-description relative z-10 mt-4 w-[220px] text-[15px] leading-[26px] tracking-[-0.35px] text-[#424552]">
        커플을 연결하고 목표를 설정하면<br />우리의 여정이 시작돼요.
      </p>
      <button type="button" class="intro-cta relative z-10 mt-[19px] flex h-[58px] items-center gap-3 rounded-[17px] bg-gradient-to-r from-[#EF7F73] to-[#FF6E70] px-[22px] text-[17px] font-black text-white shadow-[0_8px_18px_rgba(241,111,106,0.18)]">
        커플 연결 및 목표 설정하기
        <ChevronRight class="h-6 w-6" :stroke-width="2" />
      </button>

      <img src="/characters/groom.png" alt="신랑 캐릭터" class="groom-intro-character absolute right-[71px] top-[49px] z-10 h-[225px] w-[141px] object-contain" />
      <img src="/characters/bride.png" alt="신부 캐릭터" class="bride-intro-character absolute right-[28px] top-[92px] z-20 h-[154px] w-[104px] object-contain" />

    </section>

    <main class="new-user-main relative -mt-[18px] rounded-t-[24px] bg-white px-4 pt-[14px]">
      <section class="new-user-card rounded-[20px] border border-[#F3DEDA] bg-white p-[18px_17px_16px] shadow-[0_7px_18px_rgba(60,40,30,0.035)]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ClipboardList class="h-[25px] w-[25px] text-[#FF7C75]" :stroke-width="2" />
            <h2 class="text-xl font-bold tracking-[-0.65px]">두리모아 체크리스트</h2>
          </div>
          <button type="button" class="h-[33px] rounded-[17px] border border-[#DEDDE2] px-3 text-[13px] font-bold text-[#60626D]">설정하기 ›</button>
        </div>

        <div class="relative mt-[14px] flex justify-between before:absolute before:left-8 before:right-[30px] before:top-[26px] before:h-[2px] before:bg-[#DEDFE3]">
          <div v-for="step in CHECKLIST_STEPS" :key="step.label" class="relative z-10 flex w-[62px] flex-col items-center gap-[9px]">
            <span class="grid h-[38px] w-[38px] place-items-center rounded-full border-2 text-[17px] font-bold" :class="step.active ? 'border-[#FF7A76] bg-gradient-to-b from-[#FF7A76] to-[#EE6D69] text-white' : 'border-[#D8D9DF] bg-white text-[#4D505C]'">{{ step.value }}</span>
            <span class="whitespace-nowrap text-[10.5px] tracking-[-0.35px]" :class="step.active ? 'font-bold text-[#ED746C]' : 'text-[#4D505C]'">{{ step.label }}</span>
          </div>
        </div>

        <div class="mt-[13px] flex min-h-[50px] items-center gap-[9px] rounded-[14px] bg-[#FFF4F2] px-[14px] text-[12.5px] leading-[15px] text-[#414552]">
          <Heart class="h-[18px] w-[18px] shrink-0 fill-[#FF8B82] text-[#FF8B82]" />
          <p>목표를 설정하면 공동 달성률, 개인 달성률, 예산 분석을 확인할 수 있어요!</p>
        </div>
      </section>

      <section class="new-user-card mt-3 rounded-[20px] border border-[#F3DEDA] bg-white p-[18px_17px_16px] shadow-[0_7px_18px_rgba(60,40,30,0.035)]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[10px]">
            <h2 class="text-xl font-bold tracking-[-0.65px]">예상 예산 미리보기</h2>
            <Info class="h-4 w-4 text-[#AEB0B5]" :stroke-width="1.6" />
          </div>
          <button type="button" class="flex h-[33px] items-center gap-1 rounded-[17px] border border-[#FFB5B0] px-3 text-[13px] font-bold text-[#FF817A]">
            지역 선택하기 <MapPin class="h-3 w-3" fill="currentColor" />
          </button>
        </div>
        <p class="mt-[13px] text-[12.5px] text-[#5B5E69]">지역별 평균 결혼 비용 (전국 평균 기준)</p>

        <div class="mt-[30px] flex h-[208px] items-end border-b border-[#DDE0E5] px-[2px]">
          <div v-for="budget in REGIONAL_BUDGETS" :key="budget.region" class="flex flex-1 flex-col items-center justify-end">
            <span class="mb-[7px] whitespace-nowrap text-[10.5px] font-bold leading-[13px] text-[#222432]">{{ budget.amount }}<small class="text-[8px]">만원</small></span>
            <div class="w-8 rounded-t-[11px]" :class="budget.active ? 'bg-gradient-to-b from-[#FF9B91] to-[#EF7770]' : 'bg-gradient-to-b from-[#DADBDD] to-[#CFD0D2]'" :style="{ height: `${budget.height}px` }" />
            <span class="mt-1 text-[11px]" :class="budget.active ? 'font-bold text-[#F07870]' : 'text-[#333744]'">{{ budget.region }}</span>
          </div>
        </div>

        <button type="button" class="mt-[27px] flex h-[50px] w-full items-center gap-[9px] rounded-[14px] bg-[#FFF4F2] px-[14px] text-left text-[12.5px] text-[#414552]">
          <MapPin class="h-[18px] w-[18px] shrink-0 text-[#FF8B82]" :stroke-width="1.8" />
          <span class="flex-1">지역을 선택하면 항목별 평균 비용을 확인할 수 있어요!</span>
          <ChevronRight class="h-5 w-5 text-[#3B3F49]" :stroke-width="1.7" />
        </button>
      </section>
    </main>

    <MenuPanel v-if="isMenuOpen" @close="isMenuOpen = false" />
  </div>
</template>

<style scoped>
@media (min-width: 640px) {
  .new-user-hero {
    height: 390px;
    padding-left: clamp(40px, 8vw, 88px);
    padding-top: 66px;
  }

  .new-user-header {
    right: clamp(34px, 6vw, 64px);
    top: 18px;
  }

  .intro-title {
    font-size: clamp(26px, 3.2vw, 32px);
    line-height: 1.45;
    width: 290px;
  }

  .intro-description {
    font-size: 16px;
    width: 280px;
  }

  .intro-cta {
    font-size: 18px;
    height: 62px;
  }

  .groom-intro-character {
    height: 245px;
    right: clamp(136px, 23vw, 190px);
    top: 42px;
    width: 154px;
  }

  .bride-intro-character {
    height: 172px;
    right: clamp(72px, 12vw, 100px);
    top: 94px;
    width: 116px;
  }

  .new-user-main {
    margin: -18px auto 0;
    max-width: 720px;
    padding: 18px 28px 36px;
  }

  .new-user-card {
    padding: 22px 24px 20px;
  }
}
</style>
