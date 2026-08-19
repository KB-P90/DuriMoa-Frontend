import { createRouter, createWebHistory } from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import { authTermRoutes } from '@/router/routes/authTermRoutes';
import AccountConnectView from '@/views/AccountConnectView.vue';
import AccountHelpView from '@/views/auth/AccountHelpView.vue';
import AuthSessionView from '@/views/auth/AuthSessionView.vue';
import KakaoCallbackView from '@/views/auth/KakaoCallbackView.vue';
import KakaoSignupView from '@/views/auth/KakaoSignupView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import SignupView from '@/views/auth/SignupView.vue';
import CalendarPageView from '@/views/CalendarPageView.vue';
import CardConnectView from '@/views/CardConnectView.vue';
import CoupleConnectView from '@/views/CoupleConnectView.vue';
import GoalBudgetTypeView from '@/views/goal/GoalBudgetTypeView.vue';
import GoalCategoryBudgetView from '@/views/goal/GoalCategoryBudgetView.vue';
import GoalScheduleView from '@/views/goal/GoalScheduleView.vue';
import GoalSummaryView from '@/views/goal/GoalSummaryView.vue';
import CardStrategyView from '@/views/card/CardStrategyView.vue';
import CardAmountInputView from '@/views/card/CardAmountInputView.vue';
import PlaceholderView from '@/views/PlaceholderView.vue';
import HomeView from '@/views/HomeView.vue';
import MyPageView from '@/views/MyPageView.vue';
import OnboardingView from '@/views/onboarding/OnboardingView.vue';
import GoalListView from '@/views/goal/GoalListView.vue';
import ProfileEditView from '@/views/ProfileEditView.vue';
import MonthlyExpenseView from '@/views/MonthlyExpenseView.vue';
import ProgressView from '@/views/progress/ProgressView.vue';
import MonthlyProgressView from '@/views/progress/MonthlyProgressView.vue';
import MainView from '@/views/MainView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { useGoalStore } from '@/stores/goalStore';
import { useSignupStore } from '@/stores/signupStore';

// 목표 설정 흐름 내부에서 "이전" 버튼으로 1단계(goal-schedule)로 돌아오는 경우는
// 입력값을 유지해야 하므로, 그 외의 경로(홈 등)로 들어올 때만 이전 draft를 지운다.
const GOAL_FLOW_ROUTE_NAMES = ['goal-budget-type', 'goal-category-budget'];
const SIGNUP_TERM_ROUTE_NAMES = authTermRoutes.map((route) => route.name);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'home', component: MainView },
        { path: 'calendar', name: 'calendar', component: CalendarPageView },
        {
          path: 'calendar/expense/:yearMonth(\\d{6})?',
          name: 'expense',
          component: MonthlyExpenseView,
          props: (route) => ({
            title: '월별 지출 관리',
            yearMonth: route.params.yearMonth,
          }),
        },
        {
          path: 'progress',
          name: 'progress',
          component: ProgressView,
          props: { title: '목표 달성 현황' },
        },
        {
          path: 'progress/monthly',
          name: 'monthly-progress',
          component: MonthlyProgressView,
          props: { title: '월별 예산 달성 현황' },
        },
        { path: 'myinfo', name: 'myinfo', component: MyPageView },
        { path: 'card', name: 'card', component: CardStrategyView, props: { title: '카드추천' } },
        { path: 'goal', name: 'goal-list', component: GoalListView, props: { title: '예산 목록' } },
        { path: '/card/amount', name: 'card-amount', component: CardAmountInputView },
        {
          path: '/myinfo/profile',
          name: 'myinfo-profile',
          component: ProfileEditView,
          meta: { hideBottomNav: true },
        },
        { path: '/myinfo/accounts', name: 'myinfo-account-connect', component: AccountConnectView },
        { path: '/myinfo/cards', name: 'myinfo-card-connect', component: CardConnectView },
        { path: '/myinfo/couple', name: 'myinfo-couple-connect', component: CoupleConnectView },
      ],
    },
    {
      path: '/goal/schedule',
      name: 'goal-schedule',
      component: GoalScheduleView,
      beforeEnter: (to, from) => {
        if (!GOAL_FLOW_ROUTE_NAMES.includes(from.name)) {
          useGoalStore().reset();
        }
      },
    },
    { path: '/goal/budget-type', name: 'goal-budget-type', component: GoalBudgetTypeView },
    {
      path: '/goal/categories/:categoryCode',
      name: 'goal-category-budget',
      component: GoalCategoryBudgetView,
      props: true,
    },
    {
      path: '/goal/summary/:goalId?',
      name: 'goal-summary',
      component: GoalSummaryView,
      props: true,
    },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      beforeEnter: (_to, from) => {
        if (!SIGNUP_TERM_ROUTE_NAMES.includes(from.name)) {
          useSignupStore().reset();
        }
      },
    },
    ...authTermRoutes,
    { path: '/account-help', name: 'account-help', component: AccountHelpView },
    { path: '/auth/session', name: 'session', component: AuthSessionView },
    { path: '/auth/kakao/callback', name: 'kakao-callback', component: KakaoCallbackView },
    { path: '/auth/kakao/signup', name: 'kakao-signup', component: KakaoSignupView },
    { path: '/onboarding', name: 'onboarding', component: OnboardingView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

// 인증 상태를 확인하는 라우트 가드는 API 연결 단계에서 추가한다.
export default router;
