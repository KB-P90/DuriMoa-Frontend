import { createRouter, createWebHistory } from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import AccountHelpView from '@/views/auth/AccountHelpView.vue';
import AuthSessionView from '@/views/auth/AuthSessionView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import SignupView from '@/views/auth/SignupView.vue';
import TermDetailView from '@/views/auth/TermDetailView.vue';
import CalendarPageView from '@/views/CalendarPageView.vue';
import PlaceholderView from '@/views/PlaceholderView.vue';
import HomeView from '@/views/HomeView.vue';
import OnboardingView from '@/views/onboarding/OnboardingView.vue';

// 약관 fixture가 없어도 라우터를 빌드할 수 있도록 선택적으로 불러온다.
const TERM_PAGE_MODULES = import.meta.glob('../constants/authTerms*.fixture.ts', {
  eager: true,
});

// fixture 파일을 제외한 환경에서는 빈 약관 데이터를 사용한다.
const TERM_PAGES = Object.values(TERM_PAGE_MODULES)[0]?.default ?? {};

// 약관 본문 데이터와 관계없이 유지할 회원가입 약관 경로다.
const TERM_IDS = ['service', 'privacy', 'finance'];

// fixture가 없을 때 약관 화면에 전달할 기본 구조다.
const EMPTY_TERM_PAGE = {
  title: '',
  intro: '',
  sections: [],
};

// 약관 식별자와 분리된 fixture 데이터를 조합해 라우트를 만든다.
const termRoutes = TERM_IDS.map((termId) => ({
  path: `/signup/terms/${termId}`,
  name: `term-${termId}`,
  component: TermDetailView,
  props: TERM_PAGES[termId] ?? EMPTY_TERM_PAGE,
}));

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', redirect: { name: 'home' } },
        { path: 'home', name: 'home', component: HomeView },
        { path: 'calendar', name: 'calendar', component: CalendarPageView },
        { path: 'status', name: 'status', component: PlaceholderView, props: { title: '현황' } },
        { path: 'card', name: 'card', component: PlaceholderView, props: { title: '카드추천' } },
      ],
    },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    ...termRoutes,
    { path: '/account-help', name: 'account-help', component: AccountHelpView },
    { path: '/auth/session', name: 'session', component: AuthSessionView },
    { path: '/onboarding', name: 'onboarding', component: OnboardingView },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

// 인증 상태를 확인하는 라우트 가드는 API 연결 단계에서 추가한다.
export default router;
