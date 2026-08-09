<script setup lang="ts">
import { computed } from 'vue';
import { Check, ChevronDown, Landmark } from '@lucide/vue';
import { ONBOARDING_BANK_OPTIONS } from '@/constants/onboard';

const defaultProviderOptions = ONBOARDING_BANK_OPTIONS.map((bankOption) => bankOption.label);

const props = withDefaults(
  defineProps<{
    connectionErrorMessage?: string;
    disabled?: boolean;
    formIdPrefix?: string;
    helperText?: string;
    idLabel?: string;
    idPlaceholder?: string;
    passwordEnteredMessage?: string;
    passwordLabel?: string;
    passwordPlaceholder?: string;
    providerLabel?: string;
    providerOptions?: readonly string[];
  }>(),
  {
    connectionErrorMessage: '',
    disabled: false,
    formIdPrefix: 'account-connection',
    helperText: '',
    idLabel: '인터넷뱅킹 아이디',
    idPlaceholder: '인터넷뱅킹 아이디',
    passwordEnteredMessage: '비밀번호가 입력되었어요',
    passwordLabel: '인터넷뱅킹 비밀번호',
    passwordPlaceholder: '인터넷뱅킹 비밀번호',
    providerLabel: '은행 선택',
  }
);

const emit = defineEmits<{
  submit: [];
}>();

const bank = defineModel<string>('bank', { required: true });
const internetBankingId = defineModel<string>('internetBankingId', {
  required: true,
});
const internetBankingPassword = defineModel<string>('internetBankingPassword', {
  required: true,
});

const normalizedProviderOptions = computed(() => props.providerOptions ?? defaultProviderOptions);
</script>

<template>
  <form
    class="space-y-4"
    aria-label="자산 연결"
    @submit.prevent="emit('submit')"
  >
    <div>
      <label
        class="mb-2 block text-[12px] font-extrabold"
        :for="`${formIdPrefix}-provider`"
      >
        {{ providerLabel }}
      </label>
      <div class="relative">
        <Landmark
          class="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand"
          :stroke-width="1.8"
          aria-hidden="true"
        />
        <select
          :id="`${formIdPrefix}-provider`"
          v-model="bank"
          class="h-[52px] w-full appearance-none rounded-[13px] border border-dm-gray/35 bg-dm-gray-light pl-11 pr-11 text-[14px] font-bold outline-none transition focus:border-pink-03 focus:ring-3 focus:ring-brand/10"
          name="provider"
          :disabled="disabled"
        >
          <option
            v-for="providerOption in normalizedProviderOptions"
            :key="providerOption"
            :value="providerOption"
          >
            {{ providerOption }}
          </option>
        </select>
        <ChevronDown
          class="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-dm-gray-dark"
          :stroke-width="1.8"
          aria-hidden="true"
        />
      </div>
    </div>

    <div>
      <label
        class="mb-2 block text-[12px] font-extrabold"
        :for="`${formIdPrefix}-login-id`"
      >
        {{ idLabel }}
      </label>
      <input
        :id="`${formIdPrefix}-login-id`"
        v-model="internetBankingId"
        class="h-[52px] w-full rounded-[13px] border border-dm-gray/35 bg-dm-gray-light px-4 text-[14px] font-semibold outline-none transition focus:border-pink-03 focus:ring-3 focus:ring-brand/10"
        name="loginId"
        type="text"
        autocomplete="username"
        :placeholder="idPlaceholder"
        :disabled="disabled"
      />
      <span
        v-if="helperText"
        class="mt-2 block text-[9.5px] leading-[11px] text-dm-gray-dark"
      >
        {{ helperText }}
      </span>
    </div>

    <div>
      <label
        class="mb-2 block text-[12px] font-extrabold"
        :for="`${formIdPrefix}-login-password`"
      >
        {{ passwordLabel }}
      </label>
      <input
        :id="`${formIdPrefix}-login-password`"
        v-model="internetBankingPassword"
        class="h-[52px] w-full rounded-[13px] border border-dm-gray/35 bg-dm-gray-light px-4 text-[14px] font-semibold outline-none transition focus:border-pink-03 focus:ring-3 focus:ring-brand/10"
        name="loginPassword"
        type="password"
        autocomplete="current-password"
        :placeholder="passwordPlaceholder"
        :disabled="disabled"
      />
      <p
        v-if="internetBankingPassword.length > 0"
        class="mt-2 flex items-center gap-1 text-[11px] text-btn-mt-dark"
      >
        <Check
          class="h-3.5 w-3.5"
          :stroke-width="2"
          aria-hidden="true"
        />
        {{ passwordEnteredMessage }}
      </p>
      <p
        v-if="connectionErrorMessage"
        class="mt-2 text-[11px] leading-4 text-brand-dark"
        role="alert"
      >
        {{ connectionErrorMessage }}
      </p>
    </div>

    <button
      class="sr-only"
      type="submit"
      :disabled="disabled"
    >
      연결 조회
    </button>
  </form>
</template>
