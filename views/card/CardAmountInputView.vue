<script setup lang="ts">
import { useRouter } from 'vue-router';
import CardAmountForm from '@/components/card/CardAmountForm.vue';
import CardSecurityNotice from '@/components/card/CardSecurityNotice.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { useCardStore } from '@/stores/cardStore';

const router = useRouter();
const cardStore = useCardStore();

function handleBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'card' });
  }
}

async function handleSubmit() {
  if (!cardStore.isValidAmount) return;
  await cardStore.applyCustomAmount();
  router.push({ name: 'card' });
}
</script>

<template>
  <div class="mx-auto w-full max-w-4xl bg-white">
    <PageHeader
      title="결제 금액 입력"
      :on-back="handleBack"
      :showBack="true"
    />

    <div class="p-4">
      <!-- Main Title Banner Section -->
      <section class="mb-8 text-center">
        <span class="text-xs font-bold tracking-wider text-brand uppercase"> PAYMENT AMOUNT </span>
        <h2 class="mt-2 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
          결제할 금액을<br />
          입력해 주세요
        </h2>
        <p class="mt-3 text-xs font-medium text-dm-gray-dark sm:text-sm">
          입력한 금액을 기준으로 카드별 예상 혜택을 비교해 드려요.
        </p>
      </section>

      <!-- Amount Input Form Component -->
      <section class="mb-6">
        <CardAmountForm
          v-model:amount="cardStore.amount"
          :is-valid="cardStore.isValidAmount"
          :min-amount="cardStore.MIN_AMOUNT"
          @add-amount="cardStore.addAmount"
          @reset="cardStore.setAmount(0)"
          @submit="handleSubmit"
        />
      </section>

      <!-- Security Notice Component -->
      <section>
        <CardSecurityNotice />
      </section>
    </div>
  </div>
</template>
