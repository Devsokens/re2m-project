import type { NextFunction, Request, Response } from 'express';
import { supabaseAdmin, supabaseAnon } from '../lib/supabase.js';
import { forbidden, unauthorized } from '../lib/errors.js';
import { UserRole, userRoleSchema } from '../schemas/auth.js';
import { asyncHandler } from '../lib/asyncHandler.js';

// Verifies the caller's Supabase JWT (sent as `Authorization: Bearer <token>`),
// then looks up their role in user_accounts — a valid Supabase session alone
// is not enough to act as an admin, the account must exist there and be active.
export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw unauthorized();

  const { data: authData, error: authError } = await supabaseAnon.auth.getUser(token);
  if (authError || !authData.user) throw unauthorized('Session invalide ou expirée.');

  const { data: account, error: accountError } = await supabaseAdmin
    .from('user_accounts')
    .select('id, name, email, role, status, permissions')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (accountError) throw accountError;
  if (!account || account.status !== 'active') {
    throw forbidden('Ce compte ne dispose pas des accès administrateur.');
  }

  const role = userRoleSchema.parse(account.role);
  req.user = { id: account.id, email: account.email, name: account.name, role, permissions: account.permissions ?? {} };
  next();
});

// For routes that behave differently for admins vs the public (e.g. a list
// endpoint that shows everything to an admin but only published rows to
// anyone else) — populates req.user when a valid token is present, but never
// rejects the request when it's absent or invalid.
export const optionalAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  const { data: authData } = await supabaseAnon.auth.getUser(token);
  if (!authData.user) return next();

  const { data: account } = await supabaseAdmin
    .from('user_accounts')
    .select('id, name, email, role, status')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (account && account.status === 'active') {
    req.user = { id: account.id, email: account.email, name: account.name, role: userRoleSchema.parse(account.role) };
  }
  next();
});

export const requireRole = (...allowed: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) throw unauthorized();
  if (!allowed.includes(req.user.role)) {
    throw forbidden(`Cette action nécessite un rôle parmi : ${allowed.join(', ')}.`);
  }
  next();
};

// Module-level permission enforcement for ADMIN accounts. SUPER_ADMIN always
// passes; CONSULTANT never does (that role has no admin-write permissions by
// design). For ADMIN, the actual read/edit flags set per module in the
// Comptes screen (user_accounts.permissions) are what decides access — this
// is what makes those toggles actually mean something server-side, instead
// of being a decorative UI-only setting.
export const requirePermission = (moduleKey: string, action: 'read' | 'edit') => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) throw unauthorized();
  if (req.user.role === 'SUPER_ADMIN') return next();
  if (req.user.role !== 'ADMIN') {
    throw forbidden(`Cette action nécessite la permission "${action}" sur le module "${moduleKey}".`);
  }
  const perm = req.user.permissions?.[moduleKey];
  if (!perm?.[action]) {
    throw forbidden(`Votre compte n'a pas la permission "${action === 'edit' ? 'Éditer' : 'Lire'}" sur le module "${moduleKey}".`);
  }
  next();
};
