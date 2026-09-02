import { DateTime } from 'luxon'

// 서버 HTML과 브라우저 hydration이 같은 문자열을 만들도록 로케일·타임존을 고정한다.
// 실행 환경에 맡기면 서버(Node 로케일)와 브라우저(사용자 로케일)가 달라져 hydration mismatch가 난다.
export const DATE_LOCALE = 'ko'
export const DATE_ZONE = 'Asia/Seoul'

export function formatDate(iso: string): string {
  return DateTime.fromISO(iso, { zone: DATE_ZONE })
    .setLocale(DATE_LOCALE)
    .toLocaleString(DateTime.DATE_MED)
}
