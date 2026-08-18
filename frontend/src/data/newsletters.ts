import { apiClient } from '../lib/apiClient';

export interface Newsletter {
  id: string;
  subject: string;
  bodyHtml: string;
  recipients: number;
  status: 'sent' | 'draft';
  sentAt: string;
}

export interface NewsletterInput {
  subject: string;
  bodyHtml: string;
}

// Backed by the RE2M API (backend/src/routes/newsletter.routes.ts). Sending a
// campaign emails every current subscriber via Gmail (Bcc) and records it.
export const newsletterStore = {
  list: (): Promise<Newsletter[]> => apiClient.get<Newsletter[]>('/api/newsletter/campaigns'),
  send: (input: NewsletterInput): Promise<Newsletter> => apiClient.post<Newsletter>('/api/newsletter/campaigns', input),
  subscribe: (email: string): Promise<void> => apiClient.post('/api/newsletter/subscribe', { email }),
  subscriberCount: (): Promise<{ count: number }> => apiClient.get<{ count: number }>('/api/newsletter/subscribers/count')
};
