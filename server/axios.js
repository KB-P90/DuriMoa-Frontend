import axios from 'axios';

export const ACCESS_TOKEN_KEY = 'accessToken';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const LOGIN_ROUTE_NAME = 'login';
const PUBLIC_API_PATHS = new Set([
  '/auth/login',
  '/auth/signup',
  '/auth/kakao/login',
  '/auth/kakao/signup',
  '/auth/refresh',
]);

let refreshRequest = null;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function refreshAccessToken() {
  if (refreshRequest) return refreshRequest;

  refreshRequest = axios
    .post('/auth/refresh', null, {
      baseURL: API_BASE_URL,
      withCredentials: true,
    })
    .then(({ data }) => {
      const accessToken = data?.data?.accessToken?.trim();
      if (!accessToken) {
        throw new Error('재발급 응답에 Access Token이 없습니다.');
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      return accessToken;
    })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

async function redirectToLogin() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  const { default: router } = await import('@/router');

  if (router.currentRoute.value.name !== LOGIN_ROUTE_NAME) {
    await router.replace({ name: LOGIN_ROUTE_NAME });
  }
}

api.interceptors.request.use((config) => {
  if (PUBLIC_API_PATHS.has(config.url)) {
    config.headers.delete('Authorization');
    return config;
  }

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isPublicRequest = PUBLIC_API_PATHS.has(originalRequest?.url);

    if (!originalRequest || !isUnauthorized || isPublicRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = accessToken;
      return api(originalRequest);
    } catch (refreshError) {
      await redirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);
