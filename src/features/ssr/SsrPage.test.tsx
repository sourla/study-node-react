import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SsrPage } from './SsrPage'

describe('SsrPage', () => {
  it('loader 데이터를 게시글 목록으로 렌더링한다', async () => {
    const router = createMemoryRouter([{ path: '/', element: <SsrPage />, loader: () => [] }], { initialEntries: ['/'] })
    render(<RouterProvider router={router} />)
    await waitFor(() => expect(screen.getByRole('heading', { name: 'SSR 게시판' })).toBeInTheDocument())
  })
})
