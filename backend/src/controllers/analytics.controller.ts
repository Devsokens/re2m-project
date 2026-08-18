import type { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { pageViewInputSchema, visitsPeriodSchema } from '../schemas/analytics.js';

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

export const recordPageView = async (req: Request, res: Response) => {
  const input = pageViewInputSchema.parse(req.body);
  const { error } = await supabaseAdmin.from('page_views').insert({ path: input.path, visitor_key: input.visitorKey });
  if (error) throw error;
  res.status(201).json({ recorded: true });
};

export const getVisitsSeries = async (req: Request, res: Response) => {
  const period = visitsPeriodSchema.parse(req.query.period ?? 'week');
  const now = new Date();

  let bucketCount: number;
  let bucketMs: number | null = null; // null = calendar-month buckets (variable length)
  let labels: string[];
  let since: Date;

  if (period === 'day') {
    bucketCount = 24;
    bucketMs = 60 * 60 * 1000;
    labels = Array.from({ length: 24 }, (_, i) => `${i}h`);
    since = new Date(now.getTime() - bucketCount * bucketMs);
  } else if (period === 'week') {
    bucketCount = 7;
    bucketMs = 24 * 60 * 60 * 1000;
    const dayMs = bucketMs;
    since = new Date(now.getTime() - (bucketCount - 1) * dayMs);
    since.setHours(0, 0, 0, 0);
    labels = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(since.getTime() + i * dayMs);
      return DAY_LABELS[(d.getDay() + 6) % 7];
    });
  } else if (period === 'month') {
    bucketCount = 30;
    bucketMs = 24 * 60 * 60 * 1000;
    since = new Date(now.getTime() - (bucketCount - 1) * bucketMs);
    since.setHours(0, 0, 0, 0);
    labels = Array.from({ length: 30 }, (_, i) => (i % 5 === 0 ? String(i + 1) : ''));
  } else {
    bucketCount = 12;
    since = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    labels = Array.from({ length: 12 }, (_, i) => MONTH_LABELS[(now.getMonth() - 11 + i + 12) % 12]);
  }

  const { data, error } = await supabaseAdmin.from('page_views').select('created_at').gte('created_at', since.toISOString());
  if (error) throw error;

  const counts = new Array(bucketCount).fill(0);
  for (const row of data ?? []) {
    const ts = new Date(row.created_at);
    let idx: number;
    if (period === 'year') {
      idx = (ts.getFullYear() - since.getFullYear()) * 12 + (ts.getMonth() - since.getMonth());
    } else {
      idx = Math.floor((ts.getTime() - since.getTime()) / (bucketMs as number));
    }
    if (idx >= 0 && idx < bucketCount) counts[idx] += 1;
  }

  res.json({ data: counts, labels });
};
