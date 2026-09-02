import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPost } from '../../common/api/posts'
import { PostDetail } from '../../common/components/PostDetail'
import type { Post } from '../../common/types/post'
export function CsrDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState<Post>()
  useEffect(() => {
    if (id) fetchPost(Number(id)).then(setPost)
  }, [id])
  return post ? (
    <PostDetail post={post} backPath="/csr" commentsPath={`/csr/${post.id}/comments`} />
  ) : (
    <p className="text-zinc-500">게시글을 불러오는 중...</p>
  )
}

export default CsrDetailPage
