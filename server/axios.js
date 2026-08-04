import axios from 'axios';

export const ACCESS_TOKEN_KEY = 'accessToken';
const PUBLIC_API_PATHS = new Set(['/auth/login', '/auth/signup']);

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
