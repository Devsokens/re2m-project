import { google } from 'googleapis';
import { env } from './env.js';

const isConfigured = Boolean(
  env.GMAIL_CLIENT_ID && env.GMAIL_CLIENT_SECRET && env.GMAIL_REFRESH_TOKEN && env.GMAIL_SENDER_EMAIL
);

const oauth2Client = isConfigured ? new google.auth.OAuth2(env.GMAIL_CLIENT_ID, env.GMAIL_CLIENT_SECRET) : null;
oauth2Client?.setCredentials({ refresh_token: env.GMAIL_REFRESH_TOKEN });

const base64Url = (raw: string) =>
  Buffer.from(raw).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const buildRawMessage = (to: string, subject: string, html: string, bcc?: string[]) => {
  const from = `${env.GMAIL_SENDER_NAME} <${env.GMAIL_SENDER_EMAIL}>`;
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    ...(bcc && bcc.length > 0 ? [`Bcc: ${bcc.join(', ')}`] : []),
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html
  ];
  return base64Url(lines.join('\r\n'));
};

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  // Used for bulk sends (newsletter campaigns) — keeps recipients from seeing
  // each other's addresses. Gmail allows up to ~500 recipients per message.
  bcc?: string[];
}

// Sends via the Gmail API (OAuth2) instead of SMTP — Render blocks outbound
// SMTP ports on its free/standard plans, but HTTPS calls to the Gmail API work
// fine. No-ops with a console warning until GMAIL_* env vars are all set.
export const sendMail = async ({ to, subject, html, bcc }: SendMailOptions): Promise<void> => {
  if (!isConfigured || !oauth2Client) {
    console.warn(`[mail] Gmail API non configuré — email à "${to}" ("${subject}") non envoyé.`);
    return;
  }
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: buildRawMessage(to, subject, html, bcc) }
  });
};
