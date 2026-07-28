import type { TermDocument, TermId } from '@/types/auth';

export const AUTH_ROUTE_NAMES = {
  LOGIN: 'auth-login',
  SIGN_UP: 'auth-sign-up',
  TERM_DETAIL: 'auth-term-detail',
  ACCOUNT_HELP: 'auth-account-help',
  SESSION: 'auth-session',
  ONBOARDING: 'auth-onboarding',
} as const;

export const AUTH_DEMO = {
  EMAIL: 'demo@durimoa.test',
  PASSWORD: 'Duri1234!',
  VERIFICATION_CODE: '123456',
  DUPLICATE_EMAIL: 'used@durimoa.test',
  DUPLICATE_PHONE: '01000000000',
} as const;

export const AUTH_SESSION_STORAGE_KEY = 'durimoa.auth.demo-session';

export const TERM_ORDER = ['service', 'privacy', 'finance'] as const satisfies readonly TermId[];

export const TERM_DOCUMENTS: Record<TermId, TermDocument> = {
  service: {
    id: 'service',
    title: '이용약관',
    effectiveDate: '2026.07.01',
    updatedDate: '2026.07.01',
    required: true,
    summary: '두리모아 서비스 이용에 필요한 기본 권리와 의무를 안내합니다.',
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
          '회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 사전에 공지합니다.',
          '회원이 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.',
        ],
      },
      {
        heading: '제4조 (서비스의 제공 및 변경)',
        paragraphs: [
          '회사는 회원에게 결혼자금 목표 설정 및 관리, 수입·지출 기록과 분석, 예산 관리 등의 서비스를 제공합니다.',
          '서비스 내용과 제공 방식은 운영 환경에 따라 변경될 수 있으며 변경 시 사전에 공지합니다.',
        ],
      },
    ],
  },
  privacy: {
    id: 'privacy',
    title: '개인정보 처리방침',
    effectiveDate: '2026.07.01',
    updatedDate: '2026.07.01',
    required: true,
    summary: '서비스 제공을 위해 처리하는 개인정보와 보호 기준을 안내합니다.',
    sections: [
      {
        heading: '제1조 (수집하는 개인정보)',
        paragraphs: [
          '회사는 회원가입과 본인 확인을 위해 이름, 이메일 주소, 휴대폰 번호를 처리합니다.',
          '비밀번호는 안전한 방식으로 보호되며 화면이나 로그에 원문으로 표시하지 않습니다.',
        ],
      },
      {
        heading: '제2조 (개인정보의 이용 목적)',
        paragraphs: [
          '수집한 정보는 회원 식별, 휴대폰 인증, 서비스 제공, 문의 대응과 부정 이용 방지를 위해 사용합니다.',
        ],
      },
      {
        heading: '제3조 (보유 및 이용 기간)',
        paragraphs: [
          '회원의 개인정보는 회원 탈퇴 시 지체 없이 파기합니다. 다만 관련 법령에 따라 보존이 필요한 정보는 정해진 기간 동안 분리하여 보관합니다.',
        ],
      },
      {
        heading: '제4조 (회원의 권리)',
        paragraphs: [
          '회원은 자신의 개인정보를 열람·정정하거나 처리 정지 및 삭제를 요청할 수 있습니다.',
        ],
      },
    ],
  },
  finance: {
    id: 'finance',
    title: '금융정보 연동 약관',
    effectiveDate: '2026.07.01',
    updatedDate: '2026.07.01',
    required: false,
    summary: '금융정보 연동 기능을 선택할 때 필요한 사항을 안내합니다.',
    sections: [
      {
        heading: '제1조 (목적)',
        paragraphs: [
          '본 약관은 회원이 선택적으로 금융정보 연동 기능을 이용할 때 필요한 조건과 절차를 정하는 것을 목적으로 합니다.',
        ],
      },
      {
        heading: '제2조 (연동 정보)',
        paragraphs: [
          '회원이 별도로 동의하고 연동한 경우에 한해 자산과 지출 내역 등 서비스 제공에 필요한 금융정보를 처리합니다.',
        ],
      },
      {
        heading: '제3조 (선택 동의와 철회)',
        paragraphs: [
          '금융정보 연동은 선택 사항이며 동의하지 않아도 기본 서비스를 이용할 수 있습니다.',
          '회원은 언제든지 연동을 해제하고 동의를 철회할 수 있습니다.',
        ],
      },
      {
        heading: '제4조 (안전한 처리)',
        paragraphs: [
          '회사는 연동 정보를 관련 법령과 보안 기준에 따라 처리하며 목적 달성에 필요한 범위에서만 이용합니다.',
        ],
      },
    ],
  },
};
