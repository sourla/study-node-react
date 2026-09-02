import { useLoaderData } from 'react-router-dom'
import { PostDetail } from '../../common/components/PostDetail'
import type { Post } from '../../common/types/post'
import { ssrDetailLoader } from './ssrDetailLoader'
import type { Route } from './+types/SsrDetailPage'

export function loader({ params, request }: Route.LoaderArgs) {
  return ssrDetailLoader({ params, request })
}

export function SsrDetailPage() {
  const post = useLoaderData() as Post
  return <PostDetail post={post} backPath="/ssr" commentsPath={`/ssr/${post.id}/comments`} />
}

export default SsrDetailPage
