import { z } from 'zod';

export const requestTypeSchema = z.enum(['Audit & Conseil', 'Formation', 'Partenariat', 'Autre']);

export const requestInputSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional().default(''),
  email: z.string().email(),
  phone: z.string().optional().default(''),
  type: requestTypeSchema,
  message: z.string().min(1)
});

export const requestStatusUpdateSchema = z
  .object({
    status: z.enum(['scheduled', 'refused']),
    meetingDate: z.string().optional()
  })
  .refine((v) => v.status !== 'scheduled' || Boolean(v.meetingDate), {
    message: 'La date du rendez-vous est requise.',
    path: ['meetingDate']
  });
