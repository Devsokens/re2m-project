import { apiClient } from '../lib/apiClient';

export type VisitsPeriod = 'day' | 'week' | 'month' | 'year';

export interface VisitsSeries {
  data: number[];
  labels: string[];
}

// Backed by the RE2M API (backend/src/routes/analytics.routes.ts) — real
// page-view tracking (App.tsx records a view on every navigation).
export const analyticsStore = {
  getVisits: (period: VisitsPeriod): Promise<VisitsSeries> => apiClient.get<VisitsSeries>(`/api/analytics/pageviews?period=${period}`)
};
