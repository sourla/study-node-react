import { postsSchema } from '../../common/schemas/post'

export async function ssrLoader() {
  const response = await fetch('/data/posts.json')
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
  return result.data
}
