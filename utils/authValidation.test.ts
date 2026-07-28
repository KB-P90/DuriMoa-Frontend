import { describe, expect, it } from 'vitest';

import {
  formatPhone,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  normalizeEmail,
  normalizePhone,
} from './authValidation';

describe('authValidation', () => {
  it('이메일을 로그인 식별자 형식으로 정규화하고 검증한다', () => {
    expect(normalizeEmail('  USER@Example.COM ')).toBe('user@example.com');
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('user@example')).toBe(false);
  });

  it('휴대폰 번호를 숫자 기준으로 정규화하고 표시 형식으로 바꾼다', () => {
    expect(normalizePhone('010-4561-8234')).toBe('01045618234');
    expect(formatPhone('01045618234')).toBe('010-4561-8234');
    expect(isValidPhone('010-4561-8234')).toBe(true);
    expect(isValidPhone('02-123-4567')).toBe(false);
  });

  it('영문·숫자·특수문자를 포함한 8자 이상 비밀번호만 허용한다', () => {
    expect(isValidPassword('Duri1234!')).toBe(true);
    expect(isValidPassword('password!')).toBe(false);
    expect(isValidPassword('Password1')).toBe(false);
    expect(isValidPassword('Pw1!')).toBe(false);
  });
});
