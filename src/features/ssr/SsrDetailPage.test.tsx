import { afterEach, describe, expect, it, vi } from 'vitest'
import { ssrDetailLoader } from './SsrDetailPage'

afterEach(() => vi.restoreAllMocks())

const post = { id: 3, title: '상세', content: '내용', author: 'admin', createdAt: '2026-09-03' }

describe('ssrDetailLoader', () => {
  it('ID에 해당하는 게시글을 반환한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify([post])))
    await expect(ssrDetailLoader({ params: { id: '3' } })).resolves.toEqual(post)
  })

  it('게시글이 없으면 404 Response를 던진다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify([post])))
    await expect(ssrDetailLoader({ params: { id: '99' } })).rejects.toMatchObject({ status: 404 })
  })

  it('조회 실패를 상태 코드와 함께 전달한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 503 }))
    await expect(ssrDetailLoader({ params: { id: '3' } })).rejects.toMatchObject({ status: 503 })
  })
})
