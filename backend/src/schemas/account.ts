import { z } from 'zod';
import { userRoleSchema } from './auth.js';

export const modulePermissionSchema = z.object({
  read: z.boolean(),
  edit: z.boolean()
});

export const permissionsSchema = z.record(z.string(), modulePermissionSchema).optional().default({});

export const createAccountSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: userRoleSchema,
  status: z.enum(['active', 'inactive']).optional().default('active'),
  permissions: permissionsSchema
});

export const updateAccountSchema = z.object({
  name: z.string().min(1),
  role: userRoleSchema,
  status: z.enum(['active', 'inactive']),
  permissions: permissionsSchema
});
