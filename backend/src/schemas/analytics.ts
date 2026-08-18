import { z } from 'zod';

export const pageViewInputSchema = z.object({
  path: z.string().min(1),
  visitorKey: z.string().min(1)
});

export const visitsPeriodSchema = z.enum(['day', 'week', 'month', 'year']);
