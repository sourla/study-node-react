import { afterEach, describe, expect, it, vi } from 'vitest'
import { ssrDetailLoader } from './ssrDetailLoader'

afterEach(() => vi.restoreAllMocks())

const post = {
  id: 3,
  title: '상세',
  content: '내용',
  author: 'admin',
  createdAt: '2026-09-03T00:00:00.000Z',
}
const comment = {
  id: 7,
  postId: 3,
  author: 'reader',
  content: '댓글',
  createdAt: '2026-09-03T01:00:00.000Z',
}

// URL별로 다른 응답을 돌려주는 fetch mock. 응답 본문이 null이면 해당 status로 실패 응답.
function mockFetch(bodies: { posts?: unknown; comments?: unknown }, status = 200) {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = String(input)
    const body = url.includes('comments') ? bodies.comments : bodies.posts
    return body === null
      ? new Response(null, { status })
      : new Response(JSON.stringify(body ?? []), { status: 200 })
  })
}

const load = (id: string) =>
  ssrDetailLoader({ params: { id }, request: new Request(`http://localhost/ssr/${id}`) })

describe('ssrDetailLoader', () => {
  it('게시글과 그 게시글의 댓글을 함께 반환한다', async () => {
    mockFetch({ posts: [post], comments: [comment, { ...comment, id: 8, postId: 99 }] })
    await expect(load('3')).resolves.toEqual({ post, comments: [comment] })
    expect(fetch).toHaveBeenCalledWith(new URL('/data/posts.json', 'http://localhost/ssr/3'))
    expect(fetch).toHaveBeenCalledWith(new URL('/data/comments.json', 'http://localhost/ssr/3'))
  })

  it('댓글이 없는 게시글은 빈 배열을 돌려준다', async () => {
    mockFetch({ posts: [post], comments: [] })
    await expect(load('3')).resolves.toEqual({ post, comments: [] })
  })

  it('게시글이 없으면 404 Response를 던진다', async () => {
    mockFetch({ posts: [post], comments: [] })
    await expect(load('99')).rejects.toMatchObject({ status: 404 })
  })

  it('게시글 조회 실패를 상태 코드와 함께 전달한다', async () => {
    mockFetch({ posts: null, comments: [] }, 503)
    await expect(load('3')).rejects.toMatchObject({ status: 503 })
  })

  it('댓글 데이터 형식이 올바르지 않으면 500 Response를 던진다', async () => {
    mockFetch({ posts: [post], comments: [{ id: 'x' }] })
    await expect(load('3')).rejects.toMatchObject({ status: 500 })
  })
})
