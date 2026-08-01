import { createRouter, createWebHistory } from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import { authTermRoutes } from '@/router/routes/authTermRoutes';
import AccountHelpView from '@/views/auth/AccountHelpView.vue';
import AuthSessionView from '@/views/auth/AuthSessionView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import SignupView from '@/views/auth/SignupView.vue';
import CalendarPageView from '@/views/CalendarPageView.vue';
import CardStrategyView from '@/views/card/CardStrategyView.vue';
import CardAmountInputView from '@/views/card/CardAmountInputView.vue';
import PlaceholderView from '@/views/PlaceholderView.vue';
import HomeView from '@/views/HomeView.vue';
import OnboardingView from '@/views/onboarding/OnboardingView.vue';

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
        { path: 'card', name: 'card', component: CardStrategyView },
      ],
    },
    { path: '/card/amount', name: 'card-amount', component: CardAmountInputView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    ...authTermRoutes,
    { path: '/account-help', name: 'account-help', component: AccountHelpView },
    { path: '/auth/session', name: 'session', component: AuthSessionView },
    { path: '/onboarding', name: 'onboarding', component: OnboardingView },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

// 인증 상태를 확인하는 라우트 가드는 API 연결 단계에서 추가한다.
export default router;
