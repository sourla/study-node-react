import { useLoaderData } from 'react-router-dom'
import { CommentList } from '../../common/components/CommentList'
import { PostDetail } from '../../common/components/PostDetail'
import type { Comment } from '../../common/types/comment'
import type { Post } from '../../common/types/post'
import { ssrDetailLoader } from './ssrDetailLoader'
import type { Route } from './+types/SsrDetailPage'

export function loader({ params, request }: Route.LoaderArgs) {
  return ssrDetailLoader({ params, request })
}

export function SsrDetailPage() {
  const { post, comments } = useLoaderData() as { post: Post; comments: Comment[] }
  return (
    <>
      <PostDetail post={post} backPath="/ssr" />
      <CommentList comments={comments} />
    </>
  )
}

export default SsrDetailPage
