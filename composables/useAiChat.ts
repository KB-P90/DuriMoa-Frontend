import { computed, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { toAiChatResponse, toWeddingBudgetRecommendation } from '@/models/AiChat';
import { postAiChatMessage, postWeddingBudgetRecommendation } from '@/server/aiApi';
import { useGoalStore } from '@/stores/goalStore';
import type {
  AiChatMessage,
  AiWeddingBudgetStep,
  WeddingBudgetRecommendation,
} from '@/types/aiChat';
import type { RegionName } from '@/types/goal';

let nextMessageId = 1;

const WELCOME_MESSAGE = `안녕하세요! 두리모아 AI예요 👋
아래 기능을 도와드릴 수 있어요.`;

export function useAiChat(messages: Ref<AiChatMessage[]>) {
  const router = useRouter();
  const goalStore = useGoalStore();
  const isOpen = ref(false);
  const draft = ref('');
  const isSending = ref(false);
  const weddingBudgetStep = ref<AiWeddingBudgetStep>('idle');
  const weddingDate = ref('');
  const weddingRegion = ref<RegionName | null>(null);
  const recommendation = ref<WeddingBudgetRecommendation | null>(null);

  const isFlowInputLocked = computed(() =>
    ['selectingDate', 'selectingRegion', 'analyzing'].includes(weddingBudgetStep.value)
  );
  const canSend = computed(
    () => draft.value.trim().length > 0 && !isSending.value && !isFlowInputLocked.value
  );

  function openChat() {
    ensureWelcomeMessage();
    isOpen.value = true;
  }

  function closeChat() {
    isOpen.value = false;
  }

  function updateOpen(value: boolean) {
    if (value) ensureWelcomeMessage();
    isOpen.value = value;
  }

  function ensureWelcomeMessage() {
    if (messages.value.length > 0) return;
    appendMessage('assistant', WELCOME_MESSAGE, 'welcome');
  }

  async function sendMessage() {
    const content = draft.value.trim();
    if (!content || isSending.value || isFlowInputLocked.value) return;

    if (weddingBudgetStep.value === 'result') {
      weddingBudgetStep.value = 'idle';
      recommendation.value = null;
    }
    appendMessage('user', content);
    draft.value = '';
    isSending.value = true;

    try {
      const dto = await postAiChatMessage({ message: content });
      const result = toAiChatResponse(dto);
      appendMessage('assistant', result.response);

      if (result.action === 'startWeddingBudgetFlow') {
        startWeddingBudgetFlow();
      }
    } catch {
      appendMessage('assistant', 'AI 응답을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      isSending.value = false;
    }
  }

  function startWeddingBudgetFlow() {
    weddingDate.value = '';
    weddingRegion.value = null;
    recommendation.value = null;
    weddingBudgetStep.value = 'selectingDate';
    appendMessage('assistant', '먼저 결혼 예정일을 선택해 주세요.');
  }

  function confirmWeddingDate() {
    if (!weddingDate.value) return;

    appendMessage('user', `결혼 예정일: ${formatWeddingDate(weddingDate.value)}`);
    appendMessage('assistant', '결혼식을 계획하고 있는 지역을 선택해 주세요.');
    weddingBudgetStep.value = 'selectingRegion';
  }

  async function confirmWeddingRegion() {
    if (!weddingRegion.value || !weddingDate.value || isSending.value) return;

    appendMessage('user', `결혼 예정 지역: ${weddingRegion.value}`);
    appendMessage('assistant', '직전 3개월의 소비 내역과 지역별 결혼 비용을 함께 분석하고 있어요.');
    weddingBudgetStep.value = 'analyzing';
    isSending.value = true;

    try {
      const dto = await postWeddingBudgetRecommendation({
        weddingDate: weddingDate.value,
        region: weddingRegion.value,
      });
      recommendation.value = toWeddingBudgetRecommendation(dto);
      appendMessage('assistant', '분석이 끝났어요. 아래 AI 추천 시안을 확인해 주세요.');
      weddingBudgetStep.value = 'result';
    } catch {
      appendMessage('assistant', '결혼 예산을 분석하지 못했어요. 잠시 후 다시 요청해 주세요.');
      weddingBudgetStep.value = 'idle';
    } finally {
      isSending.value = false;
    }
  }

  async function applyWeddingBudgetRecommendation() {
    const result = recommendation.value;
    const region = weddingRegion.value;
    if (!result || !region || !weddingDate.value) return;

    goalStore.reset();
    goalStore.setSchedule(weddingDate.value, region);
    goalStore.setBudgetType(result.budgetType);
    goalStore.setCategoryAmount('venue', result.items.venue);
    goalStore.setCategoryAmount('studio', result.items.studio);
    goalStore.setCategoryAmount('dress', result.items.dress);
    goalStore.setCategoryAmount('makeup', result.items.makeup);
    goalStore.setCategoryAmount('reserve', result.items.reserve);
    goalStore.setGroomRatio(result.groomRatio);
    goalStore.draft.name = result.name;

    closeChat();
    await router.push({ name: 'goal-summary' });
  }

  function updateWeddingDate(value: string) {
    weddingDate.value = value;
  }

  function updateWeddingRegion(value: RegionName) {
    weddingRegion.value = value;
  }

  function appendMessage(
    role: AiChatMessage['role'],
    content: string,
    variant?: AiChatMessage['variant']
  ) {
    const message: AiChatMessage = {
      id: nextMessageId,
      role,
      content,
      variant,
    };
    nextMessageId += 1;
    messages.value = [...messages.value, message];
  }

  function formatWeddingDate(value: string) {
    const [year, month, day] = value.split('-');
    return `${year}년 ${Number(month)}월 ${Number(day)}일`;
  }

  return {
    applyWeddingBudgetRecommendation,
    canSend,
    closeChat,
    confirmWeddingDate,
    confirmWeddingRegion,
    draft,
    isFlowInputLocked,
    isOpen,
    isSending,
    openChat,
    recommendation,
    sendMessage,
    updateOpen,
    updateWeddingDate,
    updateWeddingRegion,
    weddingBudgetStep,
    weddingDate,
    weddingRegion,
  };
}
