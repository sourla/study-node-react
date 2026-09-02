import { DateTime } from 'luxon'
import type { Post } from '../types/post'

export function PostDetail({ post, backPath }: { post: Post; backPath: string }) {
  return (
    <article className="max-w-2xl rounded-2xl border border-white/10 bg-white/[.04] p-8">
      <a href={backPath} className="text-sm text-violet-300 hover:text-white">
        ← 목록으로
      </a>
      <p className="mt-8 text-xs uppercase tracking-widest text-zinc-500">POST #{post.id}</p>
      <h1 className="mt-3 text-4xl font-bold text-white">{post.title}</h1>
      <p className="mt-3 text-sm text-zinc-500">
        <span>{post.author} </span>·
        <time>
          {DateTime.fromISO(post.createdAt).setLocale('ko-KR').toLocaleString(DateTime.DATE_MED)}
        </time>
      </p>
      <p className="mt-10 leading-8 text-zinc-300">{post.content}</p>
    </article>
  )
}
