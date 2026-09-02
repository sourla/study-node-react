import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SsrDetailPage } from './SsrDetailPage'

const post = {
  id: 3,
  title: 'SSR 상세',
  content: '내용',
  author: 'admin',
  createdAt: '2026-09-03T00:00:00.000Z',
}
const comment = {
  id: 1,
  postId: 3,
  author: 'reader',
  content: 'loader로 온 댓글',
  createdAt: '2026-09-03T01:00:00.000Z',
}

describe('SsrDetailPage', () => {
  it('loader 데이터의 게시글과 댓글을 렌더링한다', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/ssr/:id',
          element: <SsrDetailPage />,
          loader: () => ({ post, comments: [comment] }),
        },
      ],
      { initialEntries: ['/ssr/3'] },
    )
    render(<RouterProvider router={router} />)
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'SSR 상세' })).toBeInTheDocument(),
    )
    expect(screen.getByText('loader로 온 댓글')).toBeInTheDocument()
  })
})
