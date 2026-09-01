import { useLoaderData } from 'react-router-dom'
import { PostDetail } from '../../common/components/PostDetail'
import type { Post } from '../../common/types/post'
import type { Route } from './+types/SsrDetailPage'

export async function ssrDetailLoader({ params, request }: { params: { id?: string }; request: Request }) {
  const response = await fetch(new URL('/data/posts.json', request.url))
  if (!response.ok) throw new Response('게시글을 불러오지 못했습니다.', { status: response.status })
  const posts = (await response.json()) as Post[]
  const post = posts.find((item) => item.id === Number(params.id))
  if (!post) throw new Response('게시글을 찾을 수 없습니다.', { status: 404 })
  return post
}

export function loader({ params, request }: Route.LoaderArgs) {
  return ssrDetailLoader({ params, request })
}

export function SsrDetailPage() {
  const post = useLoaderData() as Post
  return <PostDetail post={post} backPath="/ssr" />
}

export default SsrDetailPage
