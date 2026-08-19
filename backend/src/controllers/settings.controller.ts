import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { settingsInputSchema } from '../schemas/settings.js';

const COLUMNS = 'cabinet_name, sender_email, email_templates, notifications, certificate_stamp_url, certificate_default_template';

// Kept in sync with backend/src/lib/settings.ts's fallback defaults — these
// {{placeholders}} (name, type, date) are substituted when the email is
// actually sent (see requests.controller.ts).
const DEFAULT_TEMPLATES = {
  accuse: {
    enabled: true,
    subject: 'Nous avons bien reçu votre demande',
    body: '<p>Bonjour {{name}},</p><p>Nous avons bien reçu votre demande ({{type}}) et notre équipe reviendra vers vous sous 24 à 48 heures.</p><p>Cordialement,<br/>Le Cabinet RE2M</p>'
  },
  refus: {
    enabled: true,
    subject: 'Votre demande — Cabinet RE2M',
    body: '<p>Bonjour {{name}},</p><p>Après examen, nous ne sommes malheureusement pas en mesure de donner suite à votre demande pour le moment.</p><p>Cordialement,<br/>Le Cabinet RE2M</p>'
  },
  rdv: {
    enabled: true,
    subject: 'Rendez-vous confirmé — Cabinet RE2M',
    body: '<p>Bonjour {{name}},</p><p>Votre rendez-vous avec le Cabinet RE2M est confirmé pour le {{date}}.</p><p>Cordialement,<br/>Le Cabinet RE2M</p>'
  }
};

const toApiSettings = (row: any) => ({
  cabinetName: row.cabinet_name,
  senderEmail: row.sender_email,
  emailTemplates: {
    accuse: row.email_templates?.accuse ?? DEFAULT_TEMPLATES.accuse,
    refus: row.email_templates?.refus ?? DEFAULT_TEMPLATES.refus,
    rdv: row.email_templates?.rdv ?? DEFAULT_TEMPLATES.rdv
  },
  notifications: {
    newRequest: row.notifications?.newRequest ?? true,
    newTestimonial: row.notifications?.newTestimonial ?? true
  },
  certificateStampUrl: row.certificate_stamp_url ?? '',
  certificateDefaultTemplate: row.certificate_default_template ?? 're2m-classique'
});

export const getSettings = async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('settings').select(COLUMNS).eq('id', true).single();
  if (error) throw error;
  res.json(toApiSettings(data));
};

export const updateSettings = async (req: Request, res: Response) => {
  const input = settingsInputSchema.parse(req.body);
  const { data, error } = await supabaseAdmin
    .from('settings')
    .update({
      cabinet_name: input.cabinetName,
      sender_email: input.senderEmail,
      email_templates: input.emailTemplates,
      notifications: input.notifications,
      certificate_stamp_url: input.certificateStampUrl,
      certificate_default_template: input.certificateDefaultTemplate
    })
    .eq('id', true)
    .select(COLUMNS)
    .single();
  if (error) throw error;
  res.json(toApiSettings(data));
};
