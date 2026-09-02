import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CsrDetailPage } from './CsrDetailPage'

afterEach(() => vi.restoreAllMocks())

const post = {
  id: 3,
  title: '상세 게시글',
  content: '상세 내용',
  author: 'tester',
  createdAt: '2026-09-03T00:00:00.000Z',
}
const comment = {
  id: 1,
  postId: 3,
  author: 'reader',
  content: '첫 댓글',
  createdAt: '2026-09-03T01:00:00.000Z',
}

function mockFetch(posts: unknown, comments: unknown) {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const body = String(input).includes('comments') ? comments : posts
    return body === null ? new Response(null, { status: 500 }) : new Response(JSON.stringify(body))
  })
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/csr/:id" element={<CsrDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CsrDetailPage', () => {
  it('URL의 id로 게시글과 댓글을 렌더링한다', async () => {
    mockFetch([post], [comment])
    renderAt('/csr/3')
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: '상세 게시글' })).toBeInTheDocument(),
    )
    expect(screen.getByText('첫 댓글')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '댓글 1' })).toBeInTheDocument()
  })

  it('댓글이 없는 게시글은 안내 문구를 보여 준다', async () => {
    mockFetch([post], [])
    renderAt('/csr/3')
    await waitFor(() => expect(screen.getByText('아직 댓글이 없습니다.')).toBeInTheDocument())
  })

  it('댓글 조회가 실패하면 오류를 표시한다', async () => {
    mockFetch([post], null)
    renderAt('/csr/3')
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('댓글을 불러오지 못했습니다.'),
    )
  })
})
