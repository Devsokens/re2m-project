export type TestimonialSource = 'public' | 'lien-privé' | 'admin';

export interface PendingTestimonial {
  id: string;
  token: string;
  company: string;
  service: string;
  text: string;
  logo: string;
  submittedAt: string;
  source?: TestimonialSource;
}

export interface RejectedTestimonial {
  id: string;
  company: string;
  service: string;
  text: string;
  logo: string;
  submittedAt: string;
  rejectedAt: string;
}

const PENDING_KEY = 're2m_pending_testimonials';
const REJECTED_KEY = 're2m_rejected_testimonials';
const TOKENS_KEY = 're2m_testimonial_tokens';

const readJSON = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const testimonialsStore = {
  // Share tokens — one per client invitation link
  createShareToken(): string {
    const token = Math.random().toString(36).slice(2, 10);
    const tokens = readJSON<string[]>(TOKENS_KEY, []);
    writeJSON(TOKENS_KEY, [...tokens, token]);
    return token;
  },

  isValidToken(token: string): boolean {
    const tokens = readJSON<string[]>(TOKENS_KEY, []);
    return tokens.includes(token);
  },

  // Pending client submissions ("soumis"), awaiting admin review — from a private link or the public site
  getPending(): PendingTestimonial[] {
    return readJSON<PendingTestimonial[]>(PENDING_KEY, []);
  },

  addPending(entry: Omit<PendingTestimonial, 'id' | 'submittedAt'>): void {
    const pending = this.getPending();
    const newEntry: PendingTestimonial = {
      ...entry,
      id: `PEND-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    writeJSON(PENDING_KEY, [newEntry, ...pending]);
  },

  // Public submission, no invitation token required — still lands in the pending queue for review
  submitPublic(entry: { company: string; service: string; text: string; logo: string }): void {
    this.addPending({ ...entry, token: '', source: 'public' });
  },

  removePending(id: string): void {
    writeJSON(PENDING_KEY, this.getPending().filter((p) => p.id !== id));
  },

  // Rejected ("rejeté") — kept for record instead of being deleted outright
  getRejected(): RejectedTestimonial[] {
    return readJSON<RejectedTestimonial[]>(REJECTED_KEY, []);
  },

  addRejected(entry: Omit<RejectedTestimonial, 'rejectedAt'>): void {
    const rejected = this.getRejected();
    writeJSON(REJECTED_KEY, [{ ...entry, rejectedAt: new Date().toISOString() }, ...rejected]);
  },

  removeRejected(id: string): void {
    writeJSON(REJECTED_KEY, this.getRejected().filter((r) => r.id !== id));
  }
};
