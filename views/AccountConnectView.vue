<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { Landmark } from '@lucide/vue';
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

onMounted(() => {
  void linkedAssetStore.fetchLinkedAssets();
});
</script>

<template>
  <div class="flex min-h-full w-full flex-1 flex-col">
    <section
      class="flex min-h-full w-full flex-1 flex-col bg-white text-foreground"
    >
      <PageHeader title="계좌 연결" />

      <main class="flex flex-1 flex-col px-3 pt-5">
        <p class="px-1 text-xs font-medium leading-5 text-dm-gray-dark">
          본 서비스에서 사용하는 계좌입니다.
        </p>

        <ul
          v-if="assets.accounts.length > 0"
          aria-label="연결된 계좌 목록"
          class="mt-5 overflow-hidden rounded-2xl border border-divider bg-white shadow-[0_6px_18px_-12px_rgba(34,34,43,0.18)]"
        >
          <li
            v-for="account in assets.accounts"
            :key="account.id"
            class="flex min-h-[92px] items-center gap-5 border-b border-divider px-4 py-4 last:border-b-0"
          >
            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-yellow/10 text-yellow-08" aria-hidden="true">
              <Landmark class="h-5 w-5" :stroke-width="1.8" />
            </span>
            <span class="min-w-0">
              <strong class="block text-sm font-extrabold leading-5">{{ account.accountName }}</strong>
              <span class="block text-[10px] leading-4 text-dm-gray-dark">{{ account.company }} · {{ account.maskedNumber }}</span>
            </span>
          </li>
        </ul>
        <section
          v-else
          aria-label="연결된 계좌 없음"
          class="mt-5 flex min-h-[92px] items-center gap-5 rounded-2xl border border-divider bg-white px-4 text-dm-gray-dark shadow-[0_6px_18px_-12px_rgba(34,34,43,0.18)]"
        >
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-yellow/10 text-yellow-08" aria-hidden="true">
            <Landmark class="h-5 w-5" :stroke-width="1.8" />
          </span>
          <p class="text-sm font-medium">{{ isLoading ? '계좌를 불러오는 중이에요.' : lastErrorMessage || '연결된 계좌가 없어요.' }}</p>
        </section>

        <button
          type="button"
          class="sticky bottom-0 z-10 mt-auto h-[52px] w-full rounded-t-xl bg-brand text-sm font-extrabold text-white shadow-[0_-6px_18px_rgba(34,34,43,0.12)] active:bg-brand-dark"
          @click="goToAssetOnboarding"
        >
          계좌 추가하기
        </button>
      </main>
    </section>
  </div>
</template>
