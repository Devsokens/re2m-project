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

export const recordShare = (targetType: EngagementTargetType, targetId: string): Promise<{ count: number }> =>
  apiClient.post<{ count: number }>(`/api/engagement/${targetType}/${targetId}/shares`);

export interface EngagementComment {
  id: string;
  targetType: EngagementTargetType;
  targetId: string;
  author: string;
  text: string;
  date: string; // ISO
  adminReply: string | null;
  adminReplyAt: string | null;
}

export const getComments = (targetType: EngagementTargetType, targetId: string): Promise<EngagementComment[]> =>
  apiClient.get<EngagementComment[]>(`/api/engagement/${targetType}/${targetId}/comments`);

export const addComment = (targetType: EngagementTargetType, targetId: string, author: string, text: string): Promise<EngagementComment> =>
  apiClient.post<EngagementComment>(`/api/engagement/${targetType}/${targetId}/comments`, { author, text });

// Admin-only: per-content like/comment/share counts for a whole content type,
// used to show badges on the admin card lists without one request per card.
export interface EngagementSummary {
  likes: Record<string, number>;
  comments: Record<string, number>;
  shares: Record<string, number>;
}

export const getEngagementSummary = (targetType: EngagementTargetType): Promise<EngagementSummary> =>
  apiClient.get<EngagementSummary>(`/api/engagement/summary?targetType=${targetType}`);

// Admin-only: site-wide totals for the Dashboard's "Réactions" KPI cards.
export interface EngagementStats {
  likes: number;
  comments: number;
  shares: number;
}

export const getEngagementStats = (): Promise<EngagementStats> => apiClient.get<EngagementStats>('/api/engagement/stats');

// Admin-only: every comment (optionally filtered), for the reply/moderation panel.
export const listAllComments = (targetType?: EngagementTargetType): Promise<EngagementComment[]> =>
  apiClient.get<EngagementComment[]>(`/api/engagement/comments${targetType ? `?targetType=${targetType}` : ''}`);

export const replyToComment = (commentId: string, reply: string): Promise<EngagementComment> =>
  apiClient.patch<EngagementComment>(`/api/engagement/comments/${commentId}/reply`, { reply });
