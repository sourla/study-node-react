import { Settings } from 'luxon'
import { afterEach, describe, expect, it } from 'vitest'
import { formatDate } from './formatDate'

const iso = '2026-09-01T00:00:00.000Z'
const originalLocale = Settings.defaultLocale
const originalZone = Settings.defaultZone

afterEach(() => {
  Settings.defaultLocale = originalLocale
  Settings.defaultZone = originalZone
})

describe('formatDate', () => {
  it('실행 환경 로케일이 달라도 같은 문자열을 만든다', () => {
    Settings.defaultLocale = 'en-US'
    const onServer = formatDate(iso)
    Settings.defaultLocale = 'ko-KR'
    const onBrowser = formatDate(iso)
    expect(onServer).toBe(onBrowser)
    expect(onServer).toBe('2026년 9월 1일')
  })

  it('실행 환경 타임존이 달라도 서울 기준 날짜를 만든다', () => {
    Settings.defaultZone = 'America/New_York'
    expect(formatDate('2026-08-31T16:00:00.000Z')).toBe('2026년 9월 1일')
  })
})
