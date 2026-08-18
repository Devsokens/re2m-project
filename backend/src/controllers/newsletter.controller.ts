import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { newsletterCampaignInputSchema, newsletterSubscribeSchema } from '../schemas/newsletter.js';
import { badRequest } from '../lib/errors.js';
import { sendMail } from '../lib/mail.js';
import { env } from '../lib/env.js';

const CAMPAIGN_COLUMNS = 'id, subject, body_html, status, recipients_count, sent_at';

const toApiCampaign = (row: any) => ({
  id: row.id,
  subject: row.subject,
  bodyHtml: row.body_html,
  status: row.status,
  recipients: row.recipients_count,
  sentAt: row.sent_at
});

export const listCampaigns = async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('newsletters')
    .select(CAMPAIGN_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) throw error;
  res.json(data.map(toApiCampaign));
};

export const subscribe = async (req: Request, res: Response) => {
  const { email } = newsletterSubscribeSchema.parse(req.body);
  // Idempotent by design — re-subscribing with the same email is a silent
  // no-op rather than an error, so we never reveal whether an address is
  // already on the list.
  const { error } = await supabaseAdmin.from('newsletter_recipients').upsert({ email }, { onConflict: 'email', ignoreDuplicates: true });
  if (error) throw error;
  res.status(201).json({ subscribed: true });
};

export const subscriberCount = async (_req: Request, res: Response) => {
  const { count, error } = await supabaseAdmin.from('newsletter_recipients').select('id', { count: 'exact', head: true });
  if (error) throw error;
  res.json({ count: count ?? 0 });
};

export const sendCampaign = async (req: Request, res: Response) => {
  const input = newsletterCampaignInputSchema.parse(req.body);

  const { data: recipientRows, error: recipientsError } = await supabaseAdmin.from('newsletter_recipients').select('email');
  if (recipientsError) throw recipientsError;
  const recipients = (recipientRows ?? []).map((r) => r.email as string);
  if (recipients.length === 0) throw badRequest('Aucun abonné à la newsletter pour le moment.');

  await sendMail({
    to: env.GMAIL_SENDER_EMAIL ?? 'newsletter@cabinet-re2m.com',
    bcc: recipients,
    subject: input.subject,
    html: input.bodyHtml
  });

  const { data, error } = await supabaseAdmin
    .from('newsletters')
    .insert({
      subject: input.subject,
      body_html: input.bodyHtml,
      status: 'sent',
      recipients_count: recipients.length,
      sent_at: new Date().toISOString()
    })
    .select(CAMPAIGN_COLUMNS)
    .single();
  if (error) throw error;

  res.status(201).json(toApiCampaign(data));
};
