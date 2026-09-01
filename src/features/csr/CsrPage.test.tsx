import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CsrPage } from './CsrPage'
import { MemoryRouter } from 'react-router-dom'

afterEach(() => vi.restoreAllMocks())

describe('CsrPage', () => {
  it('public JSON에서 게시글을 조회한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 1,
            title: 'CSR 글',
            content: '브라우저 조회',
            author: 'admin',
            createdAt: '2026-09-01T00:00:00.000Z',
          },
        ]),
      ),
    )
    render(<MemoryRouter><CsrPage /></MemoryRouter>)
    await waitFor(() => expect(screen.getByRole('heading', { name: 'CSR 글' })).toBeInTheDocument())
    expect(fetch).toHaveBeenCalledWith('/data/posts.json')
  })
})
