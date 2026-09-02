import { commentsSchema } from '../schemas/comment'
import type { Comment } from '../types/comment'

export async function fetchComments(postId: number): Promise<Comment[]> {
  if (import.meta.env.DEV) console.log('[api] fetchComments 시작', postId)
  const response = await fetch('/data/comments.json')
  if (import.meta.env.DEV) console.log('[api] fetchComments 응답', response.status)
  if (!response.ok) throw new Error('댓글을 불러오지 못했습니다.')
  const result = commentsSchema.safeParse(await response.json())
  if (!result.success) throw new Error('댓글 데이터 형식이 올바르지 않습니다.')
  const comments = result.data.filter((comment) => comment.postId === postId)
  if (import.meta.env.DEV) console.log('[api] fetchComments 완료', comments.length)
  return comments
}
