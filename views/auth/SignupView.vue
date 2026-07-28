<script setup lang="ts">
import AuthHeader from '@/components/auth/AuthHeader.vue';
import AuthScreen from '@/components/auth/AuthScreen.vue';
import LoadingButton from '@/components/auth/LoadingButton.vue';
import TermsAgreementCard from '@/components/auth/TermsAgreementCard.vue';
import { useSignupForm } from '@/composables/useSignupForm';

const {
  name,
  email,
  phone,
  verificationCode,
  password,
  passwordConfirmation,
  agreements,
  emailAvailability,
  phoneVerificationStatus,
  formError,
  isNameValid,
  isEmailValid,
  isPhoneValid,
  isPasswordValid,
  isPasswordMatching,
  hasAllAgreements,
  canSubmit,
  isSubmitting,
  checkEmail,
  requestPhoneVerification,
  verifyPhone,
  setAllAgreements,
  setAgreement,
  submit,
} = useSignupForm();
</script>

<template>
  <AuthScreen scrollable>
    <AuthHeader
      title="회원가입"
      @back="$router.back()"
    />

    <form
      class="signup-view"
      novalidate
      @submit.prevent="submit"
    >
      <div class="signup-view__fields">
        <div>
          <label
            class="auth-label"
            for="signup-name"
            >이름</label
          >
          <input
            id="signup-name"
            v-model="name"
            class="auth-input"
            type="text"
            autocomplete="name"
            maxlength="20"
            placeholder="이름을 입력해주세요"
            :aria-invalid="Boolean(name) && !isNameValid"
            :aria-describedby="name && !isNameValid ? 'signup-name-error' : undefined"
          />
          <p
            v-if="name && !isNameValid"
            id="signup-name-error"
            class="auth-field-message auth-field-message--error"
            role="alert"
          >
            이름은 2자 이상 입력해주세요.
          </p>
        </div>

        <div>
          <label
            class="auth-label"
            for="signup-email"
            >이메일 <span class="signup-view__label-note">로그인 아이디</span></label
          >
          <div class="signup-view__inline-field">
            <input
              id="signup-email"
              v-model="email"
              class="auth-input"
              type="email"
              inputmode="email"
              autocomplete="email"
              placeholder="이메일을 입력해주세요"
              :aria-invalid="(Boolean(email) && !isEmailValid) || emailAvailability === 'duplicate'"
              aria-describedby="signup-email-status"
            />
            <button
              class="auth-inline-button"
              type="button"
              :disabled="!isEmailValid || emailAvailability === 'checking'"
              @click="checkEmail"
            >
              {{ emailAvailability === 'checking' ? '확인 중' : '중복 확인' }}
            </button>
          </div>
          <p
            v-if="emailAvailability === 'available'"
            id="signup-email-status"
            class="auth-field-message auth-field-message--success"
            role="status"
          >
            ✓ 사용 가능한 이메일이에요.
          </p>
          <p
            v-else-if="emailAvailability === 'duplicate'"
            id="signup-email-status"
            class="auth-field-message auth-field-message--error"
            role="alert"
          >
            이미 가입된 이메일이에요.
          </p>
          <p
            v-else-if="email && !isEmailValid"
            id="signup-email-status"
            class="auth-field-message auth-field-message--error"
          >
            올바른 이메일 형식으로 입력해주세요.
          </p>
        </div>

        <div>
          <label
            class="auth-label"
            for="signup-phone"
            >휴대폰 번호</label
          >
          <div class="signup-view__inline-field">
            <input
              id="signup-phone"
              v-model="phone"
              class="auth-input"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              maxlength="13"
              placeholder="010-0000-0000"
              :disabled="phoneVerificationStatus === 'verified'"
              :aria-invalid="Boolean(phone) && !isPhoneValid"
              :aria-describedby="
                (phone && !isPhoneValid) ||
                phoneVerificationStatus === 'codeSent' ||
                phoneVerificationStatus === 'verified'
                  ? 'signup-phone-status'
                  : undefined
              "
            />
            <button
              class="auth-inline-button"
              type="button"
              :disabled="
                !isPhoneValid ||
                phoneVerificationStatus === 'requesting' ||
                phoneVerificationStatus === 'verified'
              "
              @click="requestPhoneVerification"
            >
              {{
                phoneVerificationStatus === 'requesting'
                  ? '전송 중'
                  : phoneVerificationStatus === 'verified'
                    ? '완료'
                    : '인증'
              }}
            </button>
          </div>
          <p
            v-if="phoneVerificationStatus === 'codeSent'"
            id="signup-phone-status"
            class="auth-field-message"
            role="status"
          >
            인증번호를 전송했어요.
          </p>
          <p
            v-if="phoneVerificationStatus === 'verified'"
            id="signup-phone-status"
            class="auth-field-message auth-field-message--success"
            role="status"
          >
            ✓ 휴대폰 인증이 완료됐어요.
          </p>
          <p
            v-if="phone && !isPhoneValid"
            id="signup-phone-status"
            class="auth-field-message auth-field-message--error"
            role="alert"
          >
            010으로 시작하는 휴대폰 번호 11자리를 입력해주세요.
          </p>
          <div
            v-if="phoneVerificationStatus === 'codeSent' || phoneVerificationStatus === 'verifying'"
            class="signup-view__verification"
          >
            <label
              class="auth-sr-only"
              for="signup-verification"
              >휴대폰 인증번호</label
            >
            <input
              id="signup-verification"
              v-model="verificationCode"
              class="auth-input"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="6"
              placeholder="인증번호 6자리"
            />
            <button
              class="auth-inline-button"
              type="button"
              :disabled="verificationCode.length !== 6 || phoneVerificationStatus === 'verifying'"
              @click="verifyPhone"
            >
              {{ phoneVerificationStatus === 'verifying' ? '확인 중' : '확인' }}
            </button>
          </div>
        </div>

        <div>
          <label
            class="auth-label"
            for="signup-password"
            >비밀번호</label
          >
          <input
            id="signup-password"
            v-model="password"
            class="auth-input"
            type="password"
            autocomplete="new-password"
            placeholder="비밀번호를 입력해주세요"
            :aria-invalid="Boolean(password) && !isPasswordValid"
            aria-describedby="signup-password-rule"
          />
          <p
            id="signup-password-rule"
            class="auth-field-message"
            :class="{ 'auth-field-message--error': password && !isPasswordValid }"
          >
            영문·숫자·특수문자 포함 8자 이상
          </p>
        </div>

        <div>
          <label
            class="auth-label"
            for="signup-password-confirmation"
            >비밀번호 확인</label
          >
          <input
            id="signup-password-confirmation"
            v-model="passwordConfirmation"
            class="auth-input"
            type="password"
            autocomplete="new-password"
            placeholder="비밀번호를 한 번 더 입력해주세요"
            :aria-invalid="Boolean(passwordConfirmation) && !isPasswordMatching"
            :aria-describedby="
              passwordConfirmation ? 'signup-password-confirmation-status' : undefined
            "
          />
          <p
            v-if="passwordConfirmation"
            id="signup-password-confirmation-status"
            class="auth-field-message"
            :class="
              isPasswordMatching ? 'auth-field-message--success' : 'auth-field-message--error'
            "
            :role="isPasswordMatching ? 'status' : 'alert'"
          >
            {{ isPasswordMatching ? '✓ 비밀번호가 일치해요.' : '비밀번호가 일치하지 않아요.' }}
          </p>
        </div>
      </div>

      <TermsAgreementCard
        :agreements="agreements"
        :all-agreed="hasAllAgreements"
        @update:all="setAllAgreements"
        @update:term="setAgreement"
      />

      <p
        v-if="formError"
        class="auth-form-error"
        role="alert"
      >
        {{ formError }}
      </p>

      <div class="signup-view__action">
        <LoadingButton
          type="submit"
          :loading="isSubmitting"
          :disabled="!canSubmit"
        >
          가입하고 시작하기
        </LoadingButton>
      </div>
    </form>
  </AuthScreen>
</template>

<style scoped>
.signup-view {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  padding: 8px 20px 0;
}

.signup-view__fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.signup-view__label-note {
  margin-left: 3px;
  padding: 2px 6px;
  border-radius: 99px;
  background: #f1f2f5;
  color: #969ba6;
  font-size: 9px;
}

.signup-view__inline-field,
.signup-view__verification {
  display: flex;
  gap: 7px;
}

.signup-view__inline-field .auth-input,
.signup-view__verification .auth-input {
  min-width: 0;
  flex: 1;
}

.signup-view__verification {
  margin-top: 8px;
}

.signup-view__action {
  position: sticky;
  bottom: 0;
  margin: 0 -20px;
  padding: 10px 20px max(18px, env(safe-area-inset-bottom));
  background: linear-gradient(rgb(255 255 255 / 30%), #fff 20%);
}
</style>
