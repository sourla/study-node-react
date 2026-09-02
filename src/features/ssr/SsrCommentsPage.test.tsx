import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SsrCommentsPage } from './SsrCommentsPage'

describe('SsrCommentsPage', () => {
  it('게시글 id와 SSR 댓글을 렌더링한다', () => {
    render(
      <MemoryRouter initialEntries={['/ssr/3/comments']}>
        <Routes>
          <Route path="/ssr/:id/comments" element={<SsrCommentsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('POST #3')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '댓글' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: '댓글 목록' })).toBeInTheDocument()
    expect(screen.getByText('서버에서 렌더링된 댓글 화면입니다.')).toBeInTheDocument()
  })

  it('상세 화면으로 돌아가는 링크를 제공한다', () => {
    render(
      <MemoryRouter initialEntries={['/ssr/9/comments']}>
        <Routes>
          <Route path="/ssr/:id/comments" element={<SsrCommentsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: '← 게시글로 돌아가기' })).toHaveAttribute(
      'href',
      '/ssr/9',
    )
  })
})
