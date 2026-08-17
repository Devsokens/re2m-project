import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { targetTypeSchema, commentInputSchema, likeToggleSchema } from '../schemas/engagement.js';
import { badRequest } from '../lib/errors.js';

const parseTarget = (req: Request) => {
  const targetType = targetTypeSchema.parse(req.params.targetType);
  const targetId = req.params.targetId;
  if (!targetId) throw badRequest('Identifiant manquant.');
  return { targetType, targetId };
};

export const getLikeState = async (req: Request, res: Response) => {
  const { targetType, targetId } = parseTarget(req);
  const visitorKey = typeof req.query.visitorKey === 'string' ? req.query.visitorKey : '';

  const { count, error: countError } = await supabaseAdmin
    .from('likes')
    .select('id', { count: 'exact', head: true })
    .eq('target_type', targetType)
    .eq('target_id', targetId);
  if (countError) throw countError;

  let liked = false;
  if (visitorKey) {
    const { data, error } = await supabaseAdmin
      .from('likes')
      .select('id')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .eq('visitor_key', visitorKey)
      .maybeSingle();
    if (error) throw error;
    liked = !!data;
  }

  res.json({ count: count ?? 0, liked });
};

export const toggleLike = async (req: Request, res: Response) => {
  const { targetType, targetId } = parseTarget(req);
  const { visitorKey } = likeToggleSchema.parse(req.body);

  const { data: existing, error: findError } = await supabaseAdmin
    .from('likes')
    .select('id')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('visitor_key', visitorKey)
    .maybeSingle();
  if (findError) throw findError;

  if (existing) {
    const { error } = await supabaseAdmin.from('likes').delete().eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from('likes').insert({ target_type: targetType, target_id: targetId, visitor_key: visitorKey });
    if (error) throw error;
  }

  const { count, error: countError } = await supabaseAdmin
    .from('likes')
    .select('id', { count: 'exact', head: true })
    .eq('target_type', targetType)
    .eq('target_id', targetId);
  if (countError) throw countError;

  res.json({ count: count ?? 0, liked: !existing });
};

const toApiComment = (row: any) => ({ id: row.id, author: row.author, text: row.body, date: row.created_at });

export const listComments = async (req: Request, res: Response) => {
  const { targetType, targetId } = parseTarget(req);
  const { data, error } = await supabaseAdmin
    .from('comments')
    .select('id, author, body, created_at')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  res.json(data.map(toApiComment));
};

export const addComment = async (req: Request, res: Response) => {
  const { targetType, targetId } = parseTarget(req);
  const input = commentInputSchema.parse(req.body);
  const { data, error } = await supabaseAdmin
    .from('comments')
    .insert({ target_type: targetType, target_id: targetId, author: input.author, body: input.text })
    .select('id, author, body, created_at')
    .single();
  if (error) throw error;
  res.status(201).json(toApiComment(data));
};
