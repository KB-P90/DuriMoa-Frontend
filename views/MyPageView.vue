<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { BookOpenText, ChevronRight, CreditCard, Heart, UserRound } from '@lucide/vue';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useMyPageStore } from '@/stores/myPageStore';
import { useNotificationStore } from '@/stores/notificationStore';
import type { ShareScope } from '@/types/myPage';

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

onMounted(() => {
  void myPageStore.fetchMyPage();
  void notificationStore.fetchUnreadCount();
});
</script>

<template>
  <div class="mypage-stage relative aspect-[390/770] w-full md:aspect-auto md:min-h-[770px]">
    <section
      class="absolute inset-0 origin-top-left h-[770px] w-[390px] overflow-y-auto bg-white font-[Pretendard,Inter,sans-serif] text-[#292934] scale-[var(--mypage-scale)] md:relative md:h-auto md:min-h-[770px] md:w-full md:scale-100 md:overflow-visible"
    >
      <div
        class="flex min-h-[770px] flex-col gap-3 bg-gradient-to-b from-[#FFFBFC] to-white px-[18px] pb-7 pt-5"
      >
        <header class="flex h-[54px] items-center justify-between px-px pb-1 pt-0.5">
          <div class="flex min-w-[170px] flex-col gap-[3px]">
            <h1 class="text-[21px] font-bold leading-[25px]">마이페이지</h1>
            <p class="text-[10.5px] leading-[13px] text-dm-gray-dark">
              우리의 정보와 연결 설정을 관리해요
            </p>
          </div>
        </header>

        <article
          class="relative h-[98px] overflow-hidden rounded-2xl border border-[#F2EFEE] bg-[linear-gradient(105deg,#FFFFFF_0%,#FFFFFF_49%,#FFF1EF_100%)] p-[18px] shadow-[0_1px_2px_rgba(34,34,43,0.04),0_6px_18px_-8px_rgba(34,34,43,0.14)]"
        >
          <div
            class="absolute -bottom-[45px] -right-[29px] h-28 w-28 rounded-full bg-[#F2EFEF]/30"
            aria-hidden="true"
          />
          <div class="relative z-10 flex h-[60px] items-center gap-[13px]">
            <div
              class="grid h-[60px] w-[60px] place-items-center overflow-hidden rounded-[21px] bg-dm-cb shadow-[inset_0_0_0_5px_rgba(255,255,255,0.58)]"
            >
              <img
                v-if="myPage.user.profileImage"
                :src="myPage.user.profileImage"
                alt=""
                class="h-full w-full object-cover"
              />
              <UserRound
                v-else
                class="h-[26px] w-[26px] text-[#292934]"
                :stroke-width="1.8"
              />
            </div>
            <div class="flex flex-col gap-[3px]">
              <div class="flex items-center gap-1.5">
                <strong class="text-base font-extrabold leading-[19px]">{{
                  myPage.user.name
                }}</strong>
                <span
                  class="rounded-full bg-dm-mint-lighter px-2 py-1 text-[10px] font-extrabold leading-3 text-[#77A0A0] shadow-[0_0.6px_2px_rgba(0,0,0,0.2)]"
                  >{{ roleLabels[myPage.user.role] }}</span
                >
              </div>
              <p class="text-[10.2px] leading-4 text-dm-gray-dark">
                {{ myPage.user.phoneNumber || '전화번호 확인 중' }}
              </p>
            </div>
            <div class="ml-auto">
              <button
                type="button"
                class="h-[31px] rounded-[10px] bg-white px-2.5 text-[10.5px] font-bold leading-[13px] text-dm-co-darker shadow-[0_0.5px_2px_rgba(0,0,0,0.25)]"
                @click="goProfileEdit"
              >
                프로필 설정
              </button>
            </div>
          </div>
        </article>

        <article
          v-if="isPartnerConnected && myPage.partner"
          class="flex h-[66px] items-center gap-2.5 rounded-[15px] bg-dm-cb-light px-3.5 py-3"
        >
          <div class="grid h-[39px] w-[39px] place-items-center rounded-full bg-white">
            <UserRound
              class="h-[15px] w-[15px] text-[#292934]"
              :stroke-width="2"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <strong class="text-xs font-bold leading-[15px]">{{ myPage.partner.name }}</strong>
              <span
                class="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold leading-3 text-btn-pk shadow-[0_0.6px_3px_rgba(0,0,0,0.2)]"
                >{{ roleLabels[myPage.partner.role] }}</span
              >
            </div>
            <p class="mt-[5px] text-[9.5px] leading-[11px] text-dm-gray-dark">
              {{ myPage.partner.connectedSince }}부터 함께 관리 중
            </p>
          </div>
          <span
            class="rounded-full bg-dm-mint-light px-2 py-1 text-[10px] font-extrabold leading-3 text-[#77A0A0]"
            >{{ connectionStatusLabels[myPage.partner.status] }}</span
          >
        </article>
        <button
          v-else
          type="button"
          class="flex h-[34px] items-center justify-between rounded-[10px] bg-btn-mt-dark px-3.5 text-[10.5px] font-extrabold leading-[13px] text-white shadow-[0_1px_2px_rgba(34,34,43,0.04)]"
          @click="goCoupleConnect"
        >
          <span>상대와 연결하기</span>
          <ChevronRight
            class="h-[17px] w-[17px]"
            :stroke-width="2.2"
          />
        </button>

        <section class="flex flex-col gap-2 pt-1">
          <div class="flex h-[19px] items-end justify-between px-0.5">
            <h2 class="text-[13px] font-bold leading-4">카드 · 계좌 연결</h2>
            <span class="text-[9.5px] leading-[11px] text-dm-gray-dark"
              >연결된 자산을 관리해요</span
            >
          </div>
          <div
            class="h-[106px] rounded-2xl border border-[#E9E9F0] bg-white p-4 shadow-[0_1px_2px_rgba(34,34,43,0.04),0_6px_18px_-8px_rgba(34,34,43,0.14)]"
          >
            <div class="flex h-[72px] gap-2">
              <button
                v-for="item in assetSummaries"
                :key="item.id"
                type="button"
                class="flex flex-1 items-center gap-[10px] rounded-xl bg-dm-mint-light p-2.5 text-left first:bg-[#E6F2F1] px-5"
                @click="goAssetConnect(item.id)"
              >
                <component
                  :is="item.icon"
                  class="h-6 w-6 shrink-0 text-dm-mint-darker font-thin"
                  :stroke-width="1.4"
                />
                <span class="flex min-w-0 flex-1 flex-col">
                  <span class="text-[10px] leading-[13px] text-btn-mt-darker font-medium">{{
                    item.label
                  }}</span>
                  <div class="flex flex-row">
                    <strong class="text-[12.9px] font-bold leading-4 text-btn-mt-darker">{{
                      item.count
                    }}</strong>
                    <span class="text-[12.9px] font-bold leading-4 text-btn-mt-darker">개</span>
                  </div>
                </span>
                <ChevronRight
                  class="h-6 w-6 shrink-0 text-dm-mint-darker"
                  :stroke-width="1.4"
                />
              </button>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-2 pt-1">
          <div class="flex h-[19px] items-end justify-between px-0.5">
            <h2 class="text-[13px] font-bold leading-4">상대 공유 범위</h2>
            <span class="text-[9.5px] leading-[11px] text-dm-gray-dark">{{
              myPage.shareSetting.statusText
            }}</span>
          </div>
          <div
            class="flex h-[141px] flex-col justify-center gap-[9px] rounded-2xl border border-[#E9E9F0] bg-white px-4 py-[15px] shadow-[0_1px_2px_rgba(34,34,43,0.04),0_6px_18px_-8px_rgba(34,34,43,0.14)]"
          >
            <p class="text-[11.5px] font-bold leading-[18px] text-[#5A5B69]">
              파트너에게 내 금융정보를 어디까지 보여줄까요?
            </p>
            <div class="flex h-[39px] rounded-xl bg-[#F5F5F9] px-1 pb-1 pt-1.5">
              <button
                v-for="option in shareOptions"
                :key="option.value"
                type="button"
                class="flex flex-1 items-center justify-center rounded-[9px] text-[9.5px] font-bold leading-[11px] disabled:cursor-wait"
                :class="
                  myPage.shareSetting.selectedScope === option.value
                    ? 'bg-white text-dm-co-darker shadow-[0_2px_8px_rgba(82,55,64,0.08)]'
                    : 'text-dm-gray-dark'
                "
                :disabled="isUpdatingShare"
                @click="handleShareToggle(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
            <p
              class="flex h-[32px] items-center justify-center rounded-[10px] bg-dm-mint-light px-2.5 text-center text-[9.5px] leading-[14px] text-[#606D6D]"
            >
              {{ selectedShareCaption }}
            </p>
          </div>
        </section>

        <button
          type="button"
          class="h-[52px] w-full shrink-0 rounded-[12px] border border-[#E9E9F0] bg-white text-xs font-bold leading-3 text-dm-gray-dark"
          @click="handleLogout"
        >
          로그아웃
        </button>
        <p class="text-center text-[8.7px] leading-[11px] text-[#B5AAAE]">
          {{ myPage.appVersion }}
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.mypage-stage {
  container-type: inline-size;
  --mypage-scale: calc(100cqw / 390px);
}
</style>
