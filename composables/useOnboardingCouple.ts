import { computed, ref, watch, type Ref } from 'vue';
import {
  ONBOARDING_API_ERROR_MESSAGES,
  ONBOARDING_COUPLE_MESSAGES,
  ONBOARDING_INVITE_CODE_PATTERN,
} from '@/constants/onboard';
import { isOnboardingCoupleRequest, toOnboardingCoupleRequest } from '@/models/Onboarding';
import type { OnboardingCoupleRequest } from '@/types/onboarding';
import { getOnboardingApiErrorMessage } from '@/utils/onboardingApiError';
import {
  acceptPartner,
  getCoupleStatus,
  getMyInviteCode,
  invitePartner,
} from '@/server/onboardingApi';

const MY_INVITE_CODE_ERROR_MESSAGE = '내 초대 코드를 불러오지 못했어요.';
const MY_INVITE_CODE_COPY_SUCCESS_MESSAGE = '내 초대 코드를 복사했어요.';
const MY_INVITE_CODE_COPY_ERROR_MESSAGE = '초대 코드를 복사하지 못했어요.';

// 커플 연결 단계의 API 상태와 사용자 동작을 관리한다.
export function useOnboardingCouple(isActive: Readonly<Ref<boolean>>) {
  // 사용자가 입력하는 초대 코드 원본이다.
  const inviteCodeDraft = ref('');

  // 로그인한 사용자가 파트너에게 공유할 초대 코드다.
  const myInviteCode = ref('');

  // 서버에서 조회한 커플 연결 요청 목록이다.
  const requests = ref<OnboardingCoupleRequest[]>([]);

  // 커플 연결 API의 성공·오류 안내 문구다.
  const feedbackMessage = ref('');
  const errorMessage = ref('');
  const statusErrorMessage = ref('');
  const myInviteCodeErrorMessage = ref('');
  const myInviteCodeCopyMessage = ref('');
  const hasMyInviteCodeCopyError = ref(false);

  // 커플 상태 조회·초대·수락 요청의 진행 상태다.
  const isLoadingStatus = ref(false);
  const isLoadingMyInviteCode = ref(false);
  const isInviting = ref(false);
  const acceptingUserIds = ref<number[]>([]);

  // 입력한 초대 코드를 공백 없이 대문자로 정규화한다.
  const inviteCode = computed({
    get: () => inviteCodeDraft.value,
    set: (value: string) => {
      // 백엔드 요청에 전달할 정규화된 6자리 초대 코드다.
      const normalizedValue = value.replace(/\s+/g, '').toUpperCase().slice(0, 6);

      if (normalizedValue !== inviteCodeDraft.value) {
        feedbackMessage.value = '';
        errorMessage.value = '';
      }

      inviteCodeDraft.value = normalizedValue;
    },
  });

  // 입력한 값이 백엔드 초대 코드 형식과 다른지 나타낸다.
  const hasInviteCodeError = computed(
    () => inviteCode.value.length > 0 && !ONBOARDING_INVITE_CODE_PATTERN.test(inviteCode.value)
  );

  // 한 명의 파트너와 이미 연결되었는지 나타낸다.
  const isConnected = computed(() =>
    requests.value.some((request) => request.status === 'CONNECTED')
  );

  // 초대 코드 확인 요청을 보낼 수 있는지 나타낸다.
  const canConfirm = computed(
    () =>
      ONBOARDING_INVITE_CODE_PATTERN.test(inviteCode.value) &&
      !isConnected.value &&
      !isInviting.value &&
      !isLoadingStatus.value &&
      acceptingUserIds.value.length === 0
  );

  // 동일 사용자의 기존 요청을 최신 서버 응답으로 교체한다.
  function upsertRequest(request: OnboardingCoupleRequest) {
    // 같은 사용자에 대한 기존 요청의 배열 위치다.
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

  // 현재 로그인한 사용자의 초대 코드를 조회한다.
  async function loadMyInviteCode() {
    if (isLoadingMyInviteCode.value) {
      return;
    }

    isLoadingMyInviteCode.value = true;
    myInviteCodeErrorMessage.value = '';
    myInviteCodeCopyMessage.value = '';
    hasMyInviteCodeCopyError.value = false;

    try {
      const inviteCodeResponse = (await getMyInviteCode()).trim().toUpperCase();

      if (!ONBOARDING_INVITE_CODE_PATTERN.test(inviteCodeResponse)) {
        throw new Error('Invalid invite code response');
      }

      myInviteCode.value = inviteCodeResponse;
    } catch (error: unknown) {
      myInviteCode.value = '';
      myInviteCodeErrorMessage.value = getOnboardingApiErrorMessage(
        error,
        MY_INVITE_CODE_ERROR_MESSAGE
      );
    } finally {
      isLoadingMyInviteCode.value = false;
    }
  }

  // 내 초대 코드를 클립보드에 복사한다.
  async function copyMyInviteCode() {
    if (!ONBOARDING_INVITE_CODE_PATTERN.test(myInviteCode.value)) {
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

  // 서버 기준 커플 연결 요청과 상태 목록을 다시 조회한다.
  async function loadCoupleStatus() {
    if (isLoadingStatus.value) {
      return;
    }

    isLoadingStatus.value = true;
    statusErrorMessage.value = '';

    try {
      // API DTO 목록을 화면에서 사용하는 요청 목록으로 변환한다.
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

  // 입력한 초대 코드로 상대에게 연결을 요청하고 서버 상태를 갱신한다.
  async function confirmInviteCode() {
    if (!canConfirm.value) {
      return;
    }

    isInviting.value = true;
    feedbackMessage.value = '';
    errorMessage.value = '';

    try {
      // 초대 요청 직후 화면에 먼저 반영할 상대방 상태다.
      const invitationResponse = await invitePartner(inviteCode.value);
      const invitationRequest = toOnboardingCoupleRequest(invitationResponse);

      if (invitationRequest) {
        upsertRequest(invitationRequest);
      }

      feedbackMessage.value =
        invitationResponse.status === 'CONNECTED'
          ? ONBOARDING_COUPLE_MESSAGES.CONNECTED
          : `${invitationResponse.name}님에게 연결 요청을 보냈어요`;
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

  // 선택한 상대방의 연결 요청을 수락하고 서버 상태를 다시 조회한다.
  async function acceptRequest(userId: number) {
    // 선택한 사용자가 실제로 보낸 연결 요청인지 확인한다.
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
      // 수락 API가 반환한 연결 완료 상태다.
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

  // 커플 연결 단계에 진입할 때 내 코드와 연결 상태를 각각 조회한다.
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

  // 커플 연결 화면에서 사용할 상태와 API 동작만 공개한다.
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
