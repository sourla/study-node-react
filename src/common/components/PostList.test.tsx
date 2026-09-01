import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PostList } from './PostList'

describe('PostList', () => {
  it('게시글 목록을 카드로 렌더링한다', () => {
    render(<PostList posts={[{ id: 1, title: '테스트 게시글', content: '내용', author: 'tester', createdAt: '2026-09-01' }]} />)
    expect(screen.getByRole('heading', { name: '테스트 게시글' })).toBeInTheDocument()
    expect(screen.getByText('내용')).toBeInTheDocument()
    expect(screen.getByText('by tester')).toBeInTheDocument()
  })
})
