import { z } from 'zod';

export const userRoleSchema = z.enum(['SUPER_ADMIN', 'ADMIN', 'CONSULTANT']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
