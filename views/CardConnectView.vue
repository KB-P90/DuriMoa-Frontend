<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ArrowLeft, ChevronDown } from '@lucide/vue';
import { useAssetConnectionStore } from '@/stores/assetConnectionStore';

const router = useRouter();
const assetConnectionStore = useAssetConnectionStore();
const { cardForm } = storeToRefs(assetConnectionStore);

onMounted(() => {
  void assetConnectionStore.fetchCardConnectionForm();
});
</script>

<template>
  <div class="card-stage aspect-[390/460] w-full md:aspect-auto md:min-h-[460px]">
    <section class="absolute inset-0 origin-top-left h-[460px] w-[390px] overflow-hidden rounded-[30px] bg-white font-[Pretendard,Inter,sans-serif] text-[#292934] shadow-[0_20px_50px_-18px_rgba(34,34,43,0.28),0_0_0_1px_rgba(34,34,43,0.06)] scale-[var(--card-scale)] md:relative md:h-auto md:min-h-[460px] md:w-full md:scale-100 md:overflow-visible md:rounded-none md:shadow-none">
      <header class="flex h-[50px] items-center gap-3 border-b border-[#F5F5F9] px-5">
        <button type="button" aria-label="뒤로가기" class="grid h-6 w-6 place-items-center" @click="router.back()">
          <ArrowLeft class="h-[17px] w-[17px]" :stroke-width="2" />
        </button>
        <h1 class="text-[15px] font-extrabold leading-[18px]">카드연결</h1>
      </header>

      <main class="flex flex-col gap-[14px] px-5 pb-5 pt-4">
        <label class="flex flex-col gap-[8px]">
          <span class="text-[11px] font-bold leading-[13px] text-[#5A5B69]">카드사 선택</span>
          <button type="button" class="flex h-[48px] items-center justify-between rounded-[11px] border border-[#E9E9F0] bg-white px-[14px] text-left text-[12px] font-bold">
            {{ cardForm.selectedProvider }}
            <ChevronDown class="h-5 w-5 text-black" :stroke-width="2" />
          </button>
        </label>

        <label class="flex flex-col gap-[8px]">
          <span class="text-[11px] font-bold leading-[13px] text-[#5A5B69]">카드사 로그인 아이디</span>
          <input :value="cardForm.loginId" type="text" class="h-[42px] rounded-[11px] border border-[#E9E9F0] bg-white px-[14px] text-[10.5px] font-bold outline-none" />
          <span class="text-[9.5px] leading-[11px] text-dm-gray-dark">{{ cardForm.helperText }}</span>
        </label>

        <label class="flex flex-col gap-[8px]">
          <span class="text-[11px] font-bold leading-[13px] text-[#5A5B69]">카드사 로그인 비밀번호</span>
          <input :value="cardForm.loginPassword" type="password" class="h-[42px] rounded-[11px] border border-[#E9E9F0] bg-white px-[14px] text-[10.5px] font-bold outline-none" />
          <span class="text-[9.5px] leading-[11px] text-btn-mt-dark">{{ cardForm.passwordMessage }}</span>
        </label>

        <button type="button" class="mt-1 h-[52px] rounded-[12px] bg-btn-pk text-[14px] font-extrabold text-white shadow-[0_6px_14px_rgba(255,143,132,0.24)]">
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
