import { commentsSchema } from '../../common/schemas/comment'
import { postsSchema } from '../../common/schemas/post'

// 게시글과 댓글을 서버에서 병렬로 조회해 하나의 loader 데이터로 합친다.
// 결정: 댓글 조회 실패도 페이지 전체를 실패시킨다(단순함 우선). 부분 실패 허용은 docs/02 참고.
export async function ssrDetailLoader({
  params,
  request,
}: {
  params: { id?: string }
  request: Request
}) {
  const id = Number(params.id)
  if (import.meta.env.DEV)
    console.log('[route loader] /ssr/:id 실행 시작', params.id, new Date().toISOString())
  const [postsResponse, commentsResponse] = await Promise.all([
    fetch(new URL('/data/posts.json', request.url)),
    fetch(new URL('/data/comments.json', request.url)),
  ])
  if (import.meta.env.DEV)
    console.log('[route loader] /ssr/:id 응답 수신', postsResponse.status, commentsResponse.status)
  if (!postsResponse.ok) {
    throw new Response('게시글을 불러오지 못했습니다.', { status: postsResponse.status })
  }
  if (!commentsResponse.ok) {
    throw new Response('댓글을 불러오지 못했습니다.', { status: commentsResponse.status })
  }
  const posts = postsSchema.safeParse(await postsResponse.json())
  if (!posts.success) {
    throw new Response('게시글 데이터 형식이 올바르지 않습니다.', { status: 500 })
  }
  const comments = commentsSchema.safeParse(await commentsResponse.json())
  if (!comments.success) {
    throw new Response('댓글 데이터 형식이 올바르지 않습니다.', { status: 500 })
  }
  const post = posts.data.find((item) => item.id === id)
  if (!post) throw new Response('게시글을 찾을 수 없습니다.', { status: 404 })
  const postComments = comments.data.filter((comment) => comment.postId === id)
  if (import.meta.env.DEV)
    console.log('[route loader] /ssr/:id 데이터 반환', post.id, '댓글', postComments.length)
  return { post, comments: postComments }
}
