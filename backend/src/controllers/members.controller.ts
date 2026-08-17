import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { memberInputSchema } from '../schemas/member.js';
import { notFound } from '../lib/errors.js';

const MEMBER_COLUMNS =
  'id, civility, last_name, first_name, title, department, bio, photo, email, mobile, phone, address, linkedin, website, qr_color, qr_background, status, scan_count, created_at, updated_at, created_by';

// DB rows use snake_case; the frontend's Member type uses camelCase — map at the boundary.
const toApiMember = (row: any) => ({
  id: row.id,
  civility: row.civility,
  lastName: row.last_name,
  firstName: row.first_name,
  title: row.title,
  department: row.department,
  bio: row.bio ?? '',
  photo: row.photo ?? '',
  email: row.email,
  mobile: row.mobile,
  phone: row.phone ?? '',
  address: row.address,
  linkedin: row.linkedin ?? '',
  website: row.website ?? '',
  qrColor: row.qr_color,
  qrBackground: row.qr_background,
  status: row.status,
  scanCount: row.scan_count,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  createdBy: row.created_by
});

const logActivity = async (params: {
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SCAN';
  targetMember?: string;
  details: string;
}) => {
  await supabaseAdmin.from('activity_logs').insert({
    user_label: params.user,
    action: params.action,
    target_member: params.targetMember,
    details: params.details
  });
};

export const listMembers = async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('members')
    .select(MEMBER_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) throw error;
  res.json(data.map(toApiMember));
};

export const getMember = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('members').select(MEMBER_COLUMNS).eq('id', req.params.id).maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Membre');
  res.json(toApiMember(data));
};

export const createMember = async (req: Request, res: Response) => {
  const input = memberInputSchema.parse(req.body);
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('members')
    .insert({
      id: input.id,
      civility: input.civility,
      last_name: input.lastName,
      first_name: input.firstName,
      title: input.title,
      department: input.department,
      bio: input.bio,
      photo: input.photo,
      email: input.email,
      mobile: input.mobile,
      phone: input.phone,
      address: input.address,
      linkedin: input.linkedin,
      website: input.website,
      qr_color: input.qrColor,
      qr_background: input.qrBackground,
      status: input.status,
      scan_count: input.scanCount,
      created_at: now,
      updated_at: now,
      created_by: req.user!.id
    })
    .select(MEMBER_COLUMNS)
    .single();

  if (error) throw error;

  await logActivity({
    user: req.user!.role,
    action: 'CREATE',
    targetMember: input.id,
    details: `Création du membre ${input.firstName} ${input.lastName} (${input.title})`
  });

  res.status(201).json(toApiMember(data));
};

export const updateMember = async (req: Request, res: Response) => {
  const input = memberInputSchema.parse({ ...req.body, id: req.params.id });

  const { data, error } = await supabaseAdmin
    .from('members')
    .update({
      civility: input.civility,
      last_name: input.lastName,
      first_name: input.firstName,
      title: input.title,
      department: input.department,
      bio: input.bio,
      photo: input.photo,
      email: input.email,
      mobile: input.mobile,
      phone: input.phone,
      address: input.address,
      linkedin: input.linkedin,
      website: input.website,
      qr_color: input.qrColor,
      qr_background: input.qrBackground,
      status: input.status,
      scan_count: input.scanCount,
      updated_at: new Date().toISOString()
    })
    .eq('id', req.params.id)
    .select(MEMBER_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw notFound('Membre');

  await logActivity({
    user: req.user!.role,
    action: 'UPDATE',
    targetMember: input.id,
    details: `Mise à jour des coordonnées & design de ${input.firstName} ${input.lastName}`
  });

  res.json(toApiMember(data));
};

export const deleteMember = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('members').delete().eq('id', req.params.id).select('first_name, last_name').maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Membre');

  await logActivity({
    user: req.user!.role,
    action: 'DELETE',
    targetMember: req.params.id,
    details: `Suppression du membre ${data.first_name} ${data.last_name}`
  });

  res.status(204).send();
};

// Public — fired when a visitor opens a member's virtual card (QR scan or direct link).
export const recordScan = async (req: Request, res: Response) => {
  const { data: current, error: fetchError } = await supabaseAdmin
    .from('members')
    .select('scan_count')
    .eq('id', req.params.id)
    .maybeSingle();
  if (fetchError) throw fetchError;
  if (!current) throw notFound('Membre');

  const { data, error } = await supabaseAdmin
    .from('members')
    .update({ scan_count: current.scan_count + 1, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select(MEMBER_COLUMNS)
    .single();
  if (error) throw error;

  await logActivity({ user: 'Visiteur', action: 'SCAN', targetMember: req.params.id, details: 'Consultation de la carte virtuelle' });

  res.json(toApiMember(data));
};

export const listActivityLogs = async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('activity_logs')
    .select('id, timestamp, user_label, action, target_member, details')
    .order('timestamp', { ascending: false })
    .limit(200);
  if (error) throw error;
  res.json(
    data.map((row) => ({
      id: row.id,
      timestamp: row.timestamp,
      user: row.user_label,
      action: row.action,
      targetMember: row.target_member,
      details: row.details
    }))
  );
};
