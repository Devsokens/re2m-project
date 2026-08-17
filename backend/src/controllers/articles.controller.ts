import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { articleInputSchema } from '../schemas/article.js';
import { notFound } from '../lib/errors.js';

const COLUMNS = 'id, title, excerpt, content, author, date, image, category, tags';

export const listArticles = async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('articles').select(COLUMNS).order('date', { ascending: false });
  if (error) throw error;
  res.json(data);
};

export const createArticle = async (req: Request, res: Response) => {
  const input = articleInputSchema.parse(req.body);
  const { data, error } = await supabaseAdmin.from('articles').insert(input).select(COLUMNS).single();
  if (error) throw error;
  res.status(201).json(data);
};

export const updateArticle = async (req: Request, res: Response) => {
  const input = articleInputSchema.parse(req.body);
  const { data, error } = await supabaseAdmin.from('articles').update(input).eq('id', req.params.id).select(COLUMNS).maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Article');
  res.json(data);
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('articles').delete().eq('id', req.params.id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Article');
  res.status(204).send();
};
