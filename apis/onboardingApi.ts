// API 명세서의 온보딩 관련 method와 path를 백엔드 연결 전에 한곳에서 관리한다.
export const ONBOARDING_API_ENDPOINTS = {
  CODEF_TERMS: {
    method: 'POST',
    path: '/api/onboard/terms',
    requiresAuth: false,
  },
  ACCOUNT_LIST: {
    method: 'POST',
    path: '/api/onboard/account/list',
    requiresAuth: false,
  },
  ACCOUNT_SELECTIONS: {
    method: 'POST',
    path: '/api/onboard/account/selections',
    requiresAuth: false,
  },
  COUPLE_INVITE: {
    method: 'POST',
    path: '/api/couple/invite',
    requiresAuth: true,
  },
  COUPLE_ACCEPT: {
    method: 'POST',
    path: '/api/couple/accept',
    requiresAuth: true,
  },
  COUPLE_STATUS: {
    method: 'GET',
    path: '/api/couple/status',
    requiresAuth: true,
  },
  SHARE_SCOPE: {
    method: 'PUT',
    path: '/api/user/share',
    requiresAuth: true,
  },
} as const;
