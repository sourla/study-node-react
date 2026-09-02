import { z } from 'zod'

export const commentSchema = z.object({
  id: z.number(),
  postId: z.number(),
  author: z.string(),
  content: z.string(),
  createdAt: z.iso.datetime(),
})

export const commentsSchema = z.array(commentSchema)
