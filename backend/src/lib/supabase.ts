import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Service-role client: trusted, used by all backend logic once a request has
// already passed through the requireAuth/requireRole middleware. Bypasses RLS
// by design — the API layer is the enforcement point, not the DB policies
// (RLS is still enabled on every table as defense-in-depth, see sql/schema.sql).
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Anon client: only used to verify a caller-supplied JWT (auth.getUser(token))
// during login/session checks — never used to query data directly.
export const supabaseAnon = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});
