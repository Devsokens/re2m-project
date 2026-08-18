import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { targetTypeSchema, commentInputSchema, likeToggleSchema, commentReplySchema } from '../schemas/engagement.js';
import { badRequest, notFound } from '../lib/errors.js';

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

const COMMENT_COLUMNS = 'id, target_type, target_id, author, body, admin_reply, admin_reply_at, created_at';

const toApiComment = (row: any) => ({
  id: row.id,
  targetType: row.target_type,
  targetId: row.target_id,
  author: row.author,
  text: row.body,
  date: row.created_at,
  adminReply: row.admin_reply ?? null,
  adminReplyAt: row.admin_reply_at ?? null
});

export const listComments = async (req: Request, res: Response) => {
  const { targetType, targetId } = parseTarget(req);
  const { data, error } = await supabaseAdmin
    .from('comments')
    .select(COMMENT_COLUMNS)
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
    .select(COMMENT_COLUMNS)
    .single();
  if (error) throw error;
  res.status(201).json(toApiComment(data));
};

// Admin-only listing across every comment (for the "reply to a comment" panel)
export const listAllComments = async (req: Request, res: Response) => {
  const targetType = req.query.targetType ? targetTypeSchema.parse(req.query.targetType) : undefined;
  let query = supabaseAdmin.from('comments').select(COMMENT_COLUMNS).order('created_at', { ascending: false });
  if (targetType) query = query.eq('target_type', targetType);
  const { data, error } = await query;
  if (error) throw error;
  res.json(data.map(toApiComment));
};

export const replyToComment = async (req: Request, res: Response) => {
  const { reply } = commentReplySchema.parse(req.body);
  const { data, error } = await supabaseAdmin
    .from('comments')
    .update({ admin_reply: reply, admin_reply_at: new Date().toISOString() })
    .eq('id', req.params.commentId)
    .select(COMMENT_COLUMNS)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Commentaire');
  res.json(toApiComment(data));
};

export const recordShare = async (req: Request, res: Response) => {
  const { targetType, targetId } = parseTarget(req);
  const { error } = await supabaseAdmin.from('shares').insert({ target_type: targetType, target_id: targetId });
  if (error) throw error;
  const { count, error: countError } = await supabaseAdmin
    .from('shares')
    .select('id', { count: 'exact', head: true })
    .eq('target_type', targetType)
    .eq('target_id', targetId);
  if (countError) throw countError;
  res.status(201).json({ count: count ?? 0 });
};

// Bulk counts for a whole content type, so admin list views (Actualités/Blog)
// can show like/comment/share badges without one request per card.
export const getEngagementSummary = async (req: Request, res: Response) => {
  const targetType = targetTypeSchema.parse(req.query.targetType);

  const tally = (rows: { target_id: string }[]) => {
    const map: Record<string, number> = {};
    for (const row of rows) map[row.target_id] = (map[row.target_id] ?? 0) + 1;
    return map;
  };

  const [{ data: likeRows, error: likeErr }, { data: commentRows, error: commentErr }, { data: shareRows, error: shareErr }] =
    await Promise.all([
      supabaseAdmin.from('likes').select('target_id').eq('target_type', targetType),
      supabaseAdmin.from('comments').select('target_id').eq('target_type', targetType),
      supabaseAdmin.from('shares').select('target_id').eq('target_type', targetType)
    ]);
  if (likeErr) throw likeErr;
  if (commentErr) throw commentErr;
  if (shareErr) throw shareErr;

  res.json({ likes: tally(likeRows ?? []), comments: tally(commentRows ?? []), shares: tally(shareRows ?? []) });
};

// Site-wide totals, used by the Dashboard's "Réactions" KPI cards.
export const getEngagementStats = async (_req: Request, res: Response) => {
  const [{ count: likes, error: likeErr }, { count: comments, error: commentErr }, { count: shares, error: shareErr }] =
    await Promise.all([
      supabaseAdmin.from('likes').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('comments').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('shares').select('id', { count: 'exact', head: true })
    ]);
  if (likeErr) throw likeErr;
  if (commentErr) throw commentErr;
  if (shareErr) throw shareErr;
  res.json({ likes: likes ?? 0, comments: comments ?? 0, shares: shares ?? 0 });
};
