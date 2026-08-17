import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { requestInputSchema, requestStatusUpdateSchema } from '../schemas/request.js';
import { notFound } from '../lib/errors.js';
import { sendMail } from '../lib/mail.js';

const COLUMNS = 'id, name, company, email, phone, type, message, status, received_at, meeting_date';

const toApiRequest = (row: any) => ({
  id: row.id,
  name: row.name,
  company: row.company ?? '',
  email: row.email,
  phone: row.phone ?? '',
  type: row.type,
  message: row.message,
  status: row.status,
  receivedAt: row.received_at,
  meetingDate: row.meeting_date ?? undefined
});

export const listRequests = async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('requests').select(COLUMNS).order('received_at', { ascending: false });
  if (error) throw error;
  res.json(data.map(toApiRequest));
};

export const createRequest = async (req: Request, res: Response) => {
  const input = requestInputSchema.parse(req.body);
  const { data, error } = await supabaseAdmin
    .from('requests')
    .insert({
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      type: input.type,
      message: input.message
    })
    .select(COLUMNS)
    .single();
  if (error) throw error;

  await sendMail({
    to: input.email,
    subject: 'Votre demande a bien été reçue — Cabinet RE2M',
    html: `<p>Bonjour ${input.name},</p><p>Nous avons bien reçu votre demande (${input.type}) et notre équipe reviendra vers vous sous 24 à 48 heures.</p><p>Cordialement,<br/>Le Cabinet RE2M</p>`
  });

  res.status(201).json(toApiRequest(data));
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  const input = requestStatusUpdateSchema.parse(req.body);
  const { data, error } = await supabaseAdmin
    .from('requests')
    .update({
      status: input.status,
      meeting_date: input.status === 'scheduled' ? input.meetingDate : null
    })
    .eq('id', req.params.id)
    .select(COLUMNS)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Demande');

  const apiRequest = toApiRequest(data);

  if (input.status === 'scheduled') {
    await sendMail({
      to: apiRequest.email,
      subject: 'Rendez-vous confirmé — Cabinet RE2M',
      html: `<p>Bonjour ${apiRequest.name},</p><p>Votre rendez-vous avec le Cabinet RE2M est confirmé pour le ${new Date(
        input.meetingDate!
      ).toLocaleDateString('fr-FR')}.</p><p>Cordialement,<br/>Le Cabinet RE2M</p>`
    });
  } else {
    await sendMail({
      to: apiRequest.email,
      subject: 'Votre demande — Cabinet RE2M',
      html: `<p>Bonjour ${apiRequest.name},</p><p>Après examen, nous ne sommes malheureusement pas en mesure de donner suite à votre demande pour le moment.</p><p>Cordialement,<br/>Le Cabinet RE2M</p>`
    });
  }

  res.json(apiRequest);
};
