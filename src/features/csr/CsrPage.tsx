import { useEffect, useState } from 'react'
import { PostList } from '../../common/components/PostList'
import { fetchPosts } from '../../common/api/posts'
import type { Post } from '../../common/types/post'
export function CsrPage() { const [posts, setPosts] = useState<Post[]>([]); const [error, setError] = useState<string>(); useEffect(() => { fetchPosts().then(setPosts).catch((reason: Error) => setError(reason.message)) }, []); return <main><div className="mb-10"><p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-400">Client-side rendering</p><h1 className="mb-3 text-4xl font-bold tracking-tight text-white">CSR 게시판</h1><p className="text-zinc-400">브라우저에서 public JSON을 조회합니다.</p></div>{error ? <p role="alert" className="text-red-400">{error}</p> : posts.length ? <PostList posts={posts} /> : <p className="text-zinc-500">게시글을 불러오는 중...</p>}</main> }
