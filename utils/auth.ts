import { ACCESS_TOKEN_KEY } from '@/server/axios.js';

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

// JWT의 payload(가운데 조각)만 디코드한다. JWT 형식이 아니면 null을 반환한다.
function decodeJwtPayload(token: string): JwtPayload | null {
  const segments = token.split('.');
  if (segments.length !== 3) return null;

  try {
    const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// accessToken이 있고, JWT라면 만료되지 않았는지까지 확인한다.
// JWT 형식이 아닌 토큰은 만료 여부를 알 수 없으니 존재 여부로만 판단한다.
export function isAccessTokenValid(): boolean {
  const token = getAccessToken();
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;

  return payload.exp * 1000 > Date.now();
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
