import {DateTime} from 'luxon'
import type {Comment} from "../types/comment.ts";

export function CommentList({comments}: { comments: Comment[] }) {
  return (
      <ul aria-label="댓글 목록" className="grid gap-4 md:grid-cols-2">
        {comments.map((comment) => (
            <li
                className="group rounded-2xl border border-white/10 bg-white/[.04] p-6 transition hover:-translate-y-0.5 hover:border-violet-400/40"
                key={comment.postId}
            >
              <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-300">
              {`댓글 ${comment.postId} ${comment.id} ${comment.author}`}
            </span>
                <span className="text-xs text-zinc-500">
              {DateTime.fromISO(comment.createdAt).setLocale('ko-KR').toLocaleString(DateTime.DATE_MED)}
            </span>
              </div>
              <p className="mb-6 leading-7 text-zinc-400">{comment.content}</p>
            </li>
        ))}
      </ul>
  )
}
