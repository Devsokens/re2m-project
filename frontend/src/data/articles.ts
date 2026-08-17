import { apiClient } from '../lib/apiClient';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string; // HTML (rich text)
  author: string;
  date: string;
  image: string;
  category: string;
  tags: string[];
}

export type ArticleInput = Omit<Article, 'id'>;

export const paragraphsToHtml = (paragraphs: string[]): string => paragraphs.map((p) => `<p>${p}</p>`).join('');

// Backed by the RE2M API (backend/src/routes/articles.routes.ts) — public reads, admin writes.
export const articlesStore = {
  list: (): Promise<Article[]> => apiClient.get<Article[]>('/api/articles'),
  create: (input: ArticleInput): Promise<Article> => apiClient.post<Article>('/api/articles', input),
  update: (id: string, input: ArticleInput): Promise<Article> => apiClient.put<Article>(`/api/articles/${id}`, input),
  remove: (id: string): Promise<void> => apiClient.delete(`/api/articles/${id}`)
};
