import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PostDetail } from './PostDetail'

describe('PostDetail', () => {
  it('게시글 상세 정보와 목록 링크를 렌더링한다', () => {
    render(
      <PostDetail
        post={{
          id: 2,
          title: '상세 제목',
          content: '상세 내용',
          author: 'admin',
          createdAt: '2026-09-01',
        }}
        backPath="/csr"
      />,
    )
    expect(screen.getByRole('heading', { name: '상세 제목' })).toBeInTheDocument()
    expect(screen.getByText('상세 내용')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '← 목록으로' })).toHaveAttribute('href', '/csr')
  })
})
