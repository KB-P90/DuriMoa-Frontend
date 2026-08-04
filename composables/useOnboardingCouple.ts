import { computed, ref, watch, type Ref } from 'vue';
import { acceptPartner, getCoupleStatus, invitePartner } from '@/apis/onboardingApi';
import {
  ONBOARDING_API_ERROR_MESSAGES,
  ONBOARDING_COUPLE_MESSAGES,
  ONBOARDING_INVITE_CODE_PATTERN,
} from '@/constants/onboard';
import { isOnboardingCoupleRequest, toOnboardingCoupleRequest } from '@/models/Onboarding';
import type { OnboardingCoupleRequest } from '@/types/onboarding';
import { getOnboardingApiErrorMessage } from '@/utils/onboardingApiError';

export function useOnboardingCouple(isActive: Readonly<Ref<boolean>>) {
  const inviteCodeDraft = ref('');
  const requests = ref<OnboardingCoupleRequest[]>([]);

  const feedbackMessage = ref('');
  const errorMessage = ref('');
  const statusErrorMessage = ref('');

  const isLoadingStatus = ref(false);
  const isInviting = ref(false);
  const acceptingUserIds = ref<number[]>([]);

  const inviteCode = computed({
    get: () => inviteCodeDraft.value,
    set: (value: string) => {
      const normalizedValue = value.replace(/\s+/g, '').toUpperCase().slice(0, 6);

      if (normalizedValue !== inviteCodeDraft.value) {
        feedbackMessage.value = '';
        errorMessage.value = '';
      }

      inviteCodeDraft.value = normalizedValue;
    },
  });

  const hasInviteCodeError = computed(
    () => inviteCode.value.length > 0 && !ONBOARDING_INVITE_CODE_PATTERN.test(inviteCode.value)
  );

  const isConnected = computed(() =>
    requests.value.some((request) => request.status === 'CONNECTED')
  );

  const canConfirm = computed(
    () =>
      ONBOARDING_INVITE_CODE_PATTERN.test(inviteCode.value) &&
      !isConnected.value &&
      !isInviting.value &&
      !isLoadingStatus.value &&
      acceptingUserIds.value.length === 0
  );

  function upsertRequest(request: OnboardingCoupleRequest) {
    const requestIndex = requests.value.findIndex(
      (currentRequest) => currentRequest.userId === request.userId
    );

    if (requestIndex === -1) {
      requests.value = [...requests.value, request];
      return;
    }

    requests.value = requests.value.map((currentRequest, index) =>
      index === requestIndex ? request : currentRequest
    );
  }

  async function loadCoupleStatus() {
    if (isLoadingStatus.value) {
      return;
    }

    isLoadingStatus.value = true;
    statusErrorMessage.value = '';

    try {
      const statusRequests = (await getCoupleStatus())
        .map(toOnboardingCoupleRequest)
        .filter(isOnboardingCoupleRequest);
      requests.value = statusRequests;
    } catch (error: unknown) {
      statusErrorMessage.value = getOnboardingApiErrorMessage(
        error,
        ONBOARDING_API_ERROR_MESSAGES.COUPLE_STATUS
      );
    } finally {
      isLoadingStatus.value = false;
    }
  }

  async function confirmInviteCode() {
    if (!canConfirm.value) {
      return;
    }

    isInviting.value = true;
    feedbackMessage.value = '';
    errorMessage.value = '';

    try {
      const invitationResponse = await invitePartner(inviteCode.value);
      const invitationRequest = toOnboardingCoupleRequest(invitationResponse);

      if (invitationRequest) {
        upsertRequest(invitationRequest);
      }

      feedbackMessage.value =
        invitationResponse.status === 'CONNECTED'
          ? ONBOARDING_COUPLE_MESSAGES.CONNECTED
          : `${invitationResponse.name}님에게 연결 요청을 보냈어요.`;
      await loadCoupleStatus();
    } catch (error: unknown) {
      errorMessage.value = getOnboardingApiErrorMessage(
        error,
        ONBOARDING_API_ERROR_MESSAGES.COUPLE_INVITE
      );
    } finally {
      isInviting.value = false;
    }
  }

  async function acceptRequest(userId: number) {
    const hasRequestedPartner = requests.value.some(
      (request) => request.userId === userId && request.status === 'REQUESTED'
    );

    if (isConnected.value || !hasRequestedPartner || acceptingUserIds.value.length > 0) {
      return;
    }

    acceptingUserIds.value = [...acceptingUserIds.value, userId];
    feedbackMessage.value = '';
    errorMessage.value = '';

    try {
      const acceptedResponse = await acceptPartner(userId);
      const acceptedRequest = toOnboardingCoupleRequest(acceptedResponse);

      if (acceptedRequest) {
        upsertRequest(acceptedRequest);
      }

      feedbackMessage.value = ONBOARDING_COUPLE_MESSAGES.CONNECTED;
      await loadCoupleStatus();
    } catch (error: unknown) {
      errorMessage.value = getOnboardingApiErrorMessage(
        error,
        ONBOARDING_API_ERROR_MESSAGES.COUPLE_ACCEPT
      );
      await loadCoupleStatus();
    } finally {
      acceptingUserIds.value = acceptingUserIds.value.filter(
        (acceptingUserId) => acceptingUserId !== userId
      );
    }
  }

  watch(
    isActive,
    (active) => {
      if (active) {
        void loadCoupleStatus();
      }
    },
    { immediate: true }
  );

  return {
    acceptRequest,
    acceptingUserIds,
    canConfirm,
    confirmInviteCode,
    errorMessage,
    feedbackMessage,
    hasInviteCodeError,
    inviteCode,
    isConnected,
    isInviting,
    isLoadingStatus,
    loadCoupleStatus,
    requests,
    statusErrorMessage,
  };
}
