import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CommentList } from './CommentList'

describe('CommentList', () => {
  it('댓글 수, 내용, 작성자와 날짜를 렌더링한다', () => {
    render(
      <CommentList
        comments={[
          {
            id: 1,
            postId: 1,
            author: 'reader1',
            content: '첫 댓글',
            createdAt: '2026-09-01T03:00:00.000Z',
          },
          {
            id: 2,
            postId: 1,
            author: 'admin',
            content: '둘째 댓글',
            createdAt: '2026-09-02T03:00:00.000Z',
          },
        ]}
      />,
    )
    expect(screen.getByRole('heading', { name: '댓글 2' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: '댓글 목록' })).toBeInTheDocument()
    expect(screen.getByText('첫 댓글')).toBeInTheDocument()
    expect(screen.getByText('reader1 · 2026년 9월 1일')).toBeInTheDocument()
  })

  it('댓글이 없으면 안내 문구를 보여 준다', () => {
    render(<CommentList comments={[]} />)
    expect(screen.getByRole('heading', { name: '댓글 0' })).toBeInTheDocument()
    expect(screen.getByText('아직 댓글이 없습니다.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
