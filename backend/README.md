# RE2M backend

Node.js + TypeScript + Express API for the Cabinet RE2M platform, backed by Supabase (Postgres + Auth + Storage). Lives inside the same repo as the frontend, deployed independently on Render.

## 1. Local setup

```bash
cd backend
npm install
cp .env.example .env   # fill in the Supabase values below
npm run dev             # http://localhost:4000, docs at /api-docs
```

## 2. Supabase project setup (one-time)

1. **Get your API keys**: Supabase dashboard → Project Settings → API. Copy `Project URL`, `anon public` key, and `service_role` key into `backend/.env`.
2. **Run the schema**: Supabase dashboard → SQL Editor → New query → paste the full contents of `backend/sql/schema.sql` → Run.
3. **Seed the CMS content**: same place, paste `backend/sql/seed.sql` → Run. This reproduces the current homepage/about/services/contact content exactly, so nothing visually changes when the API goes live.
4. **Create a storage bucket**: dashboard → Storage → New bucket → name it `public-assets` (or whatever you set `SUPABASE_STORAGE_BUCKET` to) → make it **Public**.
5. **Create your first admin login**: dashboard → Authentication → Users → Add user (set an email + password). Copy the generated user's UUID, then run in the SQL editor:
   ```sql
   insert into user_accounts (id, name, email, role, status)
   values ('<paste-the-uuid-here>', 'Administrateur', '<same-email>', 'SUPER_ADMIN', 'active');
   ```
   This is the account you'll log in with from the admin panel — it replaces the old hardcoded `admin@cabinet-re2m.com` / `password123`.

## 3. Deploying on Render

1. Push this repo (including the `backend/` folder) to GitHub.
2. Render dashboard → New → Web Service → connect the repo.
3. **Root Directory**: `backend`
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`
6. Add the environment variables from `.env.example` (same values as your local `.env`, plus set `CORS_ORIGINS` to your deployed frontend's URL).
7. Once deployed, note the Render URL (e.g. `https://re2m-api.onrender.com`) — set it as `VITE_API_URL` in the frontend's environment (Vercel project settings) and redeploy the frontend.

## 4. API docs

Once running, Swagger UI is available at `/api-docs` (e.g. `http://localhost:4000/api-docs` or `https://re2m-api.onrender.com/api-docs`).
