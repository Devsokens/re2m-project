import type { UserRole } from '../schemas/auth.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        // Only meaningful for ADMIN — SUPER_ADMIN bypasses permission checks
        // entirely, CONSULTANT never gets write access regardless of this map.
        permissions?: Record<string, { read: boolean; edit: boolean }>;
      };
    }
  }
}

export {};
