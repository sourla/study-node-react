import { postsSchema } from '../../common/schemas/post'

export async function ssrDetailLoader({
  params,
  request,
}: {
  params: { id?: string }
  request: Request
}) {
  if (import.meta.env.DEV)
    console.log('[route loader] /ssr/:id 실행 시작', params.id, new Date().toISOString())
  const response = await fetch(new URL('/data/posts.json', request.url))
  if (import.meta.env.DEV) console.log('[route loader] /ssr/:id 응답 수신', response.status)
  if (!response.ok) {
    throw new Response('게시글을 불러오지 못했습니다.', { status: response.status })
  }
  const result = postsSchema.safeParse(await response.json())
  if (!result.success) {
    throw new Response('게시글 데이터 형식이 올바르지 않습니다.', { status: 500 })
  }
  const post = result.data.find((item) => item.id === Number(params.id))
  if (!post) throw new Response('게시글을 찾을 수 없습니다.', { status: 404 })
  if (import.meta.env.DEV) console.log('[route loader] /ssr/:id 데이터 반환', post)
  return post
}
