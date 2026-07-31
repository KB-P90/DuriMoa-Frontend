import { createRouter, createWebHistory } from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import AccountHelpView from '@/views/auth/AccountHelpView.vue';
import AuthSessionView from '@/views/auth/AuthSessionView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import OnboardingEntryView from '@/views/auth/OnboardingEntryView.vue';
import SignupView from '@/views/auth/SignupView.vue';
import TermDetailView from '@/views/auth/TermDetailView.vue';
import CalendarPageView from '@/views/CalendarPageView.vue';
import HomeView from '@/views/HomeView.vue';
import PlaceholderView from '@/views/PlaceholderView.vue';

// 약관 내용은 백엔드 연결 전에도 각 전문 화면을 검토할 수 있도록 정적 데이터로 관리한다.
const TERM_PAGES = {
  service: {
    title: '이용약관',
    intro: '두리모아가 제공하는 서비스의 이용 조건과 회원의 권리·의무를 안내합니다.',
    sections: [
      {
        heading: '제1조 (목적)',
        paragraphs: [
          '본 약관은 두리모아가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.',
        ],
      },
      {
        heading: '제2조 (정의)',
        paragraphs: [
          '“서비스”란 회사가 제공하는 결혼 자금 관리 서비스 및 관련 제반 서비스를 의미합니다.',
          '“회원”이란 본 약관에 동의하고 서비스를 이용하는 개인을 의미합니다.',
        ],
      },
      {
        heading: '제3조 (약관의 효력 및 변경)',
        paragraphs: [
          '본 약관은 회원이 동의함으로써 효력을 발생합니다.',
          '회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 사전에 공지합니다.',
        ],
      },
      {
        heading: '제4조 (서비스의 제공 및 변경)',
        paragraphs: [
          '회사는 회원에게 결혼자금 목표 설정 및 관리, 수입·지출 기록과 분석 등의 서비스를 제공합니다.',
          '서비스의 내용은 운영상 필요에 따라 변경될 수 있으며 변경 시 사전에 공지합니다.',
        ],
      },
    ],
  },
  privacy: {
    title: '개인정보 처리방침',
    intro: '두리모아는 회원의 개인정보를 안전하게 보호하고 관련 법령을 준수합니다.',
    sections: [
      {
        heading: '제1조 (개인정보의 수집 목적)',
        paragraphs: [
          '회원 가입, 본인 확인, 서비스 제공과 고객 문의 처리를 위해 필요한 최소한의 개인정보를 수집합니다.',
        ],
      },
      {
        heading: '제2조 (수집하는 개인정보)',
        paragraphs: [
          '회원 가입 시 이름, 이메일, 휴대폰 번호를 수집할 수 있습니다.',
          '서비스 이용 과정에서 접속 기록과 기기 정보가 자동으로 생성될 수 있습니다.',
        ],
      },
      {
        heading: '제3조 (보유 및 이용 기간)',
        paragraphs: [
          '개인정보는 회원 탈퇴 시 지체 없이 파기하며, 법령에 따라 보존해야 하는 정보는 정해진 기간 동안 보관합니다.',
        ],
      },
    ],
  },
  finance: {
    title: '금융정보 연동 약관',
    intro: '금융정보 연동은 선택 사항이며, 동의하지 않아도 기본 서비스를 이용할 수 있습니다.',
    sections: [
      {
        heading: '제1조 (연동 목적)',
        paragraphs: [
          '회원의 동의를 받아 자산과 지출 정보를 한곳에서 확인할 수 있도록 금융정보 연동 기능을 제공합니다.',
        ],
      },
      {
        heading: '제2조 (연동 정보)',
        paragraphs: [
          '연동한 금융기관의 계좌 잔액, 거래 내역 등 서비스 제공에 필요한 정보를 불러올 수 있습니다.',
        ],
      },
      {
        heading: '제3조 (동의 철회)',
        paragraphs: [
          '회원은 언제든지 금융정보 연동 동의를 철회할 수 있으며, 철회 후에는 새로운 정보를 불러오지 않습니다.',
        ],
      },
    ],
  },
};

const termRoutes = Object.entries(TERM_PAGES).map(([termId, term]) => ({
  path: `/signup/terms/${termId}`,
  name: `term-${termId}`,
  component: TermDetailView,
  props: term,
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
    { path: '/onboarding', name: 'onboarding', component: OnboardingEntryView },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

// 인증 상태를 확인하는 라우트 가드는 API 연결 단계에서 추가한다.
export default router;
