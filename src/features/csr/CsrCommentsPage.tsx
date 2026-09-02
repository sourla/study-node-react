import { Link, useParams } from 'react-router-dom'
import { CommentList } from '../../common/components/CommentList'
import type { Comment } from '../../common/types/comment'

const comments: Comment[] = [
  {
    postId: 1,
    id: 101,
    author: 'Alice',
    content: '좋은 글 잘 읽었습니다.',
    createdAt: '2026-09-01T12:00:00.000Z',
    updatedAt: '2026-09-01T12:10:00.000Z',
  },
  {
    postId: 1,
    id: 102,
    author: 'Bob',
    content: 'CSR 흐름을 이해하는 데 도움이 되었어요.',
    createdAt: '2026-09-02T14:30:00.000Z',
    updatedAt: '2026-09-02T14:40:00.000Z',
  },
]

export function CsrCommentsPage() {
  const { id } = useParams()
  const postComments = comments.map((comment) => ({ ...comment, postId: Number(id) }))

  return (
    <section>
      <Link to={`/csr/${id}`} className="text-sm text-violet-300 hover:text-white">
        ← 게시글로 돌아가기
      </Link>
      <div className="mb-8 mt-8">
        <p className="text-xs uppercase tracking-widest text-zinc-500">POST #{id}</p>
        <h1 className="mt-3 text-4xl font-bold text-white">댓글</h1>
        <p className="mt-3 text-zinc-400">게시글에 달린 댓글을 확인해보세요.</p>
      </div>
      <CommentList comments={postComments} />
    </section>
  )
}

export default CsrCommentsPage
