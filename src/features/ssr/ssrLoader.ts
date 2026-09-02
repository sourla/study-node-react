import { postsSchema } from '../../common/schemas/post'

export async function ssrLoader({ request }: { request: Request }) {
  if (import.meta.env.DEV)
    console.log('[route loader] /ssr 첫 진입/실행 시작', new Date().toISOString())
  const response = await fetch(new URL('/data/posts.json', request.url))
  if (import.meta.env.DEV) console.log('[route loader] /ssr 응답 수신', response.status)
  if (!response.ok) {
    throw new Response('게시글을 불러오지 못했습니다.', {
      status: response.status,
    })
  }
  const result = postsSchema.safeParse(await response.json())
  if (!result.success) {
    throw new Response('게시글 데이터 형식이 올바르지 않습니다.', {
      status: 500,
    })
  }
  if (import.meta.env.DEV) console.log('[route loader] /ssr 데이터 반환', result.data)
  return result.data
}
