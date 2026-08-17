import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { bulkParticipantsSchema, formationInputSchema, participantInputSchema } from '../schemas/formation.js';
import { notFound } from '../lib/errors.js';

const FORMATION_COLUMNS = 'id, title, date, location, description, template_id, signer_name, signer_title';
const PARTICIPANT_COLUMNS = 'id, formation_id, full_name, email, organization, present';

const toApiFormation = (row: any) => ({
  id: row.id,
  title: row.title,
  date: row.date,
  location: row.location,
  description: row.description ?? '',
  templateId: row.template_id,
  signerName: row.signer_name,
  signerTitle: row.signer_title,
  participantCount: row.participants?.[0]?.count ?? 0
});

const toApiParticipant = (row: any) => ({
  id: row.id,
  formationId: row.formation_id,
  fullName: row.full_name,
  email: row.email ?? '',
  organization: row.organization ?? '',
  present: row.present
});

export const listFormations = async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('formations')
    .select(`${FORMATION_COLUMNS}, participants(count)`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  res.json(data.map(toApiFormation));
};

export const createFormation = async (req: Request, res: Response) => {
  const input = formationInputSchema.parse(req.body);
  const { data, error } = await supabaseAdmin
    .from('formations')
    .insert({
      id: input.id,
      title: input.title,
      date: input.date,
      location: input.location,
      description: input.description,
      template_id: input.templateId,
      signer_name: input.signerName,
      signer_title: input.signerTitle
    })
    .select(FORMATION_COLUMNS)
    .single();
  if (error) throw error;
  res.status(201).json(toApiFormation(data));
};

export const deleteFormation = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('formations').delete().eq('id', req.params.id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Formation');
  res.status(204).send();
};

export const listParticipants = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('participants').select(PARTICIPANT_COLUMNS).eq('formation_id', req.params.id);
  if (error) throw error;
  res.json(data.map(toApiParticipant));
};

export const addParticipant = async (req: Request, res: Response) => {
  const input = participantInputSchema.parse(req.body);
  const { data, error } = await supabaseAdmin
    .from('participants')
    .insert({
      id: input.id || `PAR-${Date.now()}`,
      formation_id: req.params.id,
      full_name: input.fullName,
      email: input.email,
      organization: input.organization,
      present: input.present
    })
    .select(PARTICIPANT_COLUMNS)
    .single();
  if (error) throw error;
  res.status(201).json(toApiParticipant(data));
};

export const addParticipantsBulk = async (req: Request, res: Response) => {
  const { participants } = bulkParticipantsSchema.parse(req.body);
  const rows = participants.map((p, idx) => ({
    id: p.id || `PAR-${Date.now()}-${idx}`,
    formation_id: req.params.id,
    full_name: p.fullName,
    email: p.email,
    organization: p.organization,
    present: p.present
  }));
  const { data, error } = await supabaseAdmin.from('participants').insert(rows).select(PARTICIPANT_COLUMNS);
  if (error) throw error;
  res.status(201).json(data.map(toApiParticipant));
};

export const updateParticipant = async (req: Request, res: Response) => {
  const input = participantInputSchema.parse({ ...req.body, id: req.params.participantId });
  const { data, error } = await supabaseAdmin
    .from('participants')
    .update({ full_name: input.fullName, email: input.email, organization: input.organization, present: input.present })
    .eq('id', req.params.participantId)
    .select(PARTICIPANT_COLUMNS)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Participant');
  res.json(toApiParticipant(data));
};

export const deleteParticipant = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('participants').delete().eq('id', req.params.participantId).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Participant');
  res.status(204).send();
};
