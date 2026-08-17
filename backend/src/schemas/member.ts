import { z } from 'zod';

export const civilitySchema = z.enum(['M.', 'Mme', 'Dr', 'Pr']);
export const memberStatusSchema = z.enum(['active', 'inactive', 'pending']);

export const memberInputSchema = z.object({
  id: z.string().min(1),
  civility: civilitySchema,
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  title: z.string().min(1),
  department: z.string().min(1),
  bio: z.string().optional().default(''),
  photo: z.string().optional().default(''),
  email: z.string().email(),
  mobile: z.string().min(1),
  phone: z.string().optional().default(''),
  address: z.string().min(1),
  linkedin: z.string().optional().default(''),
  website: z.string().optional().default(''),
  qrColor: z.string().min(1),
  qrBackground: z.string().min(1),
  status: memberStatusSchema,
  scanCount: z.number().int().nonnegative().default(0)
});

export type MemberInput = z.infer<typeof memberInputSchema>;
