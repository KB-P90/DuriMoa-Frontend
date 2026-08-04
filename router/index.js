import { createRouter, createWebHistory } from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import { authTermRoutes } from '@/router/routes/authTermRoutes';
import AccountConnectView from '@/views/AccountConnectView.vue';
import AccountHelpView from '@/views/auth/AccountHelpView.vue';
import AuthSessionView from '@/views/auth/AuthSessionView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import SignupView from '@/views/auth/SignupView.vue';
import CalendarPageView from '@/views/CalendarPageView.vue';
import CardConnectView from '@/views/CardConnectView.vue';
import CoupleConnectView from '@/views/CoupleConnectView.vue';
import GoalBudgetTypeView from '@/views/goal/GoalBudgetTypeView.vue';
import GoalCategoryBudgetView from '@/views/goal/GoalCategoryBudgetView.vue';
import GoalScheduleView from '@/views/goal/GoalScheduleView.vue';
import GoalSummaryView from '@/views/goal/GoalSummaryView.vue';
import PlaceholderView from '@/views/PlaceholderView.vue';
import HomeView from '@/views/HomeView.vue';
import MyPageView from '@/views/MyPageView.vue';
import OnboardingView from '@/views/onboarding/OnboardingView.vue';
import GoalListView from '@/views/goal/GoalListView.vue';
import ProfileEditView from '@/views/ProfileEditView.vue';
import MonthlyExpenseView from '@/views/MonthlyExpenseView.vue';

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
        { path: 'myinfo', name: 'myinfo', component: MyPageView },
        { path: 'card', name: 'card', component: PlaceholderView, props: { title: '카드추천' } },
        {
          path: 'expense/:yearMonth(\\d{4}-\\d{2})?',
          name: 'expense',
          component: MonthlyExpenseView,
          props: (route) => ({
            title: '월별 지출 관리',
            yearMonth: route.params.yearMonth,
          }),
        },
        { path: 'goal', name: 'goal-list', component: GoalListView },
        { path: 'goal/schedule', name: 'goal-schedule', component: GoalScheduleView },
        { path: 'goal/budget-type', name: 'goal-budget-type', component: GoalBudgetTypeView },
        {
          path: 'goal/categories/:categoryCode',
          name: 'goal-category-budget',
          component: GoalCategoryBudgetView,
          props: true,
        },
        {
          path: 'goal/summary/:goalId?',
          name: 'goal-summary',
          component: GoalSummaryView,
          props: true,
        },
      ],
    },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    ...authTermRoutes,
    { path: '/account-help', name: 'account-help', component: AccountHelpView },
    { path: '/auth/session', name: 'session', component: AuthSessionView },
    { path: '/onboarding', name: 'onboarding', component: OnboardingView },
    { path: '/myinfo/profile', name: 'myinfo-profile', component: ProfileEditView },
    { path: '/myinfo/accounts', name: 'myinfo-account-connect', component: AccountConnectView },
    { path: '/myinfo/cards', name: 'myinfo-card-connect', component: CardConnectView },
    { path: '/myinfo/couple', name: 'myinfo-couple-connect', component: CoupleConnectView },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

// 인증 상태를 확인하는 라우트 가드는 API 연결 단계에서 추가한다.
export default router;
