import crypto from 'node:crypto';
import { google } from 'googleapis';
import { env } from './env.js';

const isConfigured = Boolean(
  env.GMAIL_CLIENT_ID && env.GMAIL_CLIENT_SECRET && env.GMAIL_REFRESH_TOKEN && env.GMAIL_SENDER_EMAIL
);

const oauth2Client = isConfigured ? new google.auth.OAuth2(env.GMAIL_CLIENT_ID, env.GMAIL_CLIENT_SECRET) : null;
oauth2Client?.setCredentials({ refresh_token: env.GMAIL_REFRESH_TOKEN });

const base64Url = (raw: Buffer) =>
  raw.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

interface MailAttachment {
  filename: string;
  mimeType: string;
  content: Buffer;
}

const buildRawMessage = (opts: { to: string; subject: string; html: string; bcc?: string[]; attachments?: MailAttachment[] }) => {
  const { to, subject, html, bcc, attachments } = opts;
  const from = `${env.GMAIL_SENDER_NAME} <${env.GMAIL_SENDER_EMAIL}>`;
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const headerLines = [
    `From: ${from}`,
    `To: ${to}`,
    ...(bcc && bcc.length > 0 ? [`Bcc: ${bcc.join(', ')}`] : []),
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0'
  ];

  if (!attachments || attachments.length === 0) {
    headerLines.push('Content-Type: text/html; charset=UTF-8', '', html);
    return base64Url(Buffer.from(headerLines.join('\r\n'), 'utf-8'));
  }

  const boundary = `re2m_${crypto.randomBytes(12).toString('hex')}`;
  const bodyParts = [
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
    ''
  ];
  for (const att of attachments) {
    bodyParts.push(
      `--${boundary}`,
      `Content-Type: ${att.mimeType}; name="${att.filename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${att.filename}"`,
      '',
      att.content.toString('base64'),
      ''
    );
  }
  bodyParts.push(`--${boundary}--`);

  headerLines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`, '', bodyParts.join('\r\n'));
  return base64Url(Buffer.from(headerLines.join('\r\n'), 'utf-8'));
};

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  // Used for bulk sends (newsletter campaigns) — keeps recipients from seeing
  // each other's addresses. Gmail allows up to ~500 recipients per message.
  bcc?: string[];
  attachments?: MailAttachment[];
}

// Sends via the Gmail API (OAuth2) instead of SMTP — Render blocks outbound
// SMTP ports on its free/standard plans, but HTTPS calls to the Gmail API work
// fine. No-ops with a console warning until GMAIL_* env vars are all set.
export const sendMail = async ({ to, subject, html, bcc, attachments }: SendMailOptions): Promise<void> => {
  if (!isConfigured || !oauth2Client) {
    console.warn(`[mail] Gmail API non configuré — email à "${to}" ("${subject}") non envoyé.`);
    return;
  }
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: buildRawMessage({ to, subject, html, bcc, attachments }) }
  });
};
