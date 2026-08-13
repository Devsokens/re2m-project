export interface PendingTestimonial {
  id: string;
  token: string;
  company: string;
  service: string;
  text: string;
  logo: string;
  submittedAt: string;
}

const PENDING_KEY = 're2m_pending_testimonials';
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

  // Pending client submissions, awaiting admin review
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

  removePending(id: string): void {
    writeJSON(PENDING_KEY, this.getPending().filter((p) => p.id !== id));
  }
};
