# AGENTS.md

## 프로젝트 개요

### 프로젝트 이름

**두리모아 (Durimoa)** — 예비부부 공동 예산·결혼 목표 관리 PWA

### 기술 스택

| 구분   | 기술                                                  |
| ------ | ----------------------------------------------------- |
| Core   | Vue 3 (Composition API, `<script setup>`), TypeScript |
| 상태   | Pinia                                                 |
| 라우팅 | Vue Router                                            |
| 스타일 | Tailwind CSS, shadcn-vue                              |
| 통신   | axios, SSE (Server-Sent Events, 실시간 알림)          |
| 기타   | PWA                                                   |

### 코드 작성 규칙

- 아키텍처는 **MVVM**을 따른다.
  - **Model** — `apis/`, `types/`, `models/`
  - **ViewModel** — `stores/`, `composables/`
  - **View** — `views/`, `components/`, `layouts/`
- `.vue`(View)에는 비즈니스 로직을 두지 않는다. 상태·로직은 store/composable에서 가져와 쓴다.
- 서버 통신은 `apis/`에서만 한다. `.vue`에서 axios 직접 호출 금지.
- snake_case → camelCase 변환은 **store의 `.map(toXxx)` 한 곳에서만** 한다.
- 색상은 반드시 tailwind config의 토큰명으로 쓴다.
  - 작업 전 `tailwind.config`의 color 정의를 먼저 확인한다.
  - config에 같은 색(HEX)이 있으면 무조건 토큰명 사용. `bg-dm-mint-light` (O) / `bg-[#EBF7F7]` (X)
  - config에 없는 색만 arbitrary value(`bg-[#XXXXXX]`)로 적고, 옆에 `<!-- TODO: 토큰 등록 검토 -->`를 남긴다.
  - config에 색을 임의로 추가하지 않는다 (공용 파일 → 별도 PR).
- Figma·디자인에서 가져온 HEX는 붙여넣기 전에 config 토큰과 먼저 매칭한다.

### 네이밍 규칙

| 대상             | 규칙             | 예시                                 |
| ---------------- | ---------------- | ------------------------------------ |
| 컴포넌트/뷰 파일 | PascalCase       | `GoalSetupView.vue`, `BottomNav.vue` |
| 뷰 파일 접미사   | `~View`          | `HomeView.vue`                       |
| store            | `useXxxStore`    | `useGoalStore`                       |
| composable       | `useXxx`         | `useSSE`                             |
| DTO 타입         | `~Dto`           | `GoalResponseDto`                    |
| 도메인 타입      | 접미사 없음      | `Goal`                               |
| 변환 함수        | `toXxx`          | `toGoal`                             |
| 상수             | UPPER_SNAKE_CASE | `STORAGE_KEYS`, `SSE_RETRY_DELAY`    |
| 폴더             | 소문자 복수형    | `stores/`, `types/`                  |

### 우선 순위

작성·수정 시 아래 순서로 판단한다.

1. **타입 안전** — `any` 금지. 타입이 없으면 먼저 정의한다.
2. **MVVM 경계 준수** — 로직이 `.vue`로 새지 않게.
3. **팀 컨벤션 일치** — 기존 파일 패턴을 그대로 따른다.
4. **동작** — 위 3개를 지킨 뒤 기능 구현.

### 폴더 구조

```
src/
├── apis/               # Model - 서버 통신
│   ├── axios.js        #   인스턴스, 인터셉터(토큰)
│   ├── goalApi.ts
│   └── notificationApi.ts
├── types/              # Model - 타입만
│   ├── dto/            #   서버 스펙 (수정 금지, 백엔드가 진실)
│   │   └── goal.dto.ts
│   ├── goal.ts         #   프론트 도메인 타입
│   └── common.ts       #   ApiResponse<T> 등 공용
├── models/             # Model - 변환 (DTO → 도메인)
│   └── Goal.ts
├── stores/             # ViewModel - Pinia
│   └── goalStore.ts
├── composables/        # ViewModel - 재사용 로직
│   └── useSSE.ts
├── views/              # View - 라우터 연결 페이지
│   └── GoalSetupView.vue
├── components/         # View - 재사용 UI
│   ├── ui/             #   shadcn-vue 자동 생성
│   ├── common/         #   공용 (헤더, 네비)
│   └── goal/           #   기능별
├── layouts/            # View - 레이아웃 (slot으로 화면을 감쌈)
│   ├── DefaultLayout.vue
│   ├── AuthLayout.vue
│   └── StepLayout.vue
├── constants/          # 고정값 (한 파일)
│   └── index.ts
├── utils/              # 재사용 순수 함수 (상태 없음)
│   ├── format.ts       #   금액·날짜 포맷
│   └── validate.ts     #   유효성 검사
├── router/index.ts
├── assets/
├── App.vue
└── main.js
```

---

## 규칙

### 타입 규칙

- **DTO와 도메인 타입을 분리한다.** 서버 응답 원형은 `types/dto/`, 프론트에서 쓰는 형태는 `types/`.
- DTO(`types/dto/`)는 **백엔드 스펙이 진실**이다. 임의로 필드명을 바꾸지 않는다.
- import해서 쓰는 타입은 전부 `.ts`. `.d.ts`는 전역 선언(`env.d.ts`, 라이브러리 보강) 전용.
- 타입만 가져올 땐 `import type { Goal }`을 붙인다.
- `any` 사용 금지. 불가피하면 `unknown` 후 좁히기.
- 상수는 `as const`로 고정한다.
- 타입과 상수를 같은 파일에 섞지 않는다. (타입은 빌드 시 사라지고 상수는 남음)

### 컴포넌트 규칙

- `<script setup lang="ts">` 사용.
- `views/` vs `components/` 기준: **라우터에 등록되면 view, 아니면 component.**
- props/emit은 타입으로 선언한다: `defineProps<{ goal: Goal }>()`.
- 한 화면에서만 쓰는 임시 상태(모달 열림 등)는 `.vue` 안 `ref`로 둔다. 공유 상태만 store로.
- `layouts/`는 `<slot/>`으로 화면을 감싸는 껍데기다. 로직 금지.
- 헤더·하단 네비를 각 view에 직접 그리지 않는다. layout 또는 `components/common/`을 쓴다.

### 유틸 규칙

- 재사용 가능한 코드는 `utils/`에 함수로 추가해서 가져다 쓴다. 같은 로직을 여러 곳에 복붙하지 않는다.
- `utils/`에는 **상태 없는 순수 함수**만 둔다. (입력 → 출력, 부수효과 없음)
- 상태·반응성이 필요하면 `utils/`가 아니라 `composables/`로 간다.
- 함수 단위로 export하고, 관련 함수는 파일로 묶는다 (`format.ts`, `validate.ts` 등).
- 특정 화면에서 한 번만 쓰는 로직은 `utils/`에 올리지 말고 해당 `.vue`/store 안에 둔다.

### 금지 규칙

- ❌ `.vue`에서 axios 직접 호출
- ❌ `.vue`에서 계산식·비즈니스 로직 (store/composable로)
- ❌ `localStorage.setItem('token')` 등 문자열 하드코딩 → `STORAGE_KEYS` 사용
- ❌ `router.push('/goal/setup')` 문자열 하드코딩 → 라우트 name 상수 사용
- ❌ 컴포넌트에서 snake_case 필드 접근 (변환은 store에서)
- ❌ `any`, `@ts-ignore`
- ❌ 공용 파일(`types/dto/`, `constants/`, `layouts/`) 승인 없이 수정
- ❌ 직접 DOM 조작 (`document.querySelector` 등)

### 커밋 규칙

`type: 제목` 형식 (한글 제목 허용).

| type       | 용도                    |
| ---------- | ----------------------- |
| `feat`     | 기능 추가               |
| `fix`      | 버그 수정               |
| `style`    | UI·CSS (동작 변화 없음) |
| `refactor` | 리팩터링                |
| `chore`    | 설정·빌드·패키지        |
| `docs`     | 문서                    |

- 예: `feat: 결혼 목표 카테고리 선택 스텝 구현`
- 한 커밋에 한 가지 목적만.

### git 규칙

- 브랜치: `type/기능-요약` (예: `feat/goal-setup`, `fix/sse-reconnect`)
- `main` 직접 push 금지. PR + 리뷰 1명 이상 승인 후 머지.
- 공용 파일(`types/dto/`, `constants/index.ts`, `layouts/`)은 **별도 PR로 먼저 머지**하고 기능 작업을 시작한다.
- PR 제목은 커밋 규칙과 동일하게.
- 머지 전 로컬에서 `main` 최신화(rebase 또는 merge) 후 충돌 해결.

### 작업 분류

| 담당   | 영역                                |
| ------ | ----------------------------------- |
| 황서진 | 백엔드 팀장 · 카드 전략 추천        |
| 강태규 | 마이페이지 · 홈                     |
| 김주영 | 프론트 팀장 · 알림 · 결혼 목표 설정 |
| 김현태 | 캘린더                              |
| 박기정 | 로그인/회원가입 · 온보딩            |
| 정여원 | 월별 지출 관리 · 공동 예산 관리     |

- 담당 화면 밖 파일 수정이 필요하면 담당자에게 먼저 공유한다.

### 작업 완료 보고

작업 종료 시 아래 형식으로 보고한다.

```
[작업] 무엇을 했는지 (한 줄)
[변경 파일] 추가/수정된 파일 목록
[영향 범위] 공용 파일 변경 여부 · 다른 담당 영역 영향 여부
[확인 필요] 리뷰어가 봐야 할 부분 (있으면)
[남은 것] 미완 · TODO (있으면)
```
