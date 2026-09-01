import { postsSchema } from '../schemas/post'
import type { Post } from '../types/post'

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('/data/posts.json')
  if (!response.ok) throw new Error('게시글을 불러오지 못했습니다.')
  const result = postsSchema.safeParse(await response.json())
  if (!result.success) throw new Error('게시글 데이터 형식이 올바르지 않습니다.')
  return result.data
}

export async function fetchPost(id: number): Promise<Post> {
  const posts = await fetchPosts()
  const post = posts.find((item) => item.id === id)
  if (!post) throw new Error('게시글을 찾을 수 없습니다.')
  return post
}
