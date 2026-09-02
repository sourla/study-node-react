# CSR vs SSR 렌더링 흐름과 디버깅 사례

브랜치 `debug/render-flow`에서 실제로 돌려 보며 기록한 내용이다. 도구는 세 가지만 썼다. dev 서버 터미널(stdout), 브라우저 콘솔·네트워크 탭, `curl`.

## 0. 전제: 이 프로젝트의 "CSR"은 서버 렌더링을 안 한다는 뜻이 아니다

`react-router.config.ts`의 `ssr: true` 때문에 **모든 라우트가 서버에서 HTML로 렌더링**된다. `/csr`도 예외가 아니다. 차이는 **데이터를 어디서 가져오느냐**뿐이다.

- `/csr`: 서버는 컴포넌트의 초기 상태(`posts = []`)를 렌더한다. 그래서 서버 HTML에는 "게시글을 불러오는 중..."이 들어 있고, 브라우저가 hydration 후 `useEffect`에서 `/data/posts.json`을 가져온다.
- `/ssr`: 서버가 `loader`를 먼저 실행하고 그 결과로 HTML을 만든다. 서버 HTML에 게시글 5개가 이미 들어 있다.

로그 접두어로 **어디서 실행됐는지** 바로 안다.

| 접두어            | 실행 위치     | 보는 곳         |
| ----------------- | ------------- | --------------- |
| `[route loader]`  | 서버 (loader) | dev 서버 터미널 |
| `[api]`, `[page]` | 브라우저      | 브라우저 콘솔   |

## 1. 정상 흐름

### 1-1. 첫 요청 (주소창 입력, 새로고침)

| 관찰                          | `/csr`                                                                  | `/ssr`                                                            |
| ----------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `curl`로 받은 HTML            | 헤더 + "게시글을 불러오는 중..."                                        | 헤더 + 게시글 5개                                                 |
| 서버 터미널                   | 아무것도 없음                                                           | `[route loader] /ssr 실행 시작` → `응답 수신 200` → `데이터 반환` |
| 브라우저 네트워크 (정적 제외) | `/data/posts.json`, `__manifest`                                        | `__manifest`만                                                    |
| 브라우저 콘솔                 | `[page] useEffect 실행` → `[api] 시작/응답/완료` → `[page] 게시글 저장` | `[page] SsrPage 진입`                                             |

`/ssr` 첫 로드에서 브라우저가 데이터를 요청하지 않는다는 게 핵심이다. 데이터는 HTML 안에 직렬화되어 같이 왔다. `__manifest`는 화면에 있는 링크(`/ssr/1`~`/ssr/5`)의 라우트 정보를 미리 받아 두는 요청이다.

### 1-2. 클라이언트 전환 (`<Link>` 클릭)

`/ssr`에서 "게시글 3"을 클릭하면:

1. 전체 HTML 요청은 없다. 브라우저가 `GET /ssr/3.data`를 보낸다.
2. 서버 터미널에 `[route loader] /ssr/:id 실행 시작 3`이 찍힌다. **loader는 클라이언트 전환에서도 서버에서 실행된다.**
3. 응답은 `content-type: text/x-script`, 헤더 `x-remix-response: yes`. 본문은 turbo-stream 직렬화다.

```
[{"_1":2},"features/ssr/SsrDetailPage",{"_3":4},"data",{...},"id",3,"title","게시글 3",...]
```

4. 컴포넌트는 `useLoaderData()`로 그 값을 받아 렌더한다.

없는 글(`/ssr/99`)은 loader가 `throw new Response(..., { status: 404 })` 하고, `.data` 응답도 404다.

```
[{"_1":2},"features/ssr/SsrDetailPage",{"_3":4},"error",["ErrorResponse",5,6,7],"게시글을 찾을 수 없습니다.",404,""]
```

root의 `ErrorBoundary`가 `isRouteErrorResponse`로 이걸 받아 "페이지를 찾을 수 없습니다."를 그린다. 전체 요청 `/ssr/99`도 HTTP 404다.

관찰 포인트 두 개.

- 상세 화면의 "← 목록으로"는 `<a href>`라서 클릭하면 **전체 페이지를 다시 요청**한다(서버 렌더링부터 다시). `<Link>`였다면 `.data` 요청만 나간다. 네트워크 탭에서 HTML 문서 요청이 보이면 이쪽이다.
- 브라우저 콘솔에 `[page] SsrPage 진입`이 두 번 찍히는 건 dev의 StrictMode다. 버그가 아니다.

## 2. 사례 1: hydration mismatch (실제 버그)

### 증상

`/ssr`을 열면 화면은 멀쩡한데 콘솔에 에러가 하나 있다.

```
Hydration failed because the server rendered text didn't match the client.
As a result this tree will be regenerated on the client.
  - Date formatting in a user's locale which doesn't match the server.
...
  <span className="text-xs text-zinc-500">
+   2026년 9월 1일
-   Sep 1, 2026
```

화면이 멀쩡한 이유는 React가 서버 HTML을 버리고 클라이언트에서 트리를 다시 그렸기 때문이다. SSR로 얻은 이점(첫 화면이 즉시 완성되어 있음)을 조용히 잃는다. 콘솔을 안 보면 모른다.

### 원인

`PostList`와 `PostDetail`이 luxon의 `toLocaleString(DateTime.DATE_MED)`으로 날짜를 찍었다. 이 함수는 **실행 환경의 로케일**을 따른다.

| 쪽          | 로케일 결정                       | 결과             |
| ----------- | --------------------------------- | ---------------- |
| 서버 (Node) | `LANG=C.UTF-8` → ICU 기본 `en-US` | `Sep 1, 2026`    |
| 브라우저    | `navigator.language = ko-KR`      | `2026년 9월 1일` |

### 진단 절차

1. `curl -s http://localhost:5173/ssr`로 **서버가 만든 문자열**을 본다.
2. 브라우저 DOM의 같은 자리를 본다. 다르면 mismatch다.
3. 서버 쪽 로케일 확인: `node -e "console.log(Intl.DateTimeFormat().resolvedOptions().locale)"`.

### 수정 옵션 비교

| 방법                                                  | 서버=클라이언트 보장 | 부작용                                                          |
| ----------------------------------------------------- | -------------------- | --------------------------------------------------------------- |
| **로케일·타임존 고정** (채택)                         | O                    | 사용자 로케일을 무시한다. 한국어 서비스라 문제 없음             |
| loader에서 문자열로 포맷해 내려주기                   | O (SSR 경로만)       | CSR 경로는 여전히 브라우저에서 포맷하므로 두 경로 코드가 갈린다 |
| 마운트 후 클라이언트에서만 렌더 (`useEffect` + state) | O                    | 서버 HTML에 날짜가 없고, 마운트 뒤 깜빡인다                     |
| `suppressHydrationWarning`                            | X                    | 경고만 숨긴다. 불일치는 그대로. 시계처럼 불일치가 불가피할 때만 |

### 적용

`src/common/utils/formatDate.ts`에 로케일(`ko`)과 타임존(`Asia/Seoul`)을 고정한 헬퍼를 두고 두 컴포넌트가 이걸 쓴다. 테스트(`formatDate.test.ts`)는 luxon `Settings.defaultLocale`/`defaultZone`을 바꿔 가며 같은 문자열이 나오는지 확인한다.

타임존도 같이 고정한 이유: 로케일과 똑같은 구조의 지뢰다. 서버가 UTC로 도는 배포 환경에서 `2026-09-01T00:00:00.000Z`는 서버에선 9월 1일, 서울 브라우저에선 9월 1일 09시라 날짜는 같지만, `2026-08-31T16:00:00.000Z`처럼 경계에 걸리면 8월 31일 vs 9월 1일로 갈린다.

### 검증

- `curl /ssr` → `2026년 9월 1일`
- 브라우저 `/ssr` 콘솔 → 에러 0

## 3. 사례 2: 깨진 데이터 한 건이 CSR과 SSR에서 어떻게 다르게 실패하나

### 실험

`public/data/posts.json`에서 id 3의 `createdAt`을 `"2026-09-03"`으로 바꾼다. Zod 스키마의 `z.iso.datetime()`을 위반한다.

```bash
sed -i '' 's/"createdAt": "2026-09-03T00:00:00.000Z"/"createdAt": "2026-09-03"/' public/data/posts.json
# 관찰 후 복구
git checkout -- public/data/posts.json
```

### 관찰

| 관찰             | `/csr`                                                                                    | `/ssr`                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| HTTP 상태        | **200**                                                                                   | **500** (`/ssr/1`, `/ssr/3` 모두 500)                                        |
| 화면             | 헤더와 레이아웃은 정상. 본문에 `role="alert"`로 "게시글 데이터 형식이 올바르지 않습니다." | root `ErrorBoundary`만. 헤더 없음 (`ErrorBoundary`가 `App` 자리를 대신 렌더) |
| 브라우저 콘솔    | `[api] fetchPosts 응답 200` 다음 `[page] CsrPage 오류 Error: 게시글 데이터 형식이...`     | 없음                                                                         |
| 서버 터미널      | 없음                                                                                      | `[route loader] /ssr 응답 수신 200` **이후 아무것도 없음**                   |
| `curl`이 보는 것 | 로딩 문구. 겉보기엔 정상                                                                  | 500 + 오류 본문                                                              |

주의할 점 세 가지.

- `/ssr/1`도 500이다. 정상 레코드를 조회했는데도, loader가 파일 전체를 스키마 검증하므로 한 건 때문에 페이지 전체가 죽는다. 부분 실패(깨진 레코드만 건너뛰기)를 허용할지는 별도 결정이다.
- SSR 쪽 서버 로그에는 **throw한 `Response`가 남지 않는다.** React Router는 던져진 `Response`를 "의도된 결과"로 보고 로그 없이 그대로 응답한다. 진단은 HTTP 상태 코드와 응답 본문으로 한다. 로그를 남기고 싶으면 `entry.server.tsx`의 `handleError`에서 처리할 수 있다(이 프로젝트 범위 밖).
- CSR 쪽은 HTTP가 200이라 **모니터링·봇·캐시 어디서도 실패가 안 보인다.** 브라우저 콘솔이 유일한 단서다.

### 교훈

SSR은 실패가 HTTP 레벨로 드러난다. 서버 모니터링에 잡히고, 검색 봇이나 CDN 캐시에 깨진 200이 남지 않는다. 대신 한 건의 데이터 문제가 페이지 전체를 500으로 만든다. CSR은 껍데기는 항상 200으로 살아 있지만, 실패는 브라우저 안에서만 보인다.

## 4. 디버깅 체크리스트

1. 먼저 `curl`로 **서버가 만든 HTML**을 본다. 브라우저 화면은 hydration 이후의 결과라 서버 출력과 다를 수 있다.
2. 네트워크 탭에 `/data/*.json`이 있으면 브라우저 조회(CSR), `*.data`가 있으면 클라이언트 전환 중 loader 호출이다.
3. 화면이 멀쩡해도 콘솔의 hydration 에러는 버그다. 서버와 브라우저의 로케일·타임존·`Date.now()`·`window` 분기를 의심한다.
4. loader가 던진 `Response`는 서버 로그에 안 남는다. HTTP 상태 코드를 본다.
5. 로그 접두어로 실행 위치를 구분한다. `[route loader]`는 터미널, `[api]`/`[page]`는 브라우저 콘솔.
