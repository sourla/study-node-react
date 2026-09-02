import { Link, useParams } from 'react-router-dom'
import { CommentList } from '../../common/components/CommentList'
import type { Comment } from '../../common/types/comment'

const comments: Comment[] = [
  {
    postId: 1,
    id: 201,
    author: 'Server User',
    content: '서버에서 렌더링된 댓글 화면입니다.',
    createdAt: '2026-09-03T09:00:00.000Z',
    updatedAt: '2026-09-03T09:00:00.000Z',
  },
]

export function SsrCommentsPage() {
  const { id } = useParams()
  const postComments = comments.map((comment) => ({ ...comment, postId: Number(id) }))

  return (
    <section>
      <Link to={`/ssr/${id}`} className="text-sm text-cyan-300 hover:text-white">
        ← 게시글로 돌아가기
      </Link>
      <div className="mb-8 mt-8">
        <p className="text-xs uppercase tracking-widest text-zinc-500">POST #{id}</p>
        <h1 className="mt-3 text-4xl font-bold text-white">댓글</h1>
        <p className="mt-3 text-zinc-400">loader 기반 SSR 댓글 화면입니다.</p>
      </div>
      <CommentList comments={postComments} />
    </section>
  )
}

export default SsrCommentsPage
