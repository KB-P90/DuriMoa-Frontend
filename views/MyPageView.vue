<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { BookOpenText, ChevronRight, CreditCard, UserRound } from '@lucide/vue';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useMyPageStore } from '@/stores/myPageStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { usePushNotificationStore } from '@/stores/pushNotificationStore';
import type { ShareScope } from '@/types/myPage';
import PageHeader from '@/components/common/PageHeader.vue';
import { Switch } from '@/components/ui/switch';

type AssetSummary = {
  id: 'accounts' | 'cards';
  label: string;
  count: number;
  icon: typeof BookOpenText;
};

useAuthCheck();

const router = useRouter();
const myPageStore = useMyPageStore();
const { isUpdatingShare, myPage } = storeToRefs(myPageStore);
const notificationStore = useNotificationStore();
const pushNotificationStore = usePushNotificationStore();
const { pushEnabled } = storeToRefs(pushNotificationStore);
const isTogglingPush = ref(false);

const roleLabels = {
  GROOM: '신랑',
  BRIDE: '신부',
} as const;

const connectionStatusLabels = {
  CONNECTED: '연결됨',
  WAIT: '대기중',
  REQUESTED: '요청됨',
  DISCONNECTED: '미연결',
} as const;

const shareOptions: readonly { value: ShareScope; label: string; caption: string }[] = [
  {
    value: 'WEDDING_FUND_ONLY',
    label: '결혼자금만 공개',
    caption: '전체 계좌의 총액을 공유하고, 개별 거래 내역은 나만 볼 수 있어요.',
  },
  {
    value: 'ALL',
    label: '전체 공개',
    caption: '연결된 자산과 거래 내역을 파트너와 함께 확인할 수 있어요.',
  },
] as const;

const assetSummaries = computed<AssetSummary[]>(() => [
  {
    id: 'accounts',
    label: '연결된 계좌',
    count: myPage.value.assetSummary.connectedAccountsCount,
    icon: BookOpenText,
  },
  {
    id: 'cards',
    label: '연결된 카드',
    count: myPage.value.assetSummary.connectedCardsCount,
    icon: CreditCard,
  },
]);

const selectedShareCaption = computed(() => {
  const selectedOption = shareOptions.find(
    (option) => option.value === myPage.value.shareSetting.selectedScope
  );
  return selectedOption?.caption ?? '';
});

const isPartnerConnected = computed(() => myPage.value.partner?.status === 'CONNECTED');

function goProfileEdit() {
  router.push({ name: 'myinfo-profile' });
}

function goAssetConnect(id: AssetSummary['id']) {
  router.push({ name: id === 'accounts' ? 'myinfo-account-connect' : 'myinfo-card-connect' });
}

function goCoupleConnect() {
  router.push({ name: 'myinfo-couple-connect' });
}

async function handleShareToggle(scope: ShareScope) {
  if (scope === myPage.value.shareSetting.selectedScope) {
    return;
  }

  await myPageStore.toggleShareScope();
}

async function handleLogout() {
  await myPageStore.logout();
  router.push({ name: 'login' });
}

async function handleTogglePush(nextEnabled: boolean) {
  if (isTogglingPush.value) return;

  isTogglingPush.value = true;
  try {
    await pushNotificationStore.setPushEnabled(nextEnabled);
  } finally {
    isTogglingPush.value = false;
  }
}

onMounted(() => {
  void myPageStore.fetchMyPage();
  void notificationStore.fetchUnreadCount();
  void pushNotificationStore.fetchSettings();
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <PageHeader title="마이페이지" />
    <div
      class="flex flex-col gap-3 bg-gradient-to-b from-[#FFFBFC] to-white px-4 pb-8 pt-5 md:px-10 md:pb-9 md:pt-6"
    >
      <article
        class="relative overflow-hidden rounded-2xl border border-[#F2EFEE] bg-[linear-gradient(105deg,#FFFFFF_0%,#FFFFFF_49%,#FFF1EF_100%)] p-4 shadow-[0_1px_2px_rgba(34,34,43,0.04),0_6px_18px_-8px_rgba(34,34,43,0.14)] md:p-5"
      >
        <div
          class="absolute -bottom-[45px] -right-[29px] h-28 w-28 rounded-full bg-[#F2EFEF]/30"
          aria-hidden="true"
        />
        <div class="relative z-10 flex items-center gap-3">
          <div
            class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-dm-cb shadow-[inset_0_0_0_5px_rgba(255,255,255,0.58)]"
          >
            <img
              v-if="myPage.user.profileImage"
              :src="myPage.user.profileImage"
              alt=""
              class="h-full w-full object-cover"
            />
            <UserRound
              v-else
              class="h-7 w-7 text-[#292934]"
              :stroke-width="1.8"
            />
          </div>
          <div class="flex min-w-0 flex-col gap-1">
            <div class="flex items-center gap-1.5">
              <strong class="text-base font-extrabold leading-5">{{ myPage.user.name }}</strong>
              <span
                class="rounded-full bg-dm-mint-lighter px-2 py-1 text-xs font-extrabold leading-3 text-[#77A0A0] shadow-[0_0.6px_2px_rgba(0,0,0,0.2)]"
                >{{ roleLabels[myPage.user.role] }}</span
              >
            </div>
            <p class="text-xs leading-4 text-dm-gray-dark">
              {{ myPage.user.phoneNumber ? myPage.user.phoneNumber : '카카오 로그인' }}
            </p>
          </div>
          <div class="ml-auto shrink-0">
            <button
              type="button"
              class="h-8 rounded-lg bg-white px-3 text-xs font-bold text-brand shadow-[0_0.5px_2px_rgba(0,0,0,0.25)]"
              @click="goProfileEdit"
            >
              프로필 설정
            </button>
          </div>
        </div>
        <div
          class="relative z-10 mt-4 flex items-center justify-between border-t border-[#F2EFEE] pt-3"
        >
          <span class="text-xs font-bold text-[#5A5B69]">푸시 알림 받기</span>
          <Switch
            :model-value="pushEnabled"
            :disabled="isTogglingPush"
            @update:model-value="handleTogglePush"
          />
        </div>
      </article>

      <article
        v-if="isPartnerConnected && myPage.partner"
        class="flex items-center gap-2.5 rounded-2xl bg-pink-01 px-3.5 py-3"
      >
        <div class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white">
          <UserRound
            class="h-4 w-4 text-[#292934]"
            :stroke-width="2"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5">
            <strong class="text-sm font-bold leading-4">{{ myPage.partner.name }}</strong>
            <span
              class="rounded-full bg-white px-2 py-1 text-xs font-extrabold leading-3 text-brand shadow-[0_0.6px_3px_rgba(0,0,0,0.2)]"
              >{{ roleLabels[myPage.partner.role] }}</span
            >
          </div>
          <p class="mt-1 text-xs leading-4 text-dm-gray-dark">
            {{ myPage.partner.connectedSince }}부터 함께 관리 중
          </p>
        </div>
        <span
          class="shrink-0 rounded-full bg-dm-mint-light px-2 py-1 text-xs font-extrabold leading-3 text-[#77A0A0]"
          >{{ connectionStatusLabels[myPage.partner.status] }}</span
        >
      </article>
      <button
        v-else
        type="button"
        class="flex h-10 items-center justify-between rounded-xl bg-btn-mt-dark px-3.5 text-sm font-extrabold text-white shadow-[0_1px_2px_rgba(34,34,43,0.04)]"
        @click="goCoupleConnect"
      >
        <span>상대와 연결하기</span>
        <ChevronRight
          class="h-[18px] w-[18px]"
          :stroke-width="2.2"
        />
      </button>

      <section class="flex flex-col gap-2 pt-1">
        <div class="flex items-end justify-between">
          <h2 class="text-base font-bold leading-5">카드 · 계좌 연결</h2>
          <span class="text-xs leading-4 text-dm-gray-dark">연결된 자산을 관리해요</span>
        </div>
        <div
          class="rounded-2xl border border-[#E9E9F0] bg-white p-4 shadow-[0_1px_2px_rgba(34,34,43,0.04),0_6px_18px_-8px_rgba(34,34,43,0.14)]"
        >
          <div class="flex gap-2">
            <button
              v-for="item in assetSummaries"
              :key="item.id"
              type="button"
              class="flex flex-1 items-center gap-2.5 rounded-xl bg-dm-mint-light p-3 text-left first:bg-[#E6F2F1]"
              @click="goAssetConnect(item.id)"
            >
              <component
                :is="item.icon"
                class="h-6 w-6 shrink-0 text-dm-mint-darker"
                :stroke-width="1.4"
              />
              <span class="flex min-w-0 flex-1 flex-col">
                <span class="text-xs font-medium leading-4 text-btn-mt-darker">{{
                  item.label
                }}</span>
                <div class="flex items-baseline gap-0.5">
                  <strong class="text-sm font-bold leading-5 text-btn-mt-darker">{{
                    item.count
                  }}</strong>
                  <span class="text-sm font-bold leading-5 text-btn-mt-darker">개</span>
                </div>
              </span>
              <ChevronRight
                class="h-5 w-5 shrink-0 text-dm-mint-darker"
                :stroke-width="1.4"
              />
            </button>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-3 pt-1">
        <div class="flex items-end justify-between px-0.5">
          <h2 class="text-base font-bold leading-5">상대 공유 범위</h2>
          <span class="text-xs leading-4 text-dm-gray-dark">{{
            myPage.shareSetting.statusText
          }}</span>
        </div>
        <div
          class="flex flex-col gap-2.5 rounded-2xl border border-[#E9E9F0] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(34,34,43,0.04),0_6px_18px_-8px_rgba(34,34,43,0.14)]"
        >
          <p class="text-sm font-bold leading-5 text-[#5A5B69]">
            파트너에게 내 금융정보를 어디까지 보여줄까요?
          </p>
          <div class="flex h-10 rounded-xl bg-[#F5F5F9] p-1">
            <button
              v-for="option in shareOptions"
              :key="option.value"
              type="button"
              class="flex flex-1 items-center justify-center rounded-lg text-xs font-bold disabled:cursor-wait"
              :class="
                myPage.shareSetting.selectedScope === option.value
                  ? 'bg-white text-brand shadow-[0_2px_8px_rgba(82,55,64,0.08)]'
                  : 'text-dm-gray-dark'
              "
              :disabled="isUpdatingShare"
              @click="handleShareToggle(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
          <p
            class="flex min-h-8 items-center justify-center rounded-lg bg-dm-mint-light px-2.5 py-1.5 text-center text-xs leading-4 text-[#606D6D]"
          >
            {{ selectedShareCaption }}
          </p>
        </div>
      </section>

      <button
        type="button"
        class="h-12 w-full shrink-0 rounded-xl border border-[#E9E9F0] bg-white text-xs font-bold text-dm-gray-dark"
        @click="handleLogout"
      >
        로그아웃
      </button>
      <p class="text-center text-xs leading-4 text-[#B5AAAE]">
        {{ myPage.appVersion }}
      </p>
    </div>
  </div>
</template>
