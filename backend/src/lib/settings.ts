import { supabaseAdmin } from './supabase.js';

export interface EmailTemplateSetting {
  enabled: boolean;
  subject: string;
  body: string;
}

const DEFAULT_TEMPLATES: Record<'accuse' | 'refus' | 'rdv', EmailTemplateSetting> = {
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

// Used by controllers that need to send one of the configurable request
// emails (accusé/refus/rdv) — falls back to sensible defaults if the admin
// hasn't customized a template yet, so sending never breaks on missing data.
export const getEmailTemplates = async (): Promise<Record<'accuse' | 'refus' | 'rdv', EmailTemplateSetting>> => {
  const { data, error } = await supabaseAdmin.from('settings').select('email_templates').eq('id', true).maybeSingle();
  if (error) throw error;
  const templates = data?.email_templates ?? {};
  return {
    accuse: templates.accuse ?? DEFAULT_TEMPLATES.accuse,
    refus: templates.refus ?? DEFAULT_TEMPLATES.refus,
    rdv: templates.rdv ?? DEFAULT_TEMPLATES.rdv
  };
};

// Replaces {{placeholder}} tokens in a subject/body string with real values.
export const applyTemplateVars = (text: string, vars: Record<string, string>): string =>
  text.replace(/\{\{(\w+)\}\}/g, (_match, key) => vars[key] ?? '');
