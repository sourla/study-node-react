import { describe, expect, it, vi } from 'vitest'
import { ssrLoader } from './ssrLoader'

describe('ssrLoader', () => {
  it('loader에서 public JSON을 조회한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify([])))
    await expect(ssrLoader({ request: new Request('http://localhost/ssr') })).resolves.toEqual([])
    expect(fetch).toHaveBeenCalledWith(new URL('/data/posts.json', 'http://localhost/ssr'))
  })
})
