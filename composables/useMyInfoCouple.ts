import { computed, ref, watch, type Ref } from 'vue';
import {
  acceptMyPageCouple,
  getMyPageCoupleStatus,
  getMyPageInviteCode,
  inviteMyPageCouple,
} from '@/server/myPageApi';
import type { MyPageCouplePartnerResponseDto } from '@/types/dto/myPage.dto';
import type { OnboardingCoupleRequest } from '@/types/onboarding';

const INVITE_CODE_PATTERN = /^[A-Z0-9]{6}$/;
const MY_INVITE_CODE_COPY_SUCCESS_MESSAGE = '내 초대 코드를 복사했어요.';
const MY_INVITE_CODE_COPY_ERROR_MESSAGE = '초대 코드를 복사하지 못했어요.';

const ERROR_MESSAGES = {
  ACCEPT: '연결 요청을 수락하지 못했어요. 다시 시도해주세요.',
  INVITE: '초대 코드를 확인하지 못했어요. 다시 시도해주세요.',
  MY_INVITE_CODE: '내 초대 코드를 불러오지 못했어요.',
  STATUS: '커플 연결 상태를 불러오지 못했어요.',
} as const;

const toCoupleRequest = (dto: MyPageCouplePartnerResponseDto): OnboardingCoupleRequest | null => {
  if (dto.status === 'DISCONNECTED') {
    return null;
  }

  return {
    userId: dto.userId,
    name: dto.name,
    role: dto.role,
    status: dto.status,
  };
};

const isCoupleRequest = (
  request: OnboardingCoupleRequest | null
): request is OnboardingCoupleRequest => request !== null;

export function useMyInfoCouple(isActive: Readonly<Ref<boolean>>) {
  const inviteCodeDraft = ref('');
  const myInviteCode = ref('');
  const requests = ref<OnboardingCoupleRequest[]>([]);
  const feedbackMessage = ref('');
  const errorMessage = ref('');
  const myInviteCodeErrorMessage = ref('');
  const myInviteCodeCopyMessage = ref('');
  const hasMyInviteCodeCopyError = ref(false);
  const statusErrorMessage = ref('');
  const isLoadingMyInviteCode = ref(false);
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
    () => inviteCode.value.length > 0 && !INVITE_CODE_PATTERN.test(inviteCode.value)
  );

  const isConnected = computed(() =>
    requests.value.some((request) => request.status === 'CONNECTED')
  );

  const canConfirm = computed(
    () =>
      INVITE_CODE_PATTERN.test(inviteCode.value) &&
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

  async function loadMyInviteCode() {
    if (isLoadingMyInviteCode.value) {
      return;
    }

    isLoadingMyInviteCode.value = true;
    myInviteCodeErrorMessage.value = '';
    myInviteCodeCopyMessage.value = '';
    hasMyInviteCodeCopyError.value = false;

    try {
      const inviteCodeResponse = (await getMyPageInviteCode()).trim().toUpperCase();

      if (!INVITE_CODE_PATTERN.test(inviteCodeResponse)) {
        throw new Error('Invalid invite code response');
      }

      myInviteCode.value = inviteCodeResponse;
    } catch {
      myInviteCode.value = '';
      myInviteCodeErrorMessage.value = ERROR_MESSAGES.MY_INVITE_CODE;
    } finally {
      isLoadingMyInviteCode.value = false;
    }
  }

  async function copyMyInviteCode() {
    if (!INVITE_CODE_PATTERN.test(myInviteCode.value)) {
      return;
    }

    myInviteCodeCopyMessage.value = '';
    hasMyInviteCodeCopyError.value = false;

    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API is unavailable');
      }

      await navigator.clipboard.writeText(myInviteCode.value);
      myInviteCodeCopyMessage.value = MY_INVITE_CODE_COPY_SUCCESS_MESSAGE;
    } catch {
      hasMyInviteCodeCopyError.value = true;
      myInviteCodeCopyMessage.value = MY_INVITE_CODE_COPY_ERROR_MESSAGE;
    }
  }

  async function loadCoupleStatus() {
    if (isLoadingStatus.value) {
      return;
    }

    isLoadingStatus.value = true;
    statusErrorMessage.value = '';

    try {
      requests.value = (await getMyPageCoupleStatus()).map(toCoupleRequest).filter(isCoupleRequest);
    } catch {
      statusErrorMessage.value = ERROR_MESSAGES.STATUS;
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
      const invitationResponse = await inviteMyPageCouple(inviteCode.value);
      const invitationRequest = toCoupleRequest(invitationResponse);

      if (invitationRequest) {
        upsertRequest(invitationRequest);
      }

      feedbackMessage.value =
        invitationResponse.status === 'CONNECTED'
          ? '파트너 연결이 완료되었어요.'
          : `${invitationResponse.name}님에게 연결 요청을 보냈어요.`;
      await loadCoupleStatus();
    } catch {
      errorMessage.value = ERROR_MESSAGES.INVITE;
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
      const acceptedResponse = await acceptMyPageCouple(userId);
      const acceptedRequest = toCoupleRequest(acceptedResponse);

      if (acceptedRequest) {
        upsertRequest(acceptedRequest);
      }

      feedbackMessage.value = '파트너 연결이 완료되었어요.';
      await loadCoupleStatus();
    } catch {
      errorMessage.value = ERROR_MESSAGES.ACCEPT;
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
        void loadMyInviteCode();
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
    copyMyInviteCode,
    errorMessage,
    feedbackMessage,
    hasMyInviteCodeCopyError,
    hasInviteCodeError,
    inviteCode,
    isConnected,
    isInviting,
    isLoadingMyInviteCode,
    isLoadingStatus,
    loadCoupleStatus,
    loadMyInviteCode,
    myInviteCode,
    myInviteCodeCopyMessage,
    myInviteCodeErrorMessage,
    requests,
    statusErrorMessage,
  };
}
