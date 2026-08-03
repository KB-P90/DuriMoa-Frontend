<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ArrowLeft } from '@lucide/vue';
import AccountConnectionForm from '@/components/common/AccountConnectionForm.vue';
import { useAssetConnectionStore } from '@/stores/assetConnectionStore';

const router = useRouter();
const assetConnectionStore = useAssetConnectionStore();
const { accountForm, isLoadingAccount } = storeToRefs(assetConnectionStore);

const bank = computed({
  get: () => accountForm.value.selectedProvider,
  set: (selectedProvider: string) => {
    accountForm.value = { ...accountForm.value, selectedProvider };
  },
});

const internetBankingId = computed({
  get: () => accountForm.value.loginId,
  set: (loginId: string) => {
    accountForm.value = { ...accountForm.value, loginId };
  },
});

const internetBankingPassword = computed({
  get: () => accountForm.value.loginPassword,
  set: (loginPassword: string) => {
    accountForm.value = { ...accountForm.value, loginPassword };
  },
});

const canSubmit = computed(
  () =>
    bank.value.length > 0 &&
    internetBankingId.value.trim().length > 0 &&
    internetBankingPassword.value.length > 0 &&
    !isLoadingAccount.value
);

onMounted(() => {
  void assetConnectionStore.fetchAccountConnectionForm();
});
</script>

<template>
  <div class="account-stage aspect-[390/520] w-full md:aspect-auto md:min-h-[520px]">
    <section class="absolute inset-0 origin-top-left h-[520px] w-[390px] overflow-hidden rounded-[30px] bg-white font-[Pretendard,Inter,sans-serif] text-[#292934] shadow-[0_20px_50px_-18px_rgba(34,34,43,0.28),0_0_0_1px_rgba(34,34,43,0.06)] scale-[var(--account-scale)] md:relative md:h-auto md:min-h-[520px] md:w-full md:scale-100 md:overflow-visible md:rounded-none md:shadow-none">
      <header class="flex h-[50px] items-center gap-3 border-b border-[#F5F5F9] px-5">
        <button type="button" aria-label="뒤로가기" class="grid h-6 w-6 place-items-center" @click="router.back()">
          <ArrowLeft class="h-[17px] w-[17px]" :stroke-width="2" />
        </button>
        <h1 class="text-[15px] font-extrabold leading-[18px]">은행연결</h1>
      </header>

      <main class="px-5 pb-5 pt-4">
        <AccountConnectionForm
          v-model:bank="bank"
          v-model:internet-banking-id="internetBankingId"
          v-model:internet-banking-password="internetBankingPassword"
          form-id-prefix="mypage-account"
          :helper-text="accountForm.helperText"
          :password-entered-message="accountForm.passwordMessage"
          :disabled="isLoadingAccount"
        />

        <button
          type="button"
          class="mt-5 h-[52px] w-full rounded-[12px] bg-btn-pk text-[14px] font-extrabold text-white shadow-[0_6px_14px_rgba(255,143,132,0.24)] disabled:bg-dm-gray"
          :disabled="!canSubmit"
        >
          은행 선택하기
        </button>
      </main>
    </section>
  </div>
</template>

<style scoped>
.account-stage {
  container-type: inline-size;
  --account-scale: calc(100cqw / 390px);
}
</style>
