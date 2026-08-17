import { apiClient } from '../lib/apiClient';

// Backed by the RE2M API (backend/src/routes/engagement.routes.ts) — keyed by
// a real (targetType, targetId) pair now that Actualités/Blog have real IDs,
// instead of the old slugify(title) scheme.
export type EngagementTargetType = 'news' | 'article';

const VISITOR_KEY_STORAGE = 're2m_visitor_key';

// A stable anonymous identifier for this browser, used server-side to enforce
// "one like per visitor" (see the likes table's unique constraint).
export const getVisitorKey = (): string => {
  let key = localStorage.getItem(VISITOR_KEY_STORAGE);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY_STORAGE, key);
  }
  return key;
};

export interface LikeState {
  count: number;
  liked: boolean;
}

export const getLikeState = (targetType: EngagementTargetType, targetId: string): Promise<LikeState> =>
  apiClient.get<LikeState>(`/api/engagement/${targetType}/${targetId}/likes?visitorKey=${encodeURIComponent(getVisitorKey())}`);

export const toggleLike = (targetType: EngagementTargetType, targetId: string): Promise<LikeState> =>
  apiClient.post<LikeState>(`/api/engagement/${targetType}/${targetId}/likes`, { visitorKey: getVisitorKey() });

export interface EngagementComment {
  id: string;
  author: string;
  text: string;
  date: string; // ISO
}

export const getComments = (targetType: EngagementTargetType, targetId: string): Promise<EngagementComment[]> =>
  apiClient.get<EngagementComment[]>(`/api/engagement/${targetType}/${targetId}/comments`);

export const addComment = (targetType: EngagementTargetType, targetId: string, author: string, text: string): Promise<EngagementComment> =>
  apiClient.post<EngagementComment>(`/api/engagement/${targetType}/${targetId}/comments`, { author, text });
