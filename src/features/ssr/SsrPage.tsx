import { useEffect } from 'react'
import { useLoaderData, useLocation } from 'react-router-dom'
import { PostList } from '../../common/components/PostList'
import type { Post } from '../../common/types/post'
import { ssrLoader } from './ssrLoader'
import type { Route } from './+types/SsrPage'

export function loader({ request }: Route.LoaderArgs) {
  return ssrLoader({ request })
}

export function SsrPage() {
  const posts = useLoaderData() as Post[]
  const location = useLocation()
  console.log('SSRPage_posts', posts);
  useEffect(() => {
    if (import.meta.env.DEV) console.log('[page] SsrPage 진입', location.pathname)
  }, [location.pathname])

  return (
    <main>
      <div className="mb-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-cyan-400">
          Server-side rendering
        </p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">SSR 게시판</h1>
        <p className="text-zinc-400">라우트 loader가 public JSON을 조회합니다.</p>
      </div>
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm">
        <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-bold text-zinc-950">
          1
        </span>
        <span className="text-white">목록</span>
        <span className="text-zinc-500">→</span>
        <span className="rounded-full border border-cyan-400/50 px-2 py-0.5 text-xs font-bold text-cyan-300">
          2
        </span>
        <span className="text-zinc-400">상세 화면 · 총 5개</span>
      </div>
      <PostList posts={posts} basePath="/ssr" />
    </main>
  )
}

export default SsrPage
