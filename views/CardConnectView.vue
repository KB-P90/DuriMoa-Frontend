<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import AccountConnectionForm from '@/components/common/AccountConnectionForm.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useAssetConnectionStore } from '@/stores/assetConnectionStore';

const CARD_PROVIDER_OPTIONS = ['신한카드', 'KB국민카드', '삼성카드', '현대카드'] as const;

useAuthCheck();

const assetConnectionStore = useAssetConnectionStore();
const { cardForm, isLoadingCard } = storeToRefs(assetConnectionStore);

const cardCompany = computed({
  get: () => cardForm.value.selectedProvider,
  set: (selectedProvider: string) => {
    cardForm.value = { ...cardForm.value, selectedProvider };
  },
});

const cardLoginId = computed({
  get: () => cardForm.value.loginId,
  set: (loginId: string) => {
    cardForm.value = { ...cardForm.value, loginId };
  },
});

const cardLoginPassword = computed({
  get: () => cardForm.value.loginPassword,
  set: (loginPassword: string) => {
    cardForm.value = { ...cardForm.value, loginPassword };
  },
});

const canSubmit = computed(
  () =>
    cardCompany.value.length > 0 &&
    cardLoginId.value.trim().length > 0 &&
    cardLoginPassword.value.length > 0 &&
    !isLoadingCard.value
);

onMounted(() => {
  void assetConnectionStore.fetchCardConnectionForm();
});
</script>

<template>
  <div class="card-stage relative aspect-[390/520] w-full md:aspect-auto md:min-h-[520px]">
    <section
      class="absolute inset-0 origin-top-left h-[520px] w-[390px] overflow-hidden rounded-[30px] bg-white text-[#292934] shadow-[0_20px_50px_-18px_rgba(34,34,43,0.28),0_0_0_1px_rgba(34,34,43,0.06)] scale-[var(--card-scale)] md:relative md:h-auto md:min-h-[520px] md:w-full md:scale-100 md:overflow-visible md:rounded-none md:shadow-none"
    >
      <PageHeader title="카드연결" />

      <main class="p-4">
        <AccountConnectionForm
          v-model:bank="cardCompany"
          v-model:internet-banking-id="cardLoginId"
          v-model:internet-banking-password="cardLoginPassword"
          form-id-prefix="myinfo-card"
          provider-label="카드사 선택"
          id-label="카드사 로그인 아이디"
          id-placeholder="카드사 로그인 아이디"
          password-label="카드사 로그인 비밀번호"
          password-placeholder="카드사 로그인 비밀번호"
          :helper-text="cardForm.helperText"
          :password-entered-message="cardForm.passwordMessage"
          :provider-options="CARD_PROVIDER_OPTIONS"
          :disabled="isLoadingCard"
        />

        <button
          type="button"
          class="mt-5 h-[52px] w-full rounded-[12px] bg-brand text-[14px] font-extrabold text-white shadow-[0_6px_14px_rgba(255,143,132,0.24)] disabled:bg-dm-gray"
          :disabled="!canSubmit"
        >
          카드사 선택하기
        </button>
      </main>
    </section>
  </div>
</template>

<style scoped>
.card-stage {
  container-type: inline-size;
  --card-scale: calc(100cqw / 390px);
}
</style>
