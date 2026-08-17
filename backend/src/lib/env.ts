import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default('public-assets'),
  CORS_ORIGINS: z.string().min(1),
  PORT: z.coerce.number().default(4000),

  // Gmail API (OAuth2) — optional. Until all four are set, sendMail() logs a
  // warning and no-ops instead of throwing, so the rest of the API works fine
  // without email configured.
  GMAIL_CLIENT_ID: z.string().optional(),
  GMAIL_CLIENT_SECRET: z.string().optional(),
  GMAIL_REFRESH_TOKEN: z.string().optional(),
  GMAIL_SENDER_EMAIL: z.string().optional(),
  GMAIL_SENDER_NAME: z.string().optional().default('Cabinet RE2M')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid or missing environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const corsOrigins = env.CORS_ORIGINS.split(',').map((origin) => origin.trim());
