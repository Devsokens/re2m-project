import { z } from 'zod';

export const testimonialStatusSchema = z.enum(['soumis', 'publié', 'rejeté']);
export const testimonialSourceSchema = z.enum(['public', 'lien-privé', 'admin']);

export const testimonialInputSchema = z.object({
  company: z.string().min(1),
  service: z.string().min(1),
  text: z.string().min(1),
  logo: z.string().optional().default('')
});

export const publicTestimonialSchema = testimonialInputSchema;
