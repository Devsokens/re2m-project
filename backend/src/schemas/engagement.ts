import { z } from 'zod';

export const targetTypeSchema = z.enum(['news', 'article']);

export const commentInputSchema = z.object({
  author: z.string().trim().optional().transform((v) => (v && v.length > 0 ? v : 'Anonyme')),
  text: z.string().min(1)
});

export const likeToggleSchema = z.object({
  visitorKey: z.string().min(1)
});

export const commentReplySchema = z.object({
  reply: z.string().min(1)
});
