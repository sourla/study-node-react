import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { PostList } from './PostList'

describe('PostList', () => {
  it('게시글 목록을 카드로 렌더링한다', () => {
    render(
      <MemoryRouter>
        <PostList
        posts={[
          {
            id: 1,
            title: '테스트 게시글',
            content: '내용',
            author: 'tester',
            createdAt: '2026-09-01',
          },
        ]}
        />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: '테스트 게시글' })).toBeInTheDocument()
    expect(screen.getByText('내용')).toBeInTheDocument()
    expect(screen.getByText('by tester')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '테스트 게시글' })).toHaveAttribute('href', '/1')
  })
})
