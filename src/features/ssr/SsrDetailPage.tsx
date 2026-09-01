import { useLoaderData } from 'react-router-dom'
import { PostDetail } from '../../common/components/PostDetail'
import type { Post } from '../../common/types/post'

export async function ssrDetailLoader({ params }: { params: { id?: string } }) {
  const response = await fetch('/data/posts.json')
  if (!response.ok) throw new Response('게시글을 불러오지 못했습니다.', { status: response.status })
  const posts = (await response.json()) as Post[]
  const post = posts.find((item) => item.id === Number(params.id))
  if (!post) throw new Response('게시글을 찾을 수 없습니다.', { status: 404 })
  return post
}

export function SsrDetailPage() {
  const post = useLoaderData() as Post
  return <PostDetail post={post} backPath="/ssr" />
}
