<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ArrowLeft, Camera, UserRound } from '@lucide/vue';
import { useMyPageStore } from '@/stores/myPageStore';
import type { CoupleRole, MyPageProfileForm } from '@/types/myPage';

const router = useRouter();
const myPageStore = useMyPageStore();
const { isSavingProfile, isUploadingImage, myPage } = storeToRefs(myPageStore);

const fileInput = ref<HTMLInputElement | null>(null);
const form = ref<MyPageProfileForm>(myPageStore.buildProfileForm());

const roleOptions: readonly { value: CoupleRole; label: string }[] = [
  { value: 'GROOM', label: '🤵 신랑' },
  { value: 'BRIDE', label: '👰 신부' },
] as const;

const isPasswordMatched = computed(
  () => form.value.newPassword !== '' && form.value.newPassword === form.value.newPasswordConfirm
);

const canSave = computed(
  () =>
    form.value.name.trim().length > 0 &&
    (!form.value.newPassword || form.value.newPassword === form.value.newPasswordConfirm) &&
    !isSavingProfile.value
);

watch(
  () => myPage.value.user.id,
  () => {
    form.value = myPageStore.buildProfileForm();
  }
);

function openFilePicker() {
  fileInput.value?.click();
}

async function handleImageSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  await myPageStore.uploadProfileImage(file);
  target.value = '';
}

function resetDefaultImage() {
  myPage.value.user.profileImage = null;
}

async function saveProfile() {
  if (!canSave.value) {
    return;
  }

  await myPageStore.saveProfile(form.value);
  router.push({ name: 'myinfo' });
}

onMounted(() => {
  void myPageStore.fetchMyPage();
});
</script>

<template>
  <div class="profile-stage aspect-[390/799] w-full md:aspect-auto md:min-h-[799px]">
    <section class="absolute inset-0 origin-top-left h-[799px] w-[390px] overflow-hidden bg-white font-[Pretendard,Inter,sans-serif] text-[#292934] scale-[var(--profile-scale)] md:relative md:h-auto md:min-h-[799px] md:w-full md:scale-100 md:overflow-visible">
      <header class="flex h-[50px] items-center justify-between px-5">
        <div class="flex items-center gap-3">
          <button type="button" aria-label="뒤로가기" class="grid h-6 w-6 place-items-center" @click="router.back()">
            <ArrowLeft class="h-[17px] w-[17px]" :stroke-width="2" />
          </button>
          <h1 class="text-[15px] font-extrabold leading-[18px]">프로필 수정</h1>
        </div>
        <button type="button" class="text-[10.5px] font-bold leading-[13px] text-btn-pk" :disabled="!canSave" @click="saveProfile">저장</button>
      </header>

      <main class="h-[749px] overflow-y-auto bg-gradient-to-b from-white to-[#FFFBFC] px-[24px] pb-6">
        <section class="flex flex-col items-center pb-6 pt-5">
          <div class="relative">
            <div class="grid h-[92px] w-[92px] place-items-center overflow-hidden rounded-full bg-dm-cb">
              <img v-if="myPage.user.profileImage" :src="myPage.user.profileImage" alt="" class="h-full w-full object-cover" />
              <UserRound v-else class="h-9 w-9 text-[#292934]" :stroke-width="1.8" />
            </div>
            <button type="button" aria-label="프로필 사진 변경" class="absolute bottom-1 right-0 grid h-[29px] w-[29px] place-items-center rounded-full border-[3px] border-white bg-[#98A2A4] text-white shadow-[0_2px_6px_rgba(34,34,43,0.16)]" :disabled="isUploadingImage" @click="openFilePicker">
              <Camera class="h-3.5 w-3.5" :stroke-width="2.2" />
            </button>
            <input ref="fileInput" class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" @change="handleImageSelected" />
          </div>
          <div class="mt-[14px] flex gap-2">
            <button type="button" class="h-[28px] rounded-full bg-[#FFF8F8] px-3 text-[10px] font-bold leading-3 text-dm-co-darker" @click="openFilePicker">사진 선택</button>
            <button type="button" class="h-[28px] rounded-full bg-[#FFF8F8] px-3 text-[10px] font-bold leading-3 text-dm-co-darker" @click="resetDefaultImage">기본 이미지</button>
          </div>
          <p class="mt-[10px] text-[9.5px] leading-[11px] text-dm-gray-dark">jpg · png · webp / 5MB 이하</p>
        </section>

        <section class="flex flex-col gap-[15px]">
          <label class="flex flex-col gap-[8px]">
            <span class="text-[11px] font-bold leading-[13px] text-[#5A5B69]">이름</span>
            <input v-model="form.name" type="text" class="h-[44px] rounded-[11px] border border-[#E9E9F0] bg-white px-[14px] text-[12px] font-bold outline-none" />
          </label>

          <div class="flex flex-col gap-[8px]">
            <span class="text-[11px] font-bold leading-[13px] text-[#5A5B69]">역할</span>
            <div class="grid h-[36px] grid-cols-2 rounded-[10px] bg-dm-cb-light p-[3px]">
              <button
                v-for="role in roleOptions"
                :key="role.value"
                type="button"
                class="rounded-[8px] text-[10.5px] font-bold leading-[13px]"
                :class="form.role === role.value ? 'bg-white text-btn-pk shadow-[0_2px_8px_rgba(82,55,64,0.08)]' : 'text-dm-gray-dark'"
                @click="form.role = role.value"
              >
                {{ role.label }}
              </button>
            </div>
            <p class="text-[9.5px] leading-[11px] text-dm-gray-dark">화면 전체에 표시되는 역할이에요</p>
          </div>

          <label class="flex flex-col gap-[8px]">
            <span class="text-[11px] font-bold leading-[13px] text-[#5A5B69]">전화번호</span>
            <div class="flex gap-2">
              <input v-model="form.phoneNumber" type="tel" class="h-[44px] min-w-0 flex-1 rounded-[11px] border border-[#E9E9F0] bg-white px-[14px] text-[12px] font-bold outline-none" />
              <button type="button" class="h-[44px] w-[50px] rounded-[11px] border border-[#E9E9F0] bg-white text-[10.5px] font-bold text-btn-pk">인증</button>
            </div>
            <p class="text-[9.5px] leading-[11px] text-btn-mt-dark">✓ 인증된 번호예요</p>
          </label>
        </section>

        <section class="mt-6 rounded-2xl bg-[#FFF8F8] px-[18px] py-[17px]">
          <div class="mb-[18px] flex items-center justify-between">
            <h2 class="text-[13px] font-extrabold leading-4">비밀번호 변경</h2>
            <span class="rounded-full bg-white px-3 py-1 text-[9.5px] font-bold leading-[11px] text-dm-gray-dark">선택</span>
          </div>
          <div class="flex flex-col gap-[14px]">
            <label class="flex flex-col gap-[7px]">
              <span class="text-[10.5px] font-bold leading-[13px] text-[#5A5B69]">현재 비밀번호</span>
              <input v-model="form.currentPassword" type="password" class="h-[39px] rounded-[10px] border border-[#E9E9F0] bg-white px-[14px] text-[10.5px] font-bold outline-none" />
            </label>
            <label class="flex flex-col gap-[7px]">
              <span class="text-[10.5px] font-bold leading-[13px] text-[#5A5B69]">새 비밀번호</span>
              <input v-model="form.newPassword" type="password" class="h-[39px] rounded-[10px] border border-[#E9E9F0] bg-white px-[14px] text-[10.5px] font-bold outline-none" />
              <span class="text-[9.5px] leading-[11px] text-dm-gray-dark">영문·숫자·특수문자 포함 8자 이상</span>
            </label>
            <label class="flex flex-col gap-[7px]">
              <span class="text-[10.5px] font-bold leading-[13px] text-[#5A5B69]">새 비밀번호 확인</span>
              <input v-model="form.newPasswordConfirm" type="password" class="h-[39px] rounded-[10px] border border-[#E9E9F0] bg-white px-[14px] text-[10.5px] font-bold outline-none" />
              <span v-if="isPasswordMatched" class="text-[9.5px] leading-[11px] text-btn-mt-dark">✓ 비밀번호가 일치해요</span>
            </label>
          </div>
        </section>

        <div class="mt-6 flex flex-col gap-3">
          <button type="button" class="h-[50px] rounded-[12px] bg-btn-pk text-[14px] font-extrabold text-white shadow-[0_6px_14px_rgba(255,143,132,0.26)] disabled:bg-dm-gray" :disabled="!canSave" @click="saveProfile">
            저장하기
          </button>
          <button type="button" class="h-[44px] rounded-[12px] border border-[#E9E9F0] bg-white text-[13px] font-bold text-btn-pk" @click="router.back()">
            취소
          </button>
        </div>
      </main>
    </section>
  </div>
</template>

<style scoped>
.profile-stage {
  container-type: inline-size;
  --profile-scale: calc(100cqw / 390px);
}
</style>
