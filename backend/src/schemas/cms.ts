import { z } from 'zod';

export const pageSlugSchema = z.enum(['accueil', 'qui-nous-sommes', 'nos-services', 'contact']);
export type PageSlug = z.infer<typeof pageSlugSchema>;

// A CMS block's `settings` shape varies per block type by convention on the
// frontend (Hero has slides[], CounterStats has stats[], etc.) — kept as a
// loosely-typed record here too, matching src/types/cms.ts on the frontend.
export const cmsBlockSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  order: z.number().int(),
  enabled: z.boolean(),
  settings: z.record(z.string(), z.any())
});

export const saveDraftLayoutSchema = z.object({
  blocks: z.array(cmsBlockSchema)
});

export type CMSBlock = z.infer<typeof cmsBlockSchema>;
