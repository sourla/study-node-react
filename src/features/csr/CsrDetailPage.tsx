import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchComments } from '../../common/api/comments'
import { fetchPost } from '../../common/api/posts'
import { CommentList } from '../../common/components/CommentList'
import { PostDetail } from '../../common/components/PostDetail'
import type { Comment } from '../../common/types/comment'
import type { Post } from '../../common/types/post'

export function CsrDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState<Post>()
  const [comments, setComments] = useState<Comment[]>([])
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!id) return
    if (import.meta.env.DEV) console.log('[page] CsrDetailPage useEffect 실행', id)
    // 게시글과 댓글을 브라우저에서 병렬로 조회한다. 둘 중 하나라도 실패하면 오류 상태.
    Promise.all([fetchPost(Number(id)), fetchComments(Number(id))])
      .then(([post, comments]) => {
        setPost(post)
        setComments(comments)
      })
      .catch((reason: Error) => {
        console.error('[page] CsrDetailPage 오류', reason)
        setError(reason.message)
      })
  }, [id])

  if (error) {
    return (
      <p role="alert" className="text-red-400">
        {error}
      </p>
    )
  }
  return post ? (
    <>
      <PostDetail post={post} backPath="/csr" />
      <CommentList comments={comments} />
    </>
  ) : (
    <p className="text-zinc-500">게시글을 불러오는 중...</p>
  )
}

export default CsrDetailPage
