<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/common/PageHeader.vue';
import { ONBOARDING_ROUTE_NAMES } from '@/constants/onboard';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useLinkedAssetStore } from '@/stores/linkedAssetStore';

useAuthCheck();

const router = useRouter();
const linkedAssetStore = useLinkedAssetStore();
const { assets, isLoading, lastErrorMessage } = storeToRefs(linkedAssetStore);

function goToAssetOnboarding() {
  router.push({ name: ONBOARDING_ROUTE_NAMES.ONBOARDING, query: { screen: 'account' } });
}

function goBackToMyPage() {
  router.push({ name: 'myinfo' });
}

onMounted(() => {
  void linkedAssetStore.fetchLinkedAssets();
});
</script>

<template>
  <div class="flex min-h-full w-full flex-1 flex-col">
    <section class="flex min-h-full w-full flex-1 flex-col bg-white text-foreground">
      <PageHeader
        title="카드 연결"
        :on-back="goBackToMyPage"
      />

      <main class="flex flex-1 flex-col px-3 pt-5">
        <p class="px-1 text-xs font-medium leading-5 text-dm-gray-dark">
          본 서비스에서 사용하는 카드입니다.
        </p>

        <ul
          v-if="assets.cards.length > 0"
          aria-label="연결된 카드 목록"
          class="mt-5 overflow-hidden rounded-2xl border border-divider bg-white shadow-[0_6px_18px_-12px_rgba(34,34,43,0.18)]"
        >
          <li
            v-for="card in assets.cards"
            :key="card.id"
            class="flex min-h-[92px] items-center gap-5 border-b border-divider px-4 py-4 last:border-b-0"
          >
            <img
              :src="card.image"
              :alt="`${card.company} ${card.cardName}`"
              class="h-[68px] w-[112px] shrink-0 rounded-lg object-cover shadow-[0_4px_6px_rgba(34,34,43,0.14)]"
            />
            <span class="min-w-0">
              <strong class="block truncate text-sm font-extrabold leading-5">{{
                card.cardName
              }}</strong>
              <span class="block text-[10px] leading-4 text-dm-gray-dark">{{ card.company }}</span>
            </span>
          </li>
        </ul>
        <section
          v-else
          aria-label="연결된 카드 없음"
          class="mt-5 flex min-h-[92px] items-center rounded-2xl border border-divider bg-white px-4 text-sm font-medium text-dm-gray-dark shadow-[0_6px_18px_-12px_rgba(34,34,43,0.18)]"
        >
          {{
            isLoading ? '카드를 불러오는 중이에요.' : lastErrorMessage || '연결된 카드가 없어요.'
          }}
        </section>

        <button
          type="button"
          class="sticky bottom-0 z-10 mt-auto h-[52px] w-full rounded-t-xl bg-brand text-sm font-extrabold text-white shadow-[0_-6px_18px_rgba(34,34,43,0.12)] active:bg-brand-dark cursor-pointer"
          @click="goToAssetOnboarding"
        >
          카드 추가하기
        </button>
      </main>
    </section>
  </div>
</template>
