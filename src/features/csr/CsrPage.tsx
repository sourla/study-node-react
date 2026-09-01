import { useEffect, useState } from 'react'
import { PostList } from '../../common/components/PostList'
import { fetchPosts } from '../../common/api/posts'
import type { Post } from '../../common/types/post'

export function CsrPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState<string>()

  useEffect(() => {
    console.log('[page] CsrPage useEffect 실행')
    fetchPosts()
      .then((data) => {
        console.log('[page] CsrPage 게시글 저장', data.length)
        setPosts(data)
      })
      .catch((reason: Error) => {
        console.error('[page] CsrPage 오류', reason)
        setError(reason.message)
      })
  }, [])

  return (
    <main>
      <div className="mb-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-400">
          Client-side rendering
        </p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">CSR 게시판</h1>
        <p className="text-zinc-400">브라우저에서 public JSON을 조회합니다.</p>
      </div>
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-400/5 px-4 py-3 text-sm">
        <span className="rounded-full bg-violet-400 px-2 py-0.5 text-xs font-bold text-zinc-950">1</span>
        <span className="text-white">목록</span><span className="text-zinc-500">→</span>
        <span className="rounded-full border border-violet-400/50 px-2 py-0.5 text-xs font-bold text-violet-300">2</span>
        <span className="text-zinc-400">상세 화면 · 총 5개</span>
      </div>
      {error ? (
        <p role="alert" className="text-red-400">
          {error}
        </p>
      ) : posts.length ? (
        <PostList posts={posts} basePath="/csr" />
      ) : (
        <p className="text-zinc-500">게시글을 불러오는 중...</p>
      )}
    </main>
  )
}

export default CsrPage
