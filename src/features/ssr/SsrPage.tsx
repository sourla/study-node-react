import { useLoaderData } from 'react-router-dom'
import { PostList } from '../../common/components/PostList'
import type { Post } from '../../common/types/post'
export async function ssrLoader() { const response = await fetch('/data/posts.json'); if (!response.ok) throw new Response('게시글을 불러오지 못했습니다.', { status: response.status }); return response.json() as Promise<Post[]> }
export function SsrPage() { const posts = useLoaderData() as Post[]; return <main><div className="mb-10"><p className="mb-3 text-sm font-medium uppercase tracking-widest text-cyan-400">Server-side rendering</p><h1 className="mb-3 text-4xl font-bold tracking-tight text-white">SSR 게시판</h1><p className="text-zinc-400">라우트 loader가 public JSON을 조회합니다.</p></div><PostList posts={posts} /></main> }
