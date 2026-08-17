// Lightweight localStorage-backed likes/comments engine for Actualités & Blog.
// Keyed by a slug derived from the item's title (no backend/ids exist yet).

export const slugify = (title: string): string =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

// Deterministic baseline so freshly-seeded content doesn't look empty.
const seedLikes = (key: string): number => 8 + (hashString(key) % 45);

const likesKey = (key: string) => `re2m_likes_count_${key}`;
const likedFlagKey = (key: string) => `re2m_liked_${key}`;
const commentsKey = (key: string) => `re2m_comments_${key}`;

export interface LikeState {
  count: number;
  liked: boolean;
}

export const getLikeState = (key: string): LikeState => {
  const stored = localStorage.getItem(likesKey(key));
  const count = stored !== null ? parseInt(stored, 10) : seedLikes(key);
  const liked = localStorage.getItem(likedFlagKey(key)) === '1';
  return { count, liked };
};

export const toggleLike = (key: string): LikeState => {
  const { count, liked } = getLikeState(key);
  const nextLiked = !liked;
  const nextCount = nextLiked ? count + 1 : Math.max(0, count - 1);
  localStorage.setItem(likesKey(key), String(nextCount));
  localStorage.setItem(likedFlagKey(key), nextLiked ? '1' : '0');
  return { count: nextCount, liked: nextLiked };
};

export interface EngagementComment {
  id: string;
  author: string;
  text: string;
  date: string; // ISO
}

export const getComments = (key: string): EngagementComment[] => {
  const raw = localStorage.getItem(commentsKey(key));
  return raw ? JSON.parse(raw) : [];
};

export const addComment = (key: string, author: string, text: string): EngagementComment[] => {
  const comment: EngagementComment = {
    id: `CMT-${Date.now()}`,
    author,
    text,
    date: new Date().toISOString()
  };
  const updated = [...getComments(key), comment];
  localStorage.setItem(commentsKey(key), JSON.stringify(updated));
  return updated;
};

export const deleteComment = (key: string, id: string): EngagementComment[] => {
  const updated = getComments(key).filter((c) => c.id !== id);
  localStorage.setItem(commentsKey(key), JSON.stringify(updated));
  return updated;
};
