import { createRouter, createWebHistory } from 'vue-router';

import { AUTH_ROUTE_NAMES } from '@/constants/auth';
import { useAuthStore } from '@/stores/authStore';

declare module 'vue-router' {
  interface RouteMeta {
    guestOnly?: boolean;
    requiresAuth?: boolean;
  }
}

// 화면을 이동할 때 새 화면의 맨 위에서 시작하도록 스크롤 위치를 반환한다.
const scrollToTop = () => ({ top: 0 });

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: AUTH_ROUTE_NAMES.LOGIN },
    },
    {
      path: '/login',
      name: AUTH_ROUTE_NAMES.LOGIN,
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/signup',
      name: AUTH_ROUTE_NAMES.SIGN_UP,
      component: () => import('@/views/auth/SignupView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/signup/terms/:termId(service|privacy|finance)',
      name: AUTH_ROUTE_NAMES.TERM_DETAIL,
      component: () => import('@/views/auth/TermDetailView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/account-help',
      name: AUTH_ROUTE_NAMES.ACCOUNT_HELP,
      component: () => import('@/views/auth/AccountHelpView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/auth/session',
      name: AUTH_ROUTE_NAMES.SESSION,
      component: () => import('@/views/auth/AuthSessionView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/onboarding',
      name: AUTH_ROUTE_NAMES.ONBOARDING,
      component: () => import('@/views/auth/OnboardingEntryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: AUTH_ROUTE_NAMES.LOGIN },
    },
  ],
  scrollBehavior: scrollToTop,
});

// 로그인 여부에 따라 게스트 전용 화면과 보호 화면의 접근을 제한한다.
router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: AUTH_ROUTE_NAMES.LOGIN,
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: AUTH_ROUTE_NAMES.SESSION };
  }

  return true;
});

export default router;
