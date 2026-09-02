import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CsrCommentsPage } from './CsrCommentsPage'

describe('CsrCommentsPage', () => {
  it('URL의 게시글 id와 댓글 목록을 렌더링한다', () => {
    render(
      <MemoryRouter initialEntries={['/csr/3/comments']}>
        <Routes>
          <Route path="/csr/:id/comments" element={<CsrCommentsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('POST #3')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '댓글' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: '댓글 목록' })).toBeInTheDocument()
    expect(screen.getByText('좋은 글 잘 읽었습니다.')).toBeInTheDocument()
    expect(screen.getByText('CSR 흐름을 이해하는 데 도움이 되었어요.')).toBeInTheDocument()
  })

  it('게시글로 돌아가기 링크가 현재 게시글로 연결된다', () => {
    render(
      <MemoryRouter initialEntries={['/csr/7/comments']}>
        <Routes>
          <Route path="/csr/:id/comments" element={<CsrCommentsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: '← 게시글로 돌아가기' })).toHaveAttribute(
      'href',
      '/csr/7',
    )
  })
})
