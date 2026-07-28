import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { AUTH_ROUTE_NAMES, TERM_DOCUMENTS } from '@/constants/auth';
import type { TermId } from '@/types/auth';

// 라우트 파라미터가 지원하는 약관 식별자인지 확인한다.
const isTermId = (value: unknown): value is TermId =>
  value === 'service' || value === 'privacy' || value === 'finance';

// 약관 전문 화면에 문서와 안전한 뒤로가기 동작을 제공한다.
export const useTermDetail = () => {
  const route = useRoute();
  const router = useRouter();

  // 현재 라우트가 가리키는 약관 전문 문서다.
  const term = computed(() => {
    const termId = route.params.termId;
    return isTermId(termId) ? TERM_DOCUMENTS[termId] : TERM_DOCUMENTS.service;
  });

  // 약관 확인 전 작성하던 회원가입 화면으로 돌아간다.
  const goBack = async (): Promise<void> => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    await router.replace({ name: AUTH_ROUTE_NAMES.SIGN_UP });
  };

  return {
    term,
    goBack,
  };
};
