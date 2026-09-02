# Render Lab

React + TypeScript + Vite로 만든 **React Router Framework Mode SSR** 학습 프로젝트입니다. 같은 게시글 기능을 **브라우저에서 조회하는 방식(CSR)**과 **서버 `loader`로 HTML 생성 전에 조회하는 방식(SSR)**으로 비교합니다.

## 기술 스택

- React 19 · TypeScript · Vite
- React Router Framework Mode (`ssr: true`)
- Tailwind CSS
- Zod (API 응답 검증)
- Vitest · Testing Library · V8 Coverage

## 시작하기

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## 화면과 라우트

| 경로       | 화면       | 데이터 조회 방식                             |
| ---------- | ---------- | -------------------------------------------- |
| `/`        | CSR 게시판 | `CsrPage`에서 조회                           |
| `/csr`     | CSR 게시판 | `CsrPage`에서 조회                           |
| `/csr/:id` | CSR 상세   | `CsrDetailPage`에서 `useParams`로 ID 조회    |
| `/ssr`     | SSR 게시판 | 서버에서 `ssrLoader` 실행 후 HTML 생성       |
| `/ssr/:id` | SSR 상세   | 서버에서 `ssrDetailLoader` 실행 후 HTML 생성 |

> `/ssr`는 React Router Framework Mode의 실제 SSR 라우트입니다. 최초 요청은 서버에서 loader와 HTML 렌더링이 실행되고, 이후 브라우저에서는 hydration 후 SPA 방식으로 동작합니다.

모든 게시글 데이터는 [`public/data/posts.json`](public/data/posts.json)에 있으며, 제목과 `상세 보기` 링크를 클릭하면 ID가 포함된 상세 경로로 이동합니다.

## 라우팅 구조

라우트 설정은 [`src/routes.ts`](src/routes.ts)의 route manifest에서 관리합니다. [`react-router.config.ts`](react-router.config.ts)의 `ssr: true`와 Vite의 `reactRouter()` 플러그인을 통해 Framework Mode SSR을 사용합니다.

```txt
entry.server.tsx / entry.client.tsx (React Router 생성)
└── routes.ts
    └── App (공통 레이아웃)
        ├── CsrPage
        ├── CsrDetailPage
        ├── SsrPage + ssrLoader
        └── SsrDetailPage + ssrDetailLoader
```

`App`은 공통 헤더와 `<Outlet />`을 제공하고, 각 페이지는 `features` 안에서 관리합니다. Vite가 번들링하고 React Router Framework Mode가 클라이언트/서버 렌더링과 라우팅을 담당합니다.

## 프로젝트 구조

```txt
src/
├── root.tsx                   # 문서 루트 및 에러 바운더리
├── routes.ts                  # React Router route manifest
├── App.tsx                   # 공통 레이아웃
├── common/
│   ├── api/posts.ts          # 게시글 조회 함수
│   ├── components/           # 공통 게시글 UI와 에러 바운더리
│   ├── schemas/post.ts       # Zod 스키마
│   └── types/post.ts         # Post 타입
└── features/
    ├── csr/                  # 컴포넌트 내부에서 조회
    └── ssr/                  # loader로 조회 (학습용 경로명)
public/data/posts.json        # 샘플 데이터
```

루트의 `ErrorBoundary`가 loader에서 발생한 오류와 라우트 렌더링 오류를 처리합니다.

## 테스트와 커버리지

```bash
npm test                 # 전체 테스트
npm run test:coverage    # 테스트 + 커버리지 리포트
```

커버리지 결과는 `coverage/`에 생성되지만 Git에는 올리지 않습니다(`.gitignore` 적용). HTML 리포트는 `coverage/index.html`에서 확인할 수 있습니다. Framework Mode 빌드 결과인 `build/`도 Git에 올리지 않습니다.

## 명령어

```bash
npm run dev          # Framework Mode 개발 서버
npm run build        # 클라이언트/서버 빌드
npm run start        # 빌드된 SSR 서버 실행
npm run lint         # ESLint 검사
npm run format       # Prettier 적용
npm run format:check # 포맷 검사
```

## 브랜치

`main`은 뼈대다. 학습 시나리오는 [`docs/00-scenarios.md`](docs/00-scenarios.md)에 과제로 정의되어 있고, 풀이는 `main`에서 딴 브랜치에 남긴다. 머지하지 않는다.

| 브랜치                       | 역할                                                                                                                  | 산출물                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `main`                       | 뼈대 + 과제 정의                                                                                                      | `docs/00-scenarios.md`   |
| `debug/render-flow-answer`   | 시나리오 1 풀이, 시도 1. hydration 전에는 목록을 안 그리는 방식. 콘솔 에러는 사라지지만 서버 HTML에서 목록이 사라진다 | `docs/01-render-flow.md` |
| `debug/render-flow-answer-2` | 시나리오 1 풀이, 시도 2. 날짜 포맷의 로케일을 고정해 원인을 잡음                                                      | `docs/01-render-flow.md` |
| `debug/render-flow`          | 시나리오 1 참고 풀이(Claude). 흐름 관찰 표, 깨진 데이터 비교, 디버깅 체크리스트                                       | `docs/01-render-flow.md` |
| `feat/comments`              | 시나리오 2 풀이. 상세 페이지 아래에 댓글 붙이기. 시도 1(정적 배열, 별도 페이지)에서 시도 2(JSON, loader 합치기)로     | `docs/02-screen-flow.md` |

시나리오 1은 `/ssr`의 hydration mismatch를 찾아 고치는 것, 시나리오 2는 기존 화면에 하위 기능 하나를 붙이는 개발 흐름을 한 바퀴 도는 것이다.
