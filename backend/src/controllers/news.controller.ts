import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { newsInputSchema } from '../schemas/news.js';
import { notFound } from '../lib/errors.js';

const COLUMNS = 'id, title, excerpt, date, image, tag';

export const listNews = async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('news').select(COLUMNS).order('date', { ascending: false });
  if (error) throw error;
  res.json(data);
};

export const createNews = async (req: Request, res: Response) => {
  const input = newsInputSchema.parse(req.body);
  const { data, error } = await supabaseAdmin.from('news').insert(input).select(COLUMNS).single();
  if (error) throw error;
  res.status(201).json(data);
};

export const updateNews = async (req: Request, res: Response) => {
  const input = newsInputSchema.parse(req.body);
  const { data, error } = await supabaseAdmin.from('news').update(input).eq('id', req.params.id).select(COLUMNS).maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Actualité');
  res.json(data);
};

export const deleteNews = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('news').delete().eq('id', req.params.id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Actualité');
  res.status(204).send();
};
