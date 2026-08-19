import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { requestInputSchema, requestStatusUpdateSchema } from '../schemas/request.js';
import { notFound } from '../lib/errors.js';
import { sendMail } from '../lib/mail.js';
import { applyTemplateVars, getEmailTemplates } from '../lib/settings.js';

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

  const templates = await getEmailTemplates();
  if (templates.accuse.enabled) {
    const vars = { name: input.name, type: input.type };
    await sendMail({
      to: input.email,
      subject: applyTemplateVars(templates.accuse.subject, vars),
      html: applyTemplateVars(templates.accuse.body, vars)
    });
  }

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
  const templates = await getEmailTemplates();

  if (input.status === 'scheduled') {
    const template = templates.rdv;
    if (template.enabled) {
      const vars = { name: apiRequest.name, date: new Date(input.meetingDate!).toLocaleDateString('fr-FR') };
      await sendMail({
        to: apiRequest.email,
        subject: applyTemplateVars(template.subject, vars),
        html: applyTemplateVars(template.body, vars)
      });
    }
  } else {
    const template = templates.refus;
    if (template.enabled) {
      const vars = { name: apiRequest.name };
      await sendMail({
        to: apiRequest.email,
        subject: applyTemplateVars(template.subject, vars),
        html: applyTemplateVars(template.body, vars)
      });
    }
  }

  res.json(apiRequest);
};
