<script setup lang="ts">
import { ref } from 'vue';
import {
  ArrowLeft,
  BarChart3,
  ChevronRight,
  MessageCircle,
  Target,
  UserRound,
} from '@lucide/vue';

const emit = defineEmits<{
  close: [];
}>();

const quickLinks = [
  { label: '마이페이지', icon: UserRound, color: 'text-[#517CA6]' },
  { label: '목표 설정', icon: Target, color: 'text-[#E45B62]' },
  { label: '월별 지출 관리', icon: BarChart3, color: 'text-[#19A786]' },
  { label: '고객센터 (약관)', icon: MessageCircle, color: 'text-[#9293A2]' },
] as const;

const notifications = ref([
  { label: '공동 목표 변경 알림', enabled: true },
  { label: '절약 미션 알림', enabled: true },
  { label: '푸시 수신', enabled: false },
]);
</script>

<template>
  <section class="absolute inset-0 z-[60] bg-gray-100 font-[Pretendard,Inter,sans-serif] text-[#292934]">
    <div class="h-[553px] overflow-hidden rounded-b-[30px] bg-white shadow-[0_16px_44px_-18px_rgba(60,40,38,0.2),0_0_0_1px_rgba(60,40,38,0.07)]">
    <header class="flex h-[42px] items-center gap-[10px] border-b border-[#F5F5F9] px-5 pb-[11px] pt-2">
      <button type="button" aria-label="홈으로 돌아가기" class="grid h-[22px] w-[17px] place-items-center" @click="emit('close')">
        <ArrowLeft class="h-[17px] w-[17px] text-black" :stroke-width="2" />
      </button>
      <h1 class="text-[15px] font-extrabold leading-[18px] tracking-[-0.45px]">메뉴</h1>
    </header>

    <main class="flex flex-col gap-[14px] px-5 pb-[22px] pt-4">
      <section class="flex flex-col gap-[9px]">
        <h2 class="h-[19px] py-px text-[13.5px] font-bold leading-4 tracking-[-0.27px]">바로가기</h2>
        <div class="overflow-hidden rounded-2xl border border-[#F0E7E5] bg-white shadow-[0_1px_2px_rgba(60,40,38,0.03),0_6px_18px_-10px_rgba(60,40,38,0.1)]">
          <button
            v-for="(link, index) in quickLinks"
            :key="link.label"
            type="button"
            class="flex h-[48px] w-full items-center justify-between px-[14px] text-left"
            :class="index > 0 ? 'border-t border-[#F9F3F2]' : ''"
          >
            <span class="flex items-center gap-[7px] text-[12.5px] font-semibold leading-[19px] text-[#5A5B69]">
              <component :is="link.icon" class="h-[13px] w-[13px]" :class="link.color" :stroke-width="1.8" />
              {{ link.label }}
            </span>
            <ChevronRight class="h-[11px] w-[11px] text-[#9293A2]" :stroke-width="1.5" />
          </button>
        </div>
      </section>

      <section class="flex flex-col gap-[7px]">
        <h2 class="h-[19px] py-px text-[13.5px] font-bold leading-4 tracking-[-0.27px]">알림 설정</h2>
        <div class="overflow-hidden rounded-2xl border border-[#F0E7E5] bg-white pt-[2px] shadow-[0_1px_2px_rgba(60,40,38,0.03),0_6px_18px_-10px_rgba(60,40,38,0.1)]">
          <label
            v-for="(notification, index) in notifications"
            :key="notification.label"
            class="flex h-[51px] cursor-pointer items-center justify-between px-[14px]"
            :class="index > 0 ? 'border-t border-[#F9F3F2]' : ''"
          >
            <span class="text-[12.5px] font-semibold leading-[19px] text-[#5A5B69]">{{ notification.label }}</span>
            <input v-model="notification.enabled" type="checkbox" class="peer sr-only" />
            <span class="flex h-[22px] w-[38px] items-center rounded-full bg-[#F0E7E5] p-[3px] transition peer-checked:justify-end peer-checked:bg-[#D0634E]">
              <span class="h-4 w-4 rounded-full bg-white" />
            </span>
          </label>
        </div>
        <p class="text-[11px] leading-4 text-[#9293A2]">기기 권한이 없으면 설정 안내가 표시돼요. 명세 10.2</p>
      </section>
    </main>
    </div>
  </section>
</template>
