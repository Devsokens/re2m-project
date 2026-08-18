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

// Spam filters penalize HTML-only emails heavily — a plain-text alternative
// part is one of the cheapest wins for deliverability.
const htmlToPlainText = (html: string) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

interface MailAttachment {
  filename: string;
  mimeType: string;
  content: Buffer;
}

const alternativePart = (boundary: string, html: string) => [
  `--${boundary}`,
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: quoted-printable',
  '',
  htmlToPlainText(html),
  '',
  `--${boundary}`,
  'Content-Type: text/html; charset=UTF-8',
  '',
  html,
  '',
  `--${boundary}--`
];

const buildRawMessage = (opts: {
  to: string;
  subject: string;
  html: string;
  bcc?: string[];
  attachments?: MailAttachment[];
  listUnsubscribe?: string;
}) => {
  const { to, subject, html, bcc, attachments, listUnsubscribe } = opts;
  const from = `${env.GMAIL_SENDER_NAME} <${env.GMAIL_SENDER_EMAIL}>`;
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const headerLines = [
    `From: ${from}`,
    `To: ${to}`,
    `Reply-To: ${env.GMAIL_SENDER_EMAIL}`,
    ...(bcc && bcc.length > 0 ? [`Bcc: ${bcc.join(', ')}`] : []),
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    // RFC 8058 one-click unsubscribe — presence alone measurably improves
    // inbox placement for bulk mail in Gmail/Outlook spam scoring.
    ...(listUnsubscribe ? [`List-Unsubscribe: <${listUnsubscribe}>`, 'List-Unsubscribe-Post: List-Unsubscribe=One-Click'] : [])
  ];

  const altBoundary = `re2m_alt_${crypto.randomBytes(10).toString('hex')}`;

  if (!attachments || attachments.length === 0) {
    headerLines.push(`Content-Type: multipart/alternative; boundary="${altBoundary}"`, '', alternativePart(altBoundary, html).join('\r\n'));
    return base64Url(Buffer.from(headerLines.join('\r\n'), 'utf-8'));
  }

  const mixedBoundary = `re2m_mix_${crypto.randomBytes(10).toString('hex')}`;
  const bodyParts = [
    `--${mixedBoundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    '',
    alternativePart(altBoundary, html).join('\r\n'),
    ''
  ];
  for (const att of attachments) {
    bodyParts.push(
      `--${mixedBoundary}`,
      `Content-Type: ${att.mimeType}; name="${att.filename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${att.filename}"`,
      '',
      att.content.toString('base64'),
      ''
    );
  }
  bodyParts.push(`--${mixedBoundary}--`);

  headerLines.push(`Content-Type: multipart/mixed; boundary="${mixedBoundary}"`, '', bodyParts.join('\r\n'));
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
  // Set for bulk/newsletter sends only — a mailto: link is enough to satisfy
  // RFC 8058 without needing a hosted unsubscribe page.
  listUnsubscribe?: string;
}

// Sends via the Gmail API (OAuth2) instead of SMTP — Render blocks outbound
// SMTP ports on its free/standard plans, but HTTPS calls to the Gmail API work
// fine. No-ops with a console warning until GMAIL_* env vars are all set.
export const sendMail = async ({ to, subject, html, bcc, attachments, listUnsubscribe }: SendMailOptions): Promise<void> => {
  if (!isConfigured || !oauth2Client) {
    console.warn(`[mail] Gmail API non configuré — email à "${to}" ("${subject}") non envoyé.`);
    return;
  }
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: buildRawMessage({ to, subject, html, bcc, attachments, listUnsubscribe }) }
  });
};
