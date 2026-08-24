<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Bell, BookOpenText, ChevronRight, CreditCard, UserRound } from '@lucide/vue';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useMyPageStore } from '@/stores/myPageStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { getNotificationSettings, updateNotificationSettings } from '@/server/notificationApi';
import { ALL_NOTIFICATION_SETTING_TYPES } from '@/constants/notificationConsent';
import { ONBOARDING_ROUTE_NAMES } from '@/constants/onboard';
import type { ShareScope } from '@/types/myPage';
import PageHeader from '@/components/common/PageHeader.vue';
import { MyPageSkeleton } from '@/components/skeleton/myPage';

type AssetSummary = {
  id: 'accounts' | 'cards';
  label: string;
  count: number;
  icon: typeof BookOpenText;
};

useAuthCheck();

const router = useRouter();
const myPageStore = useMyPageStore();
const { isLoading, isUpdatingShare, myPage } = storeToRefs(myPageStore);
const notificationStore = useNotificationStore();

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
    count: myPage.value?.assetSummary.connectedAccountsCount ?? 0,
    icon: BookOpenText,
  },
  {
    id: 'cards',
    label: '연결된 카드',
    count: myPage.value?.assetSummary.connectedCardsCount ?? 0,
    icon: CreditCard,
  },
]);

const selectedShareCaption = computed(() => {
  if (!myPage.value) {
    return '';
  }

  const selectedOption = shareOptions.find(
    (option) => option.value === myPage.value?.shareSetting.selectedScope
  );
  return selectedOption?.caption ?? '';
});

const isPartnerConnected = computed(() => myPage.value?.partner?.status === 'CONNECTED');

// 알림 종류별 세부 설정은 아직 지원하지 않고, 우선 전체 켜기/끄기 하나로만 관리한다.
const pushNotificationEnabled = ref(true);
const isUpdatingPushNotification = ref(false);

async function togglePushNotification() {
  if (isUpdatingPushNotification.value) return;

  const nextEnabled = !pushNotificationEnabled.value;
  isUpdatingPushNotification.value = true;

  try {
    await updateNotificationSettings(
      ALL_NOTIFICATION_SETTING_TYPES.map((type) => ({ type, pushEnabled: nextEnabled }))
    );
    pushNotificationEnabled.value = nextEnabled;
  } catch {
    // 저장 실패 시 화면 상태를 그대로 유지해 실제 서버 상태와 어긋나지 않게 한다.
  } finally {
    isUpdatingPushNotification.value = false;
  }
}

function goProfileEdit() {
  router.push({ name: 'myinfo-profile' });
}

function goAssetConnect(asset: AssetSummary) {
  if (asset.count === 0) {
    router.push({
      name: ONBOARDING_ROUTE_NAMES.ONBOARDING,
      query: { screen: 'account', from: 'myinfo' },
    });
    return;
  }

  router.push({ name: asset.id === 'accounts' ? 'myinfo-account-connect' : 'myinfo-card-connect' });
}

function goCoupleConnect() {
  router.push({ name: 'myinfo-couple-connect' });
}

async function handleShareToggle(scope: ShareScope) {
  if (!myPage.value || scope === myPage.value.shareSetting.selectedScope) {
    return;
  }

  await myPageStore.toggleShareScope();
}

async function handleLogout() {
  await myPageStore.logout();
  router.push({ name: 'login' });
}

onMounted(async () => {
  void myPageStore.fetchMyPage();
  void notificationStore.fetchUnreadCount();

  try {
    const settings = await getNotificationSettings();
    pushNotificationEnabled.value =
      settings.length === 0 || settings.every((setting) => setting.pushEnabled);
  } catch {
    // 조회 실패 시 기본값(켜짐)을 유지한다.
  }
});
</script>

<template>
  <div class="flex min-h-full flex-col">
    <PageHeader
      title="마이페이지"
      :show-back="false"
    />
    <MyPageSkeleton v-if="isLoading && !myPage" />
    <div
      v-else-if="myPage"
      class="flex flex-1 flex-col justify-between gap-5 bg-white px-4 py-5 md:px-10 md:py-6"
    >
      <article
        class="relative overflow-hidden rounded-2xl bg-brand p-5 shadow-[0_1px_2px_rgba(34,34,43,0.04),0_6px_18px_-8px_rgba(34,34,43,0.14)] md:p-6"
      >
        <div class="relative z-10 flex items-center gap-3">
          <div
            class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white"
          >
            <img
              v-if="myPage.user.profileImage"
              :src="myPage.user.profileImage"
              alt=""
              class="h-full w-full object-cover"
            />
            <UserRound
              v-else
              class="h-7 w-7 text-brand"
              :stroke-width="1.8"
            />
          </div>
          <div class="flex min-w-0 flex-col gap-1">
            <div class="flex items-center gap-1.5">
              <strong class="text-base font-extrabold leading-5 text-white">{{
                myPage.user.name
              }}</strong>
              <span
                class="rounded-full bg-pink-01 px-2 py-1 text-xs font-extrabold leading-3 text-brand shadow-[0_0.6px_2px_rgba(0,0,0,0.2)]"
                >{{ roleLabels[myPage.user.role] }}</span
              >
            </div>
            <p class="text-xs leading-4 text-white/80">
              {{ myPage.user.phoneNumber ? myPage.user.phoneNumber : '카카오 로그인' }}
            </p>
          </div>
          <div class="ml-auto shrink-0">
            <button
              type="button"
              class="h-8 rounded-lg bg-white px-3 text-xs font-bold text-brand shadow-[0_0.5px_2px_rgba(0,0,0,0.25)] cursor-pointer"
              @click="goProfileEdit"
            >
              프로필 설정
            </button>
          </div>
        </div>
      </article>

      <article
        v-if="isPartnerConnected && myPage.partner"
        class="flex items-center gap-3 rounded-2xl border border-brand-border bg-pink-01 px-4 py-4"
      >
        <div
          class="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white"
        >
          <img
            v-if="myPage.partner.profileImage"
            :src="myPage.partner.profileImage"
            alt=""
            class="h-full w-full object-cover"
          />
          <UserRound
            v-else
            class="h-5 w-5 text-brand"
            :stroke-width="2"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5">
            <strong class="text-base font-bold leading-5">{{ myPage.partner.name }}</strong>
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
          class="shrink-0 rounded-full bg-pink-02 px-2 py-1 text-xs font-extrabold leading-3 text-brand-dark"
          >{{ connectionStatusLabels[myPage.partner.status] }}</span
        >
      </article>
      <button
        v-else
        type="button"
        class="flex items-center gap-3 rounded-2xl border border-[0.5px] border-brand-border bg-pink-01 px-4 py-4 text-left shadow-[0_1px_2px_rgba(34,34,43,0.04)] cursor-pointer"
        @click="goCoupleConnect"
      >
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white">
          <UserRound
            class="h-5 w-5 text-brand"
            :stroke-width="2"
          />
        </span>
        <span class="min-w-0 flex-1 text-sm font-semibold leading-5 text-brand-dark"
          >상대와 연결하기</span
        >
        <ChevronRight
          class="h-5 w-5 shrink-0 text-brand"
          :stroke-width="2.2"
        />
      </button>

      <section class="flex flex-col gap-3 pt-1">
        <div class="flex items-end justify-between">
          <h2 class="text-base font-semibold leading-5">카드 · 계좌 연결</h2>
          <span class="text-xs leading-4 text-dm-gray-dark">연결된 자산을 관리해요</span>
        </div>

        <div class="flex gap-2">
          <button
            v-for="item in assetSummaries"
            :key="item.id"
            type="button"
            class="flex flex-1 items-center gap-5 rounded-xl bg-dm-mint-light p-5 text-left h-[80px] cursor-pointer"
            @click="goAssetConnect(item)"
          >
            <component
              :is="item.icon"
              class="h-6 w-6 shrink-0 text-dm-mint-darker"
              :stroke-width="1.4"
            />
            <span class="flex min-w-0 flex-1 flex-col gap-2">
              <span class="text-sm font-medium leading-4 text-dm-mint-darker">{{
                item.label
              }}</span>
              <div class="flex items-baseline gap-0.5">
                <strong class="text-sm font-bold leading-5 text-dm-mint-darker">{{
                  item.count
                }}</strong>
                <span class="text-sm font-bold leading-5 text-dm-mint-darker">개</span>
              </div>
            </span>
            <ChevronRight
              class="h-5 w-5 shrink-0 text-dm-mint-darker"
              :stroke-width="1.4"
            />
          </button>
        </div>
      </section>

      <section class="flex flex-col gap-3 pt-1">
        <div class="flex items-end justify-between px-0.5">
          <h2 class="text-base font-semibold leading-5">상대 공유 범위</h2>
          <span class="text-xs leading-4 text-dm-gray-dark">{{
            myPage.shareSetting.statusText
          }}</span>
        </div>
        <div class="flex h-10 rounded-xl bg-[#F5F5F9] p-1">
          <button
            v-for="option in shareOptions"
            :key="option.value"
            type="button"
            class="flex flex-1 items-center justify-center rounded-lg text-xs font-bold disabled:cursor-wait cursor-pointer"
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
          class="flex min-h-12 items-center justify-center rounded-lg bg-dm-mint-light px-2.5 py-1.5 text-center text-sm leading-4 text-dm-mint-darker h-[30px]"
        >
          {{ selectedShareCaption }}
        </p>
      </section>

      <section class="flex flex-col gap-3 pt-1">
        <div class="flex items-end justify-between px-0.5">
          <h2 class="text-base font-semibold leading-5">알림 설정</h2>
          <span class="text-xs leading-4 text-dm-gray-dark">{{
            pushNotificationEnabled ? '켜짐' : '꺼짐'
          }}</span>
        </div>
        <div class="rounded-2xl border border-[#E9E9F0] bg-white p-5">
          <div class="flex items-center gap-3">
            <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pink-01">
              <Bell
                class="h-5 w-5 text-brand"
                :stroke-width="1.8"
              />
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold leading-5 text-[#232631]">푸시 알림</p>
              <p class="mt-0.5 text-xs leading-4 text-dm-gray-dark">
                결혼시안 변동, 목표 달성 소식을 받아요
              </p>
            </div>
            <label
              class="relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full bg-[#E9E9F0] p-1 transition-colors has-[:checked]:bg-brand"
            >
              <input
                :checked="pushNotificationEnabled"
                class="peer sr-only"
                type="checkbox"
                :disabled="isUpdatingPushNotification"
                aria-label="푸시 알림 켜기/끄기"
                @change="togglePushNotification"
              />
              <span
                class="h-6 w-6 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-6"
              ></span>
            </label>
          </div>
        </div>
      </section>

      <button
        type="button"
        class="h-14 w-full shrink-0 rounded-xl border border-[#E9E9F0] bg-white text-sm font-bold text-dm-gray-dark cursor-pointer"
        @click="handleLogout"
      >
        로그아웃
      </button>
    </div>
    <div
      v-else
      class="flex flex-1 items-center justify-center px-4 text-center text-sm text-dm-gray-dark"
    >
      {{ myPageStore.lastErrorMessage || '마이페이지 정보를 불러오는 중이에요.' }}
    </div>
  </div>
</template>
