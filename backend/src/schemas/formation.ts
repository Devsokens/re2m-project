import { z } from 'zod';

export const certificateTemplateIdSchema = z.enum(['re2m-classique', 'moderne', 'corporate']);

export const formationInputSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  location: z.string().min(1),
  description: z.string().optional().default(''),
  templateId: certificateTemplateIdSchema,
  signerName: z.string().min(1),
  signerTitle: z.string().min(1)
});

export const participantInputSchema = z.object({
  id: z.string().min(1).optional(),
  fullName: z.string().min(1),
  email: z.string().optional().default(''),
  organization: z.string().optional().default(''),
  present: z.boolean().optional().default(true)
});

export const bulkParticipantsSchema = z.object({
  participants: z.array(participantInputSchema).min(1)
});
