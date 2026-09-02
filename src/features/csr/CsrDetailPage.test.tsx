import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { CsrDetailPage } from './CsrDetailPage'

afterEach(() => vi.restoreAllMocks())

it('URL의 id로 CSR 상세 화면을 렌더링한다', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(
      JSON.stringify([
        {
          id: 3,
          title: '상세 게시글',
          content: '상세 내용',
          author: 'tester',
          createdAt: '2026-09-03T00:00:00.000Z',
        },
      ]),
    ),
  )
  render(
    <MemoryRouter initialEntries={['/csr/3']}>
      <Routes>
        <Route path="/csr/:id" element={<CsrDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: '상세 게시글' })).toBeInTheDocument(),
  )
  expect(screen.getByText('상세 내용')).toBeInTheDocument()
})
