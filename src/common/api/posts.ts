import type { Post } from '../types/post'
export async function fetchPosts(): Promise<Post[]> { const response = await fetch('/data/posts.json'); if (!response.ok) throw new Error('게시글을 불러오지 못했습니다.'); return response.json() as Promise<Post[]> }
