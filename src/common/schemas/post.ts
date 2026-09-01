import { z } from 'zod'

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  createdAt: z.iso.datetime(),
})

export const postsSchema = z.array(postSchema)
