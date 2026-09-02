import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchComments } from './comments'

afterEach(() => vi.restoreAllMocks())

const comments = [
  { id: 1, postId: 1, author: 'a', content: '첫 댓글', createdAt: '2026-09-01T00:00:00.000Z' },
  { id: 2, postId: 2, author: 'b', content: '둘째 댓글', createdAt: '2026-09-02T00:00:00.000Z' },
]

describe('comments api', () => {
  it('게시글 id에 해당하는 댓글만 돌려준다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(comments)))
    await expect(fetchComments(1)).resolves.toEqual([comments[0]])
  })

  it('댓글이 없는 게시글이면 빈 배열이다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(comments)))
    await expect(fetchComments(99)).resolves.toEqual([])
  })

  it('응답 오류를 처리한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    await expect(fetchComments(1)).rejects.toThrow('댓글을 불러오지 못했습니다.')
  })

  it('잘못된 응답 형식을 처리한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify([{ id: 'x' }])))
    await expect(fetchComments(1)).rejects.toThrow('댓글 데이터 형식이 올바르지 않습니다.')
  })
})
