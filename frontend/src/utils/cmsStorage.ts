import { CMSBlock, PageSlug } from '../types/cms';
import { apiClient } from '../lib/apiClient';

// Backed by the RE2M API (backend/src/routes/cms.routes.ts) — one row per
// page with a draft_blocks / published_blocks JSONB array, matching this
// module's previous localStorage shape exactly so callers barely changed.
export const cmsStorage = {
  async getDraftLayout(slug: PageSlug): Promise<CMSBlock[]> {
    return apiClient.get<CMSBlock[]>(`/api/cms/${slug}/draft`);
  },

  async getPublishedLayout(slug: PageSlug): Promise<CMSBlock[]> {
    return apiClient.get<CMSBlock[]>(`/api/cms/${slug}/published`);
  },

  async saveDraftLayout(slug: PageSlug, blocks: CMSBlock[]): Promise<CMSBlock[]> {
    return apiClient.put<CMSBlock[]>(`/api/cms/${slug}/draft`, { blocks });
  },

  async publishLayout(slug: PageSlug): Promise<CMSBlock[]> {
    return apiClient.post<CMSBlock[]>(`/api/cms/${slug}/publish`);
  }

  // resetToDefault() is not implemented server-side yet (Phase 2) — the
  // factory-default content now lives in backend/sql/seed.sql instead of
  // in this file, so a real reset needs a dedicated endpoint that re-applies it.
};
