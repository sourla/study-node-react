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

## 문서

- [CSR vs SSR 렌더링 흐름과 디버깅 사례](docs/01-render-flow.md) — 첫 요청·클라이언트 전환 흐름, hydration mismatch, 깨진 데이터가 두 방식에서 다르게 실패하는 모습
