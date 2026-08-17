import { apiClient } from '../lib/apiClient';

export type RequestType = 'Audit & Conseil' | 'Formation' | 'Partenariat' | 'Autre';
export type RequestStatus = 'pending' | 'scheduled' | 'refused';

export interface ServiceRequest {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  type: RequestType;
  message: string;
  status: RequestStatus;
  receivedAt: string;
  meetingDate?: string;
}

export type RequestInput = Pick<ServiceRequest, 'name' | 'company' | 'email' | 'phone' | 'type' | 'message'>;

// Backed by the RE2M API (backend/src/routes/requests.routes.ts) — public
// submission from the contact form, admin-only listing and status updates.
export const requestsStore = {
  list: (): Promise<ServiceRequest[]> => apiClient.get<ServiceRequest[]>('/api/requests'),
  create: (input: RequestInput): Promise<ServiceRequest> => apiClient.post<ServiceRequest>('/api/requests', input),
  schedule: (id: string, meetingDate: string): Promise<ServiceRequest> =>
    apiClient.patch<ServiceRequest>(`/api/requests/${id}`, { status: 'scheduled', meetingDate }),
  refuse: (id: string): Promise<ServiceRequest> => apiClient.patch<ServiceRequest>(`/api/requests/${id}`, { status: 'refused' })
};
