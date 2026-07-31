import { computed, ref } from 'vue';
import { ONBOARDING_COUPLE_MESSAGES, ONBOARDING_INVITE_CODE_PATTERN } from '@/constants/onboard';
import type { OnboardingCoupleRequest, PublishingPartner } from '@/types/onboarding';

// fixture가 없어도 빌드할 수 있도록 테스트 데이터 모듈을 선택적으로 불러온다.
const PUBLISHING_PARTNER_MODULES = import.meta.glob<{
  default: readonly PublishingPartner[];
}>('../mocks/onboardingCouple*.fixture.ts', { eager: true });

// fixture 파일을 제외한 환경에서는 빈 사용자 목록을 사용한다.
const PUBLISHING_PARTNERS = Object.values(PUBLISHING_PARTNER_MODULES)[0]?.default ?? [];

// 입력값과 연결 요청 상태에 따라 하나의 커플 연결 화면을 변경한다.
export function useOnboardingCouplePublishing() {
  // 사용자가 입력하는 초대 코드 원본이다.
  const inviteCodeDraft = ref('');

  // 초대 코드를 확인하기 전에는 연결 요청을 표시하지 않는다.
  const requests = ref<OnboardingCoupleRequest[]>([]);

  // 성공 안내와 오류 안내 문구다.
  const feedbackMessage = ref('');
  const errorMessage = ref('');

  // 입력한 초대 코드를 공백 없이 대문자로 정규화한다.
  const inviteCode = computed({
    get: () => inviteCodeDraft.value,
    set: (value: string) => {
      // API 요청에 전달할 정규화된 초대 코드다.
      const normalizedValue = value.replace(/\s+/g, '').toUpperCase();

      if (normalizedValue !== inviteCodeDraft.value) {
        feedbackMessage.value = '';
        errorMessage.value = '';
      }

      inviteCodeDraft.value = normalizedValue;
    },
  });

  // 초대 코드에 영문 대문자와 숫자 이외의 문자가 있는지 확인한다.
  const hasInviteCodeError = computed(
    () => inviteCode.value.length > 0 && !ONBOARDING_INVITE_CODE_PATTERN.test(inviteCode.value)
  );

  // 형식에 맞는 초대 코드가 입력되었는지 나타낸다.
  const canConfirm = computed(() => inviteCode.value.length > 0 && !hasInviteCodeError.value);

  // 한 명의 파트너와 이미 연결되었는지 나타낸다.
  const isConnected = computed(() =>
    requests.value.some((request) => request.status === 'CONNECTED')
  );

  // POST /api/couple/invite 예시처럼 입력 코드에 따라 사용자와 결과를 찾는다.
  function confirmInviteCode() {
    if (!canConfirm.value) {
      return;
    }

    // 입력한 코드와 일치하는 임시 사용자 데이터다.
    const partner = PUBLISHING_PARTNERS.find(
      (publishingPartner) => publishingPartner.inviteCode === inviteCode.value
    );

    if (!partner) {
      feedbackMessage.value = '';
      errorMessage.value = ONBOARDING_COUPLE_MESSAGES.INVALID_CODE;
      return;
    }

    if (isConnected.value) {
      feedbackMessage.value = '';
      errorMessage.value = ONBOARDING_COUPLE_MESSAGES.ALREADY_CONNECTED;
      return;
    }

    if (partner.result === 'UNAVAILABLE') {
      feedbackMessage.value = '';
      errorMessage.value = `${partner.name}님은 이미 다른 상대와 연결되어 있어요`;
      return;
    }

    // 임시 사용자 결과를 화면에서 사용하는 연결 요청으로 변환한다.
    const partnerRequest: OnboardingCoupleRequest = {
      userId: partner.userId,
      name: partner.name,
      role: partner.role,
      status: partner.result,
    };

    // 같은 상대방을 요청 목록에 중복으로 추가하지 않기 위한 확인값이다.
    const hasPartner = requests.value.some((request) => request.userId === partner.userId);

    if (!hasPartner) {
      requests.value = [...requests.value, partnerRequest];
    }

    feedbackMessage.value =
      partner.result === 'REQUESTED'
        ? `${partner.name}님이 보낸 연결 요청을 찾았어요`
        : `${partner.name}님에게 연결 요청을 보냈어요`;
    errorMessage.value = '';
  }

  // POST /api/couple/accept 예시처럼 받은 요청 중 한 명만 수락한다.
  function acceptRequest(userId: number) {
    if (isConnected.value) {
      feedbackMessage.value = '';
      errorMessage.value = ONBOARDING_COUPLE_MESSAGES.ALREADY_CONNECTED;
      return;
    }

    // 선택한 사용자가 실제 받은 요청 상태인지 확인한다.
    const hasRequestedPartner = requests.value.some(
      (request) => request.userId === userId && request.status === 'REQUESTED'
    );

    if (!hasRequestedPartner) {
      errorMessage.value = ONBOARDING_COUPLE_MESSAGES.NO_PENDING_REQUEST;
      return;
    }

    requests.value = requests.value.map((request) =>
      request.userId === userId ? { ...request, status: 'CONNECTED' } : request
    );
    feedbackMessage.value = ONBOARDING_COUPLE_MESSAGES.CONNECTED;
    errorMessage.value = '';
  }

  // 커플 연결 화면에서 사용할 입력 상태와 동작만 공개한다.
  return {
    acceptRequest,
    canConfirm,
    confirmInviteCode,
    errorMessage,
    feedbackMessage,
    hasInviteCodeError,
    inviteCode,
    isConnected,
    requests,
  };
}
