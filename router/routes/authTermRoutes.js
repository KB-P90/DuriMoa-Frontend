import TermDetailView from '@/views/auth/TermDetailView.vue';

// 약관 fixture가 없어도 라우트를 빌드할 수 있도록 선택적으로 불러온다.
const TERM_PAGE_MODULES = import.meta.glob('../../constants/authTerms*.fixture.ts', {
  eager: true,
});

// fixture 파일을 제외한 환경에서는 빈 약관 데이터를 사용한다.
const TERM_PAGES = Object.values(TERM_PAGE_MODULES)[0]?.default ?? {};

// 약관 본문 데이터와 관계없이 유지할 회원가입 약관 식별자다.
const TERM_IDS = ['service', 'privacy', 'finance'];

// fixture가 없을 때 약관 화면에 전달할 기본 구조다.
const EMPTY_TERM_PAGE = {
  title: '',
  intro: '',
  sections: [],
};

// 약관 식별자와 fixture 데이터를 조합한 회원가입 약관 라우트다.
export const authTermRoutes = TERM_IDS.map((termId) => ({
  path: `/signup/terms/${termId}`,
  name: `term-${termId}`,
  component: TermDetailView,
  props: TERM_PAGES[termId] ?? EMPTY_TERM_PAGE,
}));
