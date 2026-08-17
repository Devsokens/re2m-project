-- RE2M — full schema (Phase 1: members + cms_pages are wired to the API today;
-- the rest is created now so later phases don't require schema churn).
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create extension if not exists pgcrypto;

-- =========================================================================
-- USER ACCOUNTS (admin auth — id matches a Supabase Auth auth.users.id)
-- =========================================================================
create table if not exists user_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null check (role in ('SUPER_ADMIN', 'ADMIN', 'CONSULTANT')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- MEMBERS + ACTIVITY LOGS
-- =========================================================================
create table if not exists members (
  id text primary key,
  civility text not null check (civility in ('M.', 'Mme', 'Dr', 'Pr')),
  last_name text not null,
  first_name text not null,
  title text not null,
  department text not null,
  bio text default '',
  photo text default '',
  email text not null,
  mobile text not null,
  phone text default '',
  address text not null,
  linkedin text default '',
  website text default '',
  qr_color text not null default '#002366',
  qr_background text not null default '#FFFFFF',
  status text not null default 'active' check (status in ('active', 'inactive', 'pending')),
  scan_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  user_label text not null,
  action text not null check (action in ('CREATE', 'UPDATE', 'DELETE', 'SCAN', 'EXPORT_PDF', 'EXPORT_VCARD', 'BATCH_EXPORT')),
  target_member text,
  details text not null,
  ip_address text
);

-- =========================================================================
-- CMS (one row per page; draft/published as JSONB block arrays)
-- =========================================================================
create table if not exists cms_pages (
  slug text primary key check (slug in ('accueil', 'qui-nous-sommes', 'nos-services', 'contact')),
  draft_blocks jsonb not null default '[]'::jsonb,
  published_blocks jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- FORMATIONS / PARTICIPANTS / CERTIFICATES (Phase 2)
-- =========================================================================
create table if not exists formations (
  id text primary key,
  title text not null,
  date date not null,
  location text not null,
  description text default '',
  template_id text not null default 're2m-classique' check (template_id in ('re2m-classique', 'moderne', 'corporate')),
  signer_name text not null,
  signer_title text not null,
  created_at timestamptz not null default now()
);

create table if not exists participants (
  id text primary key,
  formation_id text not null references formations(id) on delete cascade,
  full_name text not null,
  email text default '',
  organization text default '',
  present boolean not null default true
);

-- =========================================================================
-- TESTIMONIALS (unifies the old 3-way localStorage+CMS-block split)
-- =========================================================================
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  service text not null,
  body text not null,
  logo text default '',
  status text not null default 'soumis' check (status in ('soumis', 'publié', 'rejeté')),
  source text not null default 'admin' check (source in ('public', 'lien-privé', 'admin')),
  submitted_at timestamptz not null default now(),
  rejected_at timestamptz
);

create table if not exists testimonial_tokens (
  token text primary key,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- NEWS (Actualités) / ARTICLES (Blog) — real IDs, unlike the old slug-keyed model
-- =========================================================================
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  date date not null,
  image text default '',
  tag text default '',
  created_at timestamptz not null default now()
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  content text not null,
  author text not null,
  date date not null,
  image text default '',
  category text default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('news', 'article')),
  target_id uuid not null,
  author text not null default 'Anonyme',
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('news', 'article')),
  target_id uuid not null,
  visitor_key text not null,
  created_at timestamptz not null default now(),
  unique (target_type, target_id, visitor_key)
);

-- =========================================================================
-- NEWSLETTER / REQUESTS (Phase 4)
-- =========================================================================
create table if not exists newsletters (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body_html text not null,
  status text not null default 'draft' check (status in ('draft', 'sent')),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists newsletter_recipients (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text default '',
  email text not null,
  phone text default '',
  type text not null,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'refused')),
  received_at timestamptz not null default now(),
  meeting_date date
);

-- =========================================================================
-- SETTINGS (single row) / PARTNERS
-- =========================================================================
create table if not exists settings (
  id boolean primary key default true check (id),
  cabinet_name text not null default 'Cabinet RE2M',
  sender_email text not null default 'contact@cabinet-re2m.com',
  email_templates jsonb not null default '{}'::jsonb,
  notifications jsonb not null default '{}'::jsonb,
  certificate_stamp_url text default '',
  certificate_default_template text not null default 're2m-classique'
);
insert into settings (id) values (true) on conflict (id) do nothing;

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  label text default '',
  logo text default '',
  order_index integer not null default 0
);

-- =========================================================================
-- Row Level Security — the backend talks to Postgres with the service role
-- key (which bypasses RLS), so these policies are defense-in-depth: they
-- only matter if a client ever queries Supabase directly with the anon key.
-- Public tables get anon SELECT; everything else is service-role only.
-- =========================================================================
alter table user_accounts enable row level security;
alter table members enable row level security;
alter table activity_logs enable row level security;
alter table cms_pages enable row level security;
alter table formations enable row level security;
alter table participants enable row level security;
alter table testimonials enable row level security;
alter table testimonial_tokens enable row level security;
alter table news enable row level security;
alter table articles enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;
alter table newsletters enable row level security;
alter table newsletter_recipients enable row level security;
alter table requests enable row level security;
alter table settings enable row level security;
alter table partners enable row level security;

create policy "public read members" on members for select using (true);
create policy "public read news" on news for select using (true);
create policy "public read articles" on articles for select using (true);
create policy "public read comments" on comments for select using (true);
create policy "public read likes" on likes for select using (true);
create policy "public read partners" on partners for select using (true);
create policy "public read published testimonials" on testimonials for select using (status = 'publié');
