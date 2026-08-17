import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { pageSlugSchema, saveDraftLayoutSchema } from '../schemas/cms.js';

const getPage = async (slug: string) => {
  const { data, error } = await supabaseAdmin.from('cms_pages').select('draft_blocks, published_blocks').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
};

export const getDraftLayout = async (req: Request, res: Response) => {
  const slug = pageSlugSchema.parse(req.params.slug);
  const page = await getPage(slug);
  res.json(page?.draft_blocks ?? []);
};

export const getPublishedLayout = async (req: Request, res: Response) => {
  const slug = pageSlugSchema.parse(req.params.slug);
  const page = await getPage(slug);
  res.json(page?.published_blocks ?? []);
};

export const saveDraftLayout = async (req: Request, res: Response) => {
  const slug = pageSlugSchema.parse(req.params.slug);
  const { blocks } = saveDraftLayoutSchema.parse(req.body);

  const { error } = await supabaseAdmin
    .from('cms_pages')
    .upsert({ slug, draft_blocks: blocks, updated_at: new Date().toISOString() }, { onConflict: 'slug' });
  if (error) throw error;

  res.json(blocks);
};

export const publishLayout = async (req: Request, res: Response) => {
  const slug = pageSlugSchema.parse(req.params.slug);
  const page = await getPage(slug);

  const { error } = await supabaseAdmin
    .from('cms_pages')
    .update({ published_blocks: page?.draft_blocks ?? [], updated_at: new Date().toISOString() })
    .eq('slug', slug);
  if (error) throw error;

  res.json(page?.draft_blocks ?? []);
};
