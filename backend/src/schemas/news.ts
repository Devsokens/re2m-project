import { z } from 'zod';

export const newsInputSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  date: z.string().min(1),
  image: z.string().optional().default(''),
  tag: z.string().optional().default('')
});
