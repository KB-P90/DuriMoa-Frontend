import axios from 'axios';

const ACCESS_TOKEN_KEY = 'accessToken';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
});

api.interceptors.request.use((config) => {
  const token = localSto그rage.getItem(ACCESS_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
