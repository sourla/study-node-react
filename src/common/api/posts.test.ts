import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchPost, fetchPosts } from './posts'

afterEach(() => vi.restoreAllMocks())

const post = { id: 1, title: '글', content: '내용', author: 'admin', createdAt: '2026-09-01T00:00:00.000Z' }

describe('posts api', () => {
  it('게시글 목록을 조회하고 검증한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response(JSON.stringify([post])))
    await expect(fetchPosts()).resolves.toEqual([post])
  })

  it('응답 오류를 처리한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    await expect(fetchPosts()).rejects.toThrow('게시글을 불러오지 못했습니다.')
  })

  it('잘못된 응답 형식을 처리한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify([{ id: 'wrong' }])))
    await expect(fetchPosts()).rejects.toThrow('게시글 데이터 형식이 올바르지 않습니다.')
  })

  it('ID로 게시글을 조회하고 없으면 오류를 던진다', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response(JSON.stringify([post])))
    await expect(fetchPost(1)).resolves.toEqual(post)
    await expect(fetchPost(99)).rejects.toThrow('게시글을 찾을 수 없습니다.')
  })
})
