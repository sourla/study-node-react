# Render Lab

React + TypeScript + Vite로 만든 **React Router 기반 SPA** 학습 프로젝트입니다. 같은 게시글 기능을 **컴포넌트에서 직접 조회하는 방식(CSR)**과 **라우트 `loader`로 미리 조회하는 방식**으로 비교합니다.

## 기술 스택

- React 19 · TypeScript · Vite
- React Router (`createBrowserRouter`)
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

| 경로 | 화면 | 데이터 조회 방식 |
| --- | --- | --- |
| `/` | CSR 게시판 | `CsrPage`에서 조회 |
| `/csr` | CSR 게시판 | `CsrPage`에서 조회 |
| `/csr/:id` | CSR 상세 | `CsrDetailPage`에서 `useParams`로 ID 조회 |
| `/ssr` | loader 게시판 | `ssrLoader` 실행 후 `useLoaderData` 사용 |
| `/ssr/:id` | loader 상세 | `ssrDetailLoader` 실행 후 `useLoaderData` 사용 |

> `/ssr`라는 이름은 학습을 위한 구분입니다. 이 프로젝트는 서버에서 HTML을 렌더링하는 전통적인 SSR이 아니라 React Router `loader` 기반의 데이터 사전 로딩을 사용합니다.

모든 게시글 데이터는 [`public/data/posts.json`](public/data/posts.json)에 있으며, 제목과 `상세 보기` 링크를 클릭하면 ID가 포함된 상세 경로로 이동합니다.

## 라우팅 구조

라우터 설정은 [`src/routes/router.tsx`](src/routes/router.tsx)의 `createBrowserRouter`에 있습니다. [`src/main.tsx`](src/main.tsx)는 앱을 마운트하고 `RouterProvider`를 연결하는 역할만 담당합니다.

```txt
main.tsx
└── RouterProvider
    └── routes/router.tsx
        └── createBrowserRouter
            └── App (공통 레이아웃)
                ├── CsrPage
                ├── CsrDetailPage
                ├── SsrPage + ssrLoader
                └── SsrDetailPage + ssrDetailLoader
```

`App`은 공통 헤더와 `<Outlet />`을 제공하고, 각 페이지는 `features` 안에서 관리합니다. 이 프로젝트는 Vite가 번들링하고 React Router가 브라우저 라우팅을 담당하는 SPA 구조입니다.

## 프로젝트 구조

```txt
src/
├── main.tsx                  # 앱 시작점 및 RouterProvider 연결
├── routes/router.tsx         # React Router 라우트 설정
├── App.tsx                   # 공통 레이아웃
├── common/
│   ├── api/posts.ts          # 게시글 조회 함수
│   ├── components/           # 공통 게시글 UI와 에러 바운더리
│   ├── schemas/post.ts       # Zod 스키마
│   └── types/post.ts         # Post 타입
└── features/
    ├── csr/                  # 컴포넌트 내부에서 조회
    └── ssr/                  # loader로 조회
public/data/posts.json        # 샘플 데이터
```

## 테스트와 커버리지

```bash
npm test                 # 전체 테스트
npm run test:coverage    # 테스트 + 커버리지 리포트
```

커버리지 결과는 `coverage/`에 생성되지만 Git에는 올리지 않습니다(`.gitignore` 적용). HTML 리포트는 `coverage/index.html`에서 확인할 수 있습니다.

## 명령어

```bash
npm run dev          # 개발 서버
npm run build        # 타입 검사 및 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint 검사
npm run format       # Prettier 적용
npm run format:check # 포맷 검사
```
