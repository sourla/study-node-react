import { DateTime } from 'luxon'

// SSR HTML과 브라우저 hydration이 같은 문자열을 만들도록 로케일·타임존을 고정한다.
// 실행 환경(Node의 LANG, 브라우저의 navigator.language / 시스템 시간대)에 맡기면
// 서버와 클라이언트 출력이 달라져 hydration mismatch가 난다. (docs/01-render-flow.md 사례 1)
export const DATE_LOCALE = 'ko'
export const DATE_ZONE = 'Asia/Seoul'

export function formatDate(iso: string): string {
  return DateTime.fromISO(iso, { zone: DATE_ZONE })
    .setLocale(DATE_LOCALE)
    .toLocaleString(DateTime.DATE_MED)
}
