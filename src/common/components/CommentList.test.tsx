// File: CommentList.test.tsx
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {CommentList} from './CommentList'
import {DateTime} from 'luxon'

describe('commentlist', () => {
  it('renders a list of comments', () => {
    const comments = [
      {
        postId: 1,
        id: 101,
        author: 'Alice',
        content: 'This is the first comment.',
        createdAt: '2026-09-01T12:00:00.000Z',
        updatedAt: '2026-09-01T12:10:00.000Z',
      },
      {
        postId: 2,
        id: 102,
        author: 'Bob',
        content: 'Another sample comment.',
        createdAt: '2026-09-02T14:30:00.000Z',
        updatedAt: '2026-09-02T14:40:00.000Z',
      },
    ]

    render(<CommentList comments={comments}/>)

    expect(screen.getByRole('list', {name: '댓글 목록'})).toBeInTheDocument()
    comments.forEach((comment) => {
      const formattedDate = DateTime.fromISO(comment.createdAt)
      .setLocale('ko-KR')
      .toLocaleString(DateTime.DATE_MED)

      expect(
          screen.getByText(`댓글 ${comment.postId} ${comment.id} ${comment.author}`)
      ).toBeInTheDocument()
      expect(screen.getByText(formattedDate)).toBeInTheDocument()
      expect(screen.getByText(comment.content)).toBeInTheDocument()
    })
  })

  it('renders an empty list if there are no comments', () => {
    render(<CommentList comments={[]}/>)

    const list = screen.getByRole('list', {name: '댓글 목록'})
    expect(list).toBeInTheDocument()
    expect(list).toBeEmptyDOMElement()
  })
})
