import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../lib/supabase.js';
import { env } from '../lib/env.js';
import { badRequest } from '../lib/errors.js';

export const uploadImage = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) throw badRequest('Aucun fichier reçu.');
  if (!file.mimetype.startsWith('image/')) throw badRequest('Seules les images sont acceptées.');

  const extension = file.originalname.split('.').pop() || 'bin';
  const path = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage.from(env.SUPABASE_STORAGE_BUCKET).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: false
  });
  if (error) throw error;

  const { data } = supabaseAdmin.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
  res.status(201).json({ url: data.publicUrl });
};
