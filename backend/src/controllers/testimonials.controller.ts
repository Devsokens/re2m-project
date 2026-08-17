import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../lib/supabase.js';
import { testimonialInputSchema, publicTestimonialSchema } from '../schemas/testimonial.js';
import { badRequest, notFound } from '../lib/errors.js';

const COLUMNS = 'id, company, service, body, logo, status, source, submitted_at, rejected_at';

const toApi = (row: any) => ({
  id: row.id,
  company: row.company,
  service: row.service,
  text: row.body,
  logo: row.logo ?? '',
  status: row.status,
  source: row.source,
  submittedAt: row.submitted_at,
  rejectedAt: row.rejected_at
});

// GET /api/testimonials — admin sees everything, public callers only ever get "publié"
export const listTestimonials = async (req: Request, res: Response) => {
  let query = supabaseAdmin.from('testimonials').select(COLUMNS).order('submitted_at', { ascending: false });
  if (!req.user) {
    query = query.eq('status', 'publié');
  }
  const { data, error } = await query;
  if (error) throw error;
  res.json(data.map(toApi));
};

// POST /api/testimonials — admin creates one directly as "publié"
export const createTestimonial = async (req: Request, res: Response) => {
  const input = testimonialInputSchema.parse(req.body);
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .insert({ company: input.company, service: input.service, body: input.text, logo: input.logo, status: 'publié', source: 'admin' })
    .select(COLUMNS)
    .single();
  if (error) throw error;
  res.status(201).json(toApi(data));
};

// PUT /api/testimonials/:id — admin edits a testimonial regardless of status
export const updateTestimonial = async (req: Request, res: Response) => {
  const input = testimonialInputSchema.parse(req.body);
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .update({ company: input.company, service: input.service, body: input.text, logo: input.logo })
    .eq('id', req.params.id)
    .select(COLUMNS)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Témoignage');
  res.json(toApi(data));
};

// POST /api/testimonials/public — public submission, no token required
export const submitPublicTestimonial = async (req: Request, res: Response) => {
  const input = publicTestimonialSchema.parse(req.body);
  const { error } = await supabaseAdmin
    .from('testimonials')
    .insert({ company: input.company, service: input.service, body: input.text, logo: input.logo, status: 'soumis', source: 'public' });
  if (error) throw error;
  res.status(201).json({ ok: true });
};

// POST /api/testimonials/tokens — admin generates a private-link invitation token
export const createShareToken = async (_req: Request, res: Response) => {
  const token = randomUUID().replace(/-/g, '').slice(0, 12);
  const { error } = await supabaseAdmin.from('testimonial_tokens').insert({ token });
  if (error) throw error;
  res.status(201).json({ token });
};

// POST /api/testimonials/submit/:token — public submission via a private invitation link
export const submitViaToken = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { data: tokenRow, error: tokenError } = await supabaseAdmin.from('testimonial_tokens').select('token').eq('token', token).maybeSingle();
  if (tokenError) throw tokenError;
  if (!tokenRow) throw badRequest('Lien invalide ou expiré.');

  const input = publicTestimonialSchema.parse(req.body);
  const { error } = await supabaseAdmin
    .from('testimonials')
    .insert({ company: input.company, service: input.service, body: input.text, logo: input.logo, status: 'soumis', source: 'lien-privé' });
  if (error) throw error;
  res.status(201).json({ ok: true });
};

export const checkToken = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('testimonial_tokens').select('token').eq('token', req.params.token).maybeSingle();
  if (error) throw error;
  res.json({ valid: !!data });
};

// soumis -> publié
export const approveTestimonial = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .update({ status: 'publié' })
    .eq('id', req.params.id)
    .select(COLUMNS)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Témoignage');
  res.json(toApi(data));
};

// soumis|publié -> rejeté (kept, not deleted)
export const rejectTestimonial = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .update({ status: 'rejeté', rejected_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select(COLUMNS)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Témoignage');
  res.json(toApi(data));
};

// rejeté -> publié
export const republishTestimonial = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .update({ status: 'publié', rejected_at: null })
    .eq('id', req.params.id)
    .select(COLUMNS)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Témoignage');
  res.json(toApi(data));
};
