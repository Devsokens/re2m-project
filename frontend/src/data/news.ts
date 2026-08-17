import { apiClient } from '../lib/apiClient';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  tag: string;
}

export type NewsInput = Omit<NewsItem, 'id'>;

// Backed by the RE2M API (backend/src/routes/news.routes.ts) — public reads, admin writes.
export const newsStore = {
  list: (): Promise<NewsItem[]> => apiClient.get<NewsItem[]>('/api/news'),
  create: (input: NewsInput): Promise<NewsItem> => apiClient.post<NewsItem>('/api/news', input),
  update: (id: string, input: NewsInput): Promise<NewsItem> => apiClient.put<NewsItem>(`/api/news/${id}`, input),
  remove: (id: string): Promise<void> => apiClient.delete(`/api/news/${id}`)
};
