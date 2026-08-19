import { apiClient } from '../lib/apiClient';
import { CertificateTemplateId } from './formations';

export interface EmailTemplateSetting {
  enabled: boolean;
  subject: string;
  body: string;
}

export interface AppSettings {
  cabinetName: string;
  senderEmail: string;
  emailTemplates: {
    accuse: EmailTemplateSetting;
    refus: EmailTemplateSetting;
    rdv: EmailTemplateSetting;
  };
  notifications: {
    newRequest: boolean;
    newTestimonial: boolean;
  };
  certificateStampUrl: string;
  certificateDefaultTemplate: CertificateTemplateId;
}

// Backed by the RE2M API (backend/src/routes/settings.routes.ts) — a single
// row in the `settings` table. The accusé/refus/rdv templates saved here are
// what the backend actually sends (see backend/src/lib/settings.ts), not
// just decorative admin-side text.
export const settingsStore = {
  get: (): Promise<AppSettings> => apiClient.get<AppSettings>('/api/settings'),
  update: (input: AppSettings): Promise<AppSettings> => apiClient.put<AppSettings>('/api/settings', input)
};
