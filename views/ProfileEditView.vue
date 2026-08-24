<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Camera, UserRound } from '@lucide/vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { toast } from 'vue-sonner';
import { useAuthCheck } from '@/composables/useAuthCheck';
import { useMyPageStore } from '@/stores/myPageStore';
import { checkPhoneAvailability } from '@/server/myPageApi';
import { formatPhoneNumber } from '@/utils/format';
import type { CoupleRole, MyPageProfileForm } from '@/types/myPage';

// 백엔드 요청 크기 제한(파일당 5MB)과 동일하게 맞춘 값
const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

useAuthCheck();

const router = useRouter();
const myPageStore = useMyPageStore();
const { isSavingProfile, myPage } = storeToRefs(myPageStore);

const fileInput = ref<HTMLInputElement | null>(null);
const form = ref<MyPageProfileForm | null>(myPageStore.buildProfileForm());
const selectedImageFile = ref<File | null>(null);
const imageRemoved = ref(false);
let previewObjectUrl: string | null = null;

type PhoneCheckState = 'idle' | 'checking' | 'available' | 'unavailable';
const phoneCheckState = ref<PhoneCheckState>('idle');

const roleOptions: readonly { value: CoupleRole; label: string }[] = [
  { value: 'GROOM', label: '🤵 신랑' },
  { value: 'BRIDE', label: '👰 신부' },
] as const;

const isPasswordMatched = computed(
  () =>
    Boolean(form.value?.newPassword) && form.value?.newPassword === form.value?.newPasswordConfirm
);

const canSave = computed(
  () =>
    form.value !== null &&
    form.value.name.trim().length > 0 &&
    (!form.value.newPassword ||
      (form.value.newPassword === form.value.newPasswordConfirm &&
        form.value.currentPassword.trim().length > 0)) &&
    !isSavingProfile.value
);

watch(
  () => myPage.value?.user.id,
  () => {
    form.value = myPageStore.buildProfileForm();
  }
);

watch(
  () => form.value?.phoneNumber,
  () => {
    phoneCheckState.value = 'idle';
  }
);

function openFilePicker() {
  fileInput.value?.click();
}

function handlePhoneInput(event: Event) {
  if (!form.value) {
    return;
  }

  const input = event.target;
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const formattedPhone = formatPhoneNumber(input.value);
  form.value.phoneNumber = formattedPhone;
  input.value = formattedPhone;
}

function setPreview(url: string | null) {
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
  }
  previewObjectUrl = url;
}

function handleImageSelected(event: Event) {
  if (!myPage.value) {
    return;
  }

  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    toast.error('프로필 이미지는 5MB 이하만 업로드할 수 있어요.');
    target.value = '';
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  setPreview(objectUrl);
  selectedImageFile.value = file;
  imageRemoved.value = false;
  myPage.value.user.profileImage = objectUrl;
  target.value = '';
}

function resetDefaultImage() {
  if (!myPage.value) {
    return;
  }

  setPreview(null);
  selectedImageFile.value = null;
  imageRemoved.value = true;
  myPage.value.user.profileImage = null;
}

async function checkPhone() {
  if (!form.value || !form.value.phoneNumber.trim()) {
    return;
  }

  phoneCheckState.value = 'checking';

  try {
    const available = await checkPhoneAvailability(form.value.phoneNumber);
    phoneCheckState.value = available ? 'available' : 'unavailable';
  } catch {
    phoneCheckState.value = 'idle';
    toast.error('전화번호 확인에 실패했어요. 다시 시도해주세요.');
  }
}

async function saveProfile() {
  if (!canSave.value || !form.value) {
    return;
  }

  const success = await myPageStore.saveProfile(
    form.value,
    selectedImageFile.value,
    imageRemoved.value
  );

  if (success) {
    router.push({ name: 'myinfo' });
    return;
  }

  toast.error(myPageStore.lastErrorMessage);
}

onMounted(() => {
  void myPageStore.fetchMyPage();
});

onUnmounted(() => {
  setPreview(null);
});
</script>

<template>
  <div class="flex min-h-full flex-col bg-white">
    <PageHeader title="프로필 수정" />

    <main
      v-if="myPage && form"
      class="flex-1 overflow-y-auto scrollbar-none px-4 py-5 md:px-10 md:py-6"
    >
      <section class="flex flex-col items-center pb-6 pt-5">
        <div class="relative">
          <div
            class="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-dm-gray-light md:h-28 md:w-28"
          >
            <img
              v-if="myPage.user.profileImage"
              :src="myPage.user.profileImage"
              alt=""
              class="h-full w-full object-cover"
            />
            <UserRound
              v-else
              class="h-9 w-9 text-dm-gray-dark"
              :stroke-width="1.8"
            />
          </div>
          <button
            type="button"
            aria-label="프로필 사진 변경"
            class="absolute bottom-1 right-0 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-dm-gray-dark text-white shadow-[0_2px_6px_rgba(34,34,43,0.16)] cursor-pointer"
            :disabled="isSavingProfile"
            @click="openFilePicker"
          >
            <Camera
              class="h-3.5 w-3.5"
              :stroke-width="2.2"
            />
          </button>
          <input
            ref="fileInput"
            class="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="handleImageSelected"
          />
        </div>

        <div class="mt-5 flex gap-2">
          <button
            type="button"
            class="h-7 rounded-full bg-pink-01 px-3 text-xs font-bold leading-3 text-brand cursor-pointer"
            @click="openFilePicker"
          >
            사진 선택
          </button>
          <button
            type="button"
            class="h-7 rounded-full bg-pink-01 px-3 text-xs font-bold leading-3 text-brand cursor-pointer"
            @click="resetDefaultImage"
          >
            기본 이미지
          </button>
        </div>

        <p class="mt-2.5 text-xs leading-4 text-dm-gray-dark">jpg · png · webp / 5MB 이하</p>
      </section>

      <section class="flex flex-col gap-4">
        <label class="flex flex-col gap-2">
          <span class="text-xs font-bold leading-4 text-dm-gray-dark">이름</span>
          <input
            v-model="form.name"
            type="text"
            class="h-11 rounded-xl border border-brand-border bg-white px-4 text-sm font-bold outline-none"
          />
        </label>

        <div class="flex flex-col gap-2">
          <span class="text-xs font-bold leading-4 text-dm-gray-dark">역할</span>
          <div class="grid h-10 grid-cols-2 rounded-xl bg-pink-01 p-1">
            <button
              v-for="role in roleOptions"
              :key="role.value"
              type="button"
              class="rounded-lg text-sm font-bold leading-4 cursor-pointer"
              :class="
                form.role === role.value
                  ? 'bg-white text-brand shadow-[0_2px_8px_rgba(82,55,64,0.08)]'
                  : 'text-dm-gray-dark'
              "
              @click="form.role = role.value"
            >
              {{ role.label }}
            </button>
          </div>
          <p class="text-xs leading-4 text-dm-gray-dark">화면 전체에 표시되는 역할이에요.</p>
        </div>

        <label class="flex flex-col gap-2">
          <span class="text-xs font-bold leading-4 text-dm-gray-dark">전화번호</span>
          <div class="flex gap-2">
            <input
              :value="form.phoneNumber"
              type="tel"
              inputmode="numeric"
              placeholder="010-1234-5678"
              class="h-11 min-w-0 flex-1 rounded-xl border border-brand-border bg-white px-4 text-sm font-bold outline-none"
              @input="handlePhoneInput"
            />
            <button
              type="button"
              class="px-3 shrink-0 rounded-xl border border-brand-border bg-white text-xs font-bold text-brand disabled:text-dm-gray-dark cursor-pointer"
              :disabled="phoneCheckState === 'checking' || !form.phoneNumber.trim()"
              @click="checkPhone"
            >
              {{ phoneCheckState === 'checking' ? '확인 중' : '중복 확인' }}
            </button>
          </div>
          <p
            v-if="phoneCheckState === 'available'"
            class="text-xs leading-4 text-btn-mt-dark"
          >
            ✓ 사용 가능한 번호예요.
          </p>
          <p
            v-else-if="phoneCheckState === 'unavailable'"
            class="text-xs leading-4 text-brand-dark"
          >
            이미 사용 중인 전화번호예요.
          </p>
        </label>
      </section>

      <section class="mt-6 rounded-2xl bg-pink-01 px-4 py-4 md:px-5 md:py-5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-extrabold leading-5">비밀번호 변경</h2>
          <span
            class="rounded-full bg-white px-3 py-1 text-xs font-bold leading-4 text-dm-gray-dark"
          >
            선택
          </span>
        </div>

        <div class="flex flex-col gap-4">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-bold leading-4 text-dm-gray-dark">현재 비밀번호</span>
            <input
              v-model="form.currentPassword"
              type="password"
              class="h-10 rounded-xl border border-brand-border bg-white px-4 text-xs font-bold outline-none"
            />
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-bold leading-4 text-dm-gray-dark">새 비밀번호</span>
            <input
              v-model="form.newPassword"
              type="password"
              class="h-10 rounded-xl border border-brand-border bg-white px-4 text-xs font-bold outline-none"
            />
            <span class="text-xs leading-4 text-dm-gray-dark">
              영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요.
            </span>
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-bold leading-4 text-dm-gray-dark">새 비밀번호 확인</span>
            <input
              v-model="form.newPasswordConfirm"
              type="password"
              class="h-10 rounded-xl border border-brand-border bg-white px-4 text-xs font-bold outline-none"
            />
            <span
              v-if="isPasswordMatched"
              class="text-xs leading-4 text-btn-mt-dark"
            >
              ✓ 비밀번호가 일치해요.
            </span>
          </label>
        </div>
      </section>
    </main>

    <footer
      v-if="myPage && form"
      class="shrink-0 border-t border-divider bg-white/95 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        class="h-12 w-full rounded-xl bg-brand text-sm font-extrabold text-white shadow-[0_6px_14px_rgba(255,143,132,0.26)] disabled:bg-dm-gray cursor-pointer"
        :disabled="!canSave"
        @click="saveProfile"
      >
        저장하기
      </button>
    </footer>

    <div
      v-else
      class="flex flex-1 items-center justify-center px-4 text-center text-sm text-dm-gray-dark"
    >
      {{ myPageStore.lastErrorMessage || '프로필 정보를 불러오는 중이에요.' }}
    </div>
  </div>
</template>
