import { apiClient } from '../lib/apiClient';

export type CertificateTemplateId = 're2m-classique' | 'moderne' | 'corporate';

export interface Formation {
  id: string;
  title: string;
  date: string; // ISO
  location: string;
  description: string;
  templateId: CertificateTemplateId;
  signerName: string;
  signerTitle: string;
  participantCount?: number;
}

export interface Participant {
  id: string;
  formationId: string;
  fullName: string;
  email?: string;
  organization?: string;
  present: boolean;
}

export interface ParticipantInput {
  fullName: string;
  email?: string;
  organization?: string;
  present?: boolean;
}

// Backed by the RE2M API (backend/src/routes/formations.routes.ts) — admin-only.
export const formationsStore = {
  list: (): Promise<Formation[]> => apiClient.get<Formation[]>('/api/formations'),

  create: (formation: Formation): Promise<Formation> => apiClient.post<Formation>('/api/formations', formation),

  update: (id: string, formation: Formation): Promise<Formation> => apiClient.put<Formation>(`/api/formations/${id}`, formation),

  remove: (id: string): Promise<void> => apiClient.delete(`/api/formations/${id}`),

  listParticipants: (formationId: string): Promise<Participant[]> =>
    apiClient.get<Participant[]>(`/api/formations/${formationId}/participants`),

  addParticipant: (formationId: string, input: ParticipantInput): Promise<Participant> =>
    apiClient.post<Participant>(`/api/formations/${formationId}/participants`, input),

  addParticipantsBulk: (formationId: string, participants: ParticipantInput[]): Promise<Participant[]> =>
    apiClient.post<Participant[]>(`/api/formations/${formationId}/participants/bulk`, { participants }),

  updateParticipant: (participantId: string, input: ParticipantInput): Promise<Participant> =>
    apiClient.put<Participant>(`/api/formations/participants/${participantId}`, input),

  removeParticipant: (participantId: string): Promise<void> => apiClient.delete(`/api/formations/participants/${participantId}`)
};
