import type { Post } from '../types/post'
import { formatDate } from '../utils/formatDate'
import { Link } from 'react-router-dom'
export function PostList({ posts, basePath = '' }: { posts: Post[]; basePath?: string }) {
  return (
    <ul aria-label="게시글 목록" className="grid gap-4 md:grid-cols-2">
      {posts.map((post) => (
        <li
          className="group rounded-2xl border border-white/10 bg-white/[.04] p-6 transition hover:-translate-y-0.5 hover:border-violet-400/40"
          key={post.id}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-300">
              POST #{post.id}
            </span>
            <span className="text-xs text-zinc-500">{formatDate(post.createdAt)}</span>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">
            <Link to={`${basePath}/${post.id}`} className="hover:text-violet-300">
              {post.title}
            </Link>
          </h2>
          <p className="mb-6 leading-7 text-zinc-400">{post.content}</p>
          <small className="text-zinc-500">by {post.author}</small>
          <Link
            to={`${basePath}/${post.id}`}
            className="mt-4 block text-sm font-medium text-violet-300 opacity-0 transition group-hover:opacity-100 hover:text-violet-200"
          >
            상세 보기 →
          </Link>
        </li>
      ))}
    </ul>
  )
}
