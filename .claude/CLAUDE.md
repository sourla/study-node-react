# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

레이어 구분: 전역(`~/.claude/CLAUDE.md`) → **프로젝트(이 파일, 커밋)** → 로컬(`CLAUDE.local.md`, gitignore). 경로별 세부 규칙은 `.claude/rules/`에 둔다.

## 프로젝트 개요

React Router v7 **Framework Mode(SSR)** 학습 프로젝트 "Render Lab". 같은 게시글 목록/상세 기능을 CSR(`/csr`, 컴포넌트 안에서 fetch)과 SSR(`/ssr`, 서버 `loader`에서 fetch)로 나란히 구현해 렌더링 흐름을 비교·디버깅하는 것이 목적이다.

그래서 `import.meta.env.DEV` 가드가 붙은 `console.log`(`[api]`, `[route loader]`, `[page]` 접두어)가 코드 곳곳에 의도적으로 있다. 학습용 트레이싱이므로 정리 대상으로 보고 지우지 말 것.

## 자주 쓰는 명령

| 명령                                               | 설명                                                       |
| -------------------------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                                      | `react-router dev` — SSR 개발 서버 (http://localhost:5173) |
| `npm run build`                                    | `react-router build` → `build/client`, `build/server`      |
| `npm start`                                        | 빌드된 SSR 서버 실행 (`react-router-serve`)                |
| `npm test`                                         | Vitest 전체 1회 실행                                       |
| `npx vitest run src/features/ssr/SsrPage.test.tsx` | 단일 파일 실행                                             |
| `npx vitest run -t "404"`                          | 테스트 이름 패턴으로 실행                                  |
| `npm run test:watch` / `npm run test:coverage`     | watch / V8 커버리지(`coverage/`)                           |
| `npx react-router typegen && npx tsc -b`           | 타입 체크 (별도 script 없음)                               |
| `npm run lint`                                     | ESLint                                                     |
| `npm run format` / `npm run format:check`          | Prettier (semi 없음, single quote, width 100)              |

`Route.LoaderArgs` 같은 `./+types/*` import는 `.react-router/types/`에 생성되는 파일을 가리킨다. `react-router dev`/`build`/`typegen` 중 하나를 돌려야 생기고(gitignore됨), `tsconfig.app.json`의 `rootDirs`가 이 디렉터리를 `src`에 겹쳐 매핑한다. 라우트 파일을 새로 추가하면 typegen을 다시 돌려야 타입이 잡힌다.

SSR 동작 확인은 `build` → `start`. 루트 `index.html`이나 `vite preview`는 Framework Mode에서 쓰지 않는다.

## 아키텍처

### Framework Mode 설정

- `react-router.config.ts`: `ssr: true`, **`appDirectory: 'src'`**. 기본값 `app/` 대신 `src/`가 앱 루트라서 `src/root.tsx`가 root route module, `src/routes.ts`가 route config다.
- `entry.server.tsx` / `entry.client.tsx`는 없다(React Router 기본 엔트리 사용). README 다이어그램에는 나오지만 실제 파일이 아니다.
- `vite.config.ts`는 `reactRouter()` + `tailwindcss()` 플러그인. Vitest는 별도 `vitest.config.ts`에서 `@vitejs/plugin-react`를 쓴다(reactRouter 플러그인 아님).

### 라우트 모듈 규약

`src/routes.ts`가 파일 경로로 라우트를 선언한다:

```
/          → src/routes/home.tsx                 (CsrPage를 default로 re-export)
/csr       → src/features/csr/CsrPage.tsx
/csr/:id   → src/features/csr/CsrDetailPage.tsx
/ssr       → src/features/ssr/SsrPage.tsx        (+ loader)
/ssr/:id   → src/features/ssr/SsrDetailPage.tsx  (+ loader)
```

각 라우트 파일은 **default export = 컴포넌트**, 필요 시 **named export `loader`** 를 갖는 route module이다. `src/root.tsx`는 `Layout`(html 껍데기: `<Meta/>`, `<Links/>`, `<Scripts/>`), default export(`App` re-export — 헤더 + `<Outlet/>` 공통 레이아웃), `ErrorBoundary`(`RouteErrorBoundary` re-export), `links`를 내보낸다.

### CSR vs SSR 데이터 흐름

두 경로는 UI(`common/components/PostList`, `PostDetail`)와 타입/스키마(`common/types/post.ts`, `common/schemas/post.ts`)를 공유하고 **데이터를 가져오는 위치만 다르다**.

- **CSR**: 컴포넌트 `useEffect` 안에서 `common/api/posts.ts`의 `fetchPosts`/`fetchPost` 호출. 브라우저가 상대 경로 `/data/posts.json`을 fetch. 에러는 컴포넌트 state로 표시.
- **SSR**: route module의 `loader`가 서버에서 실행. 서버에는 origin이 없어서 `new URL('/data/posts.json', request.url)`로 절대 URL을 만들어 fetch한다. 실패 시 `throw new Response(msg, { status })` → root `ErrorBoundary`가 `isRouteErrorResponse`로 받아 렌더링. 컴포넌트는 `useLoaderData()`로만 읽는다.

데이터 원본은 `public/data/posts.json` 하나뿐이다(별도 API 서버 없음). 외부 데이터 계층(백엔드, DB)은 이 프로젝트 범위 밖이다. 모든 조회 경로(`fetchPosts`, `ssrLoader`, `ssrDetailLoader`)가 Zod `postsSchema`로 응답을 검증한다.

SSR 페이지는 loader 로직을 별도 파일(`ssrLoader.ts`, `ssrDetailLoader.ts`)로 빼 두고 route module의 `loader(args: Route.LoaderArgs)`가 이를 감싼다. 테스트가 route 타입 없이 loader 함수를 직접 호출할 수 있고, route 파일에는 컴포넌트와 route export만 남아 react-refresh 규칙(`eslint.config.js`의 `allowExportNames`)과도 맞는 구조다.

### 날짜 표시는 `common/utils/formatDate.ts`로만

luxon `toLocaleString`을 컴포넌트에서 직접 부르면 서버(Node 로케일)와 브라우저(사용자 로케일)가 다른 문자열을 만들어 hydration mismatch가 난다. `formatDate`가 로케일 `ko`, 타임존 `Asia/Seoul`을 고정한다. 새 날짜 표시는 이 헬퍼를 쓴다. 배경은 `docs/01-render-flow.md` 사례 1.

## 문서

`docs/`에 시나리오별 write-up을 둔다. `01-render-flow.md`는 CSR/SSR 흐름 관찰과 디버깅 사례(hydration mismatch, 깨진 데이터). 디버깅 체크리스트도 여기 있다.
