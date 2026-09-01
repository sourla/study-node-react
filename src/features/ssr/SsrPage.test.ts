import { describe, expect, it, vi } from 'vitest'
import { ssrLoader } from './SsrPage'

describe('ssrLoader', () => {
  it('loader에서 public JSON을 조회한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify([])))
    await expect(ssrLoader()).resolves.toEqual([])
    expect(fetch).toHaveBeenCalledWith('/data/posts.json')
  })
})
