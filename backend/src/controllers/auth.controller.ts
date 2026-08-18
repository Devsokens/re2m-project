import type { Request, Response } from 'express';
import { supabaseAdmin, supabaseAnon } from '../lib/supabase.js';
import { loginSchema, userRoleSchema } from '../schemas/auth.js';
import { forbidden, unauthorized } from '../lib/errors.js';

export const login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    throw unauthorized('Identifiants de connexion invalides.');
  }

  const { data: account, error: accountError } = await supabaseAdmin
    .from('user_accounts')
    .select('id, name, email, role, status, permissions')
    .eq('id', data.user.id)
    .maybeSingle();

  if (accountError) throw accountError;
  if (!account || account.status !== 'active') {
    throw forbidden('Ce compte ne dispose pas des accès administrateur.');
  }

  res.json({
    token: data.session.access_token,
    user: {
      id: account.id,
      name: account.name,
      email: account.email,
      role: userRoleSchema.parse(account.role),
      permissions: account.permissions ?? {}
    }
  });
};

// Supabase Bearer-token sessions are stateless on the server side — the
// frontend simply discards the token. Exposed for API completeness/docs.
export const logout = async (_req: Request, res: Response) => {
  res.status(204).send();
};

export const me = async (req: Request, res: Response) => {
  res.json({ user: req.user });
};
