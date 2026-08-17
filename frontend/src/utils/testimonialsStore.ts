import { apiClient } from '../lib/apiClient';

export type TestimonialStatus = 'soumis' | 'publié' | 'rejeté';
export type TestimonialSource = 'public' | 'lien-privé' | 'admin';

export interface Testimonial {
  id: string;
  company: string;
  service: string;
  text: string;
  logo: string;
  status: TestimonialStatus;
  source: TestimonialSource;
  submittedAt: string;
  rejectedAt?: string | null;
}

export interface TestimonialInput {
  company: string;
  service: string;
  text: string;
  logo: string;
}

// Backed by the RE2M API (backend/src/routes/testimonials.routes.ts) — a
// single table with a status column, replacing the old localStorage +
// CMS-block hybrid. GET /api/testimonials returns only "publié" rows to
// anonymous callers and everything to an authenticated admin.
export const testimonialsStore = {
  list: (): Promise<Testimonial[]> => apiClient.get<Testimonial[]>('/api/testimonials'),

  create: (input: TestimonialInput): Promise<Testimonial> => apiClient.post<Testimonial>('/api/testimonials', input),

  update: (id: string, input: TestimonialInput): Promise<Testimonial> => apiClient.put<Testimonial>(`/api/testimonials/${id}`, input),

  submitPublic: (input: TestimonialInput): Promise<void> => apiClient.post('/api/testimonials/public', input),

  createShareToken: (): Promise<string> => apiClient.post<{ token: string }>('/api/testimonials/tokens').then((r) => r.token),

  isValidToken: (token: string): Promise<boolean> =>
    apiClient
      .get<{ valid: boolean }>(`/api/testimonials/tokens/${token}`)
      .then((r) => r.valid)
      .catch(() => false),

  submitViaToken: (token: string, input: TestimonialInput): Promise<void> => apiClient.post(`/api/testimonials/submit/${token}`, input),

  approve: (id: string): Promise<Testimonial> => apiClient.patch<Testimonial>(`/api/testimonials/${id}/approve`),

  reject: (id: string): Promise<Testimonial> => apiClient.patch<Testimonial>(`/api/testimonials/${id}/reject`),

  republish: (id: string): Promise<Testimonial> => apiClient.patch<Testimonial>(`/api/testimonials/${id}/republish`)
};
