import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { createAccountSchema, updateAccountSchema } from '../schemas/account.js';
import { badRequest, notFound } from '../lib/errors.js';

const COLUMNS = 'id, name, email, role, status, permissions, created_at';

const toApiAccount = (row: any) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  status: row.status,
  permissions: row.permissions ?? {},
  createdAt: row.created_at
});

const generateTempPassword = () => crypto.randomBytes(12).toString('base64url');

export const listAccounts = async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('user_accounts').select(COLUMNS).order('created_at', { ascending: true });
  if (error) throw error;
  res.json(data.map(toApiAccount));
};

// Creates a real Supabase Auth login (not just a decorative row) so the new
// admin can actually sign in — a temporary password is generated and returned
// once in the response for the caller to communicate manually.
export const createAccount = async (req: Request, res: Response) => {
  const input = createAccountSchema.parse(req.body);
  const tempPassword = generateTempPassword();

  const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password: tempPassword,
    email_confirm: true
  });
  if (createErr) throw badRequest(createErr.message);

  const { data, error } = await supabaseAdmin
    .from('user_accounts')
    .insert({
      id: created.user.id,
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.status,
      permissions: input.permissions
    })
    .select(COLUMNS)
    .single();

  if (error) {
    // Roll back the just-created Auth user so we don't leave an orphaned login.
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    throw error;
  }

  res.status(201).json({ ...toApiAccount(data), tempPassword });
};

export const updateAccount = async (req: Request, res: Response) => {
  const input = updateAccountSchema.parse(req.body);
  const { data, error } = await supabaseAdmin
    .from('user_accounts')
    .update({
      name: input.name,
      role: input.role,
      status: input.status,
      permissions: input.permissions
    })
    .eq('id', req.params.id)
    .select(COLUMNS)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Compte');
  res.json(toApiAccount(data));
};

export const deleteAccount = async (req: Request, res: Response) => {
  if (req.params.id === req.user?.id) {
    throw badRequest('Vous ne pouvez pas supprimer votre propre compte.');
  }
  const { data, error } = await supabaseAdmin.from('user_accounts').delete().eq('id', req.params.id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Compte');
  await supabaseAdmin.auth.admin.deleteUser(req.params.id);
  res.status(204).send();
};
