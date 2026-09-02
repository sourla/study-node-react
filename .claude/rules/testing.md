---
paths:
  - "src/**/*.test.ts"
  - "src/**/*.test.tsx"
  - "src/test/**"
  - "vitest.config.ts"
---

# 테스트 패턴

- Vitest + jsdom + Testing Library, `globals: true`, setup에서 `@testing-library/jest-dom/vitest` 로드.
- **loader 테스트**: `vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(...))` 후 loader 함수를 직접 호출. `Request` 객체를 넘겨 `request.url` 기반 URL 조합을 검증한다. `afterEach(() => vi.restoreAllMocks())`로 spy를 되돌린다.
- **SSR 페이지 컴포넌트**: `createMemoryRouter([{ path, element, loader }])` + `RouterProvider`로 loader 데이터를 주입.
- **CSR 페이지 컴포넌트**: `MemoryRouter` + `Routes`/`Route`로 `useParams` 경로를 제공하고 fetch는 spy로 mock.
- 테스트 파일은 대상 파일 옆에 `*.test.ts(x)`. loader 단위 테스트는 `.test.ts`, 컴포넌트 렌더링 테스트는 `.test.tsx`로 나눈다(`SsrPage.test.ts` / `SsrPage.test.tsx`).
- 커버리지에서 `src/test/**`와 `*.test.{ts,tsx}`는 제외.
