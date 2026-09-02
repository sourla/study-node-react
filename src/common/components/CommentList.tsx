import type { Comment } from '../types/comment'
import { formatDate } from '../utils/formatDate'

export function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <section aria-label="댓글" className="mt-8 max-w-2xl">
      <h2 className="mb-4 text-lg font-semibold text-white">댓글 {comments.length}</h2>
      {comments.length === 0 ? (
        <p className="text-zinc-500">아직 댓글이 없습니다.</p>
      ) : (
        <ul aria-label="댓글 목록" className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-xl border border-white/10 bg-white/[.04] p-4">
              <p className="leading-7 text-zinc-300">{comment.content}</p>
              <p className="mt-2 text-xs text-zinc-500">
                {comment.author} · {formatDate(comment.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
