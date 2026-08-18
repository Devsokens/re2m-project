# Backend RE2M

API Node.js + TypeScript + Express pour la plateforme du Cabinet RE2M, adossée à Supabase (Postgres + Auth + Storage). Vit dans le même dépôt que le frontend, déployée indépendamment sur Render.

## 1. Installation locale

```bash
cd backend
npm install
cp .env.example .env   # renseignez les valeurs Supabase ci-dessous
npm run dev             # http://localhost:4000, docs sur /api-docs
```

## 2. Configuration du projet Supabase (une seule fois)

1. **Récupérez vos clés API** : tableau de bord Supabase → Project Settings → API. Copiez `Project URL`, la clé `anon public` et la clé `service_role` dans `backend/.env`.
2. **Exécutez le schéma** : tableau de bord Supabase → SQL Editor → New query → collez le contenu complet de `backend/sql/schema.sql` → Run.
3. **Seedez le contenu CMS** : au même endroit, collez `backend/sql/seed.sql` → Run. Cela reproduit exactement le contenu actuel (accueil/à propos/services/contact), donc rien ne change visuellement quand l'API entre en service.
4. **Créez un bucket de stockage** : tableau de bord → Storage → New bucket → nommez-le `public-assets` (ou la valeur que vous avez mise dans `SUPABASE_STORAGE_BUCKET`) → passez-le en **Public**.
5. **Créez votre premier compte admin** : tableau de bord → Authentication → Users → Add user (email + mot de passe). Copiez l'UUID de l'utilisateur généré, puis exécutez dans l'éditeur SQL :
   ```sql
   insert into user_accounts (id, name, email, role, status)
   values ('<collez-l-uuid-ici>', 'Administrateur', '<même-email>', 'SUPER_ADMIN', 'active');
   ```
   C'est le compte avec lequel vous vous connecterez depuis le panneau admin — il remplace l'ancien couple codé en dur `admin@cabinet-re2m.com` / `password123`.

## 3. Configuration de l'API Gmail pour les emails automatiques (optionnel)

Le module Demandes envoie des emails automatiques (accusé de réception, confirmation de RDV, refus) via **l'API Gmail en OAuth2** plutôt que le SMTP, car Render bloque les ports SMTP sortants sur ses offres gratuites/standards alors que les appels HTTPS vers l'API Gmail fonctionnent normalement. Tant que les quatre variables `GMAIL_*` ci-dessous ne sont pas toutes renseignées, `sendMail()` se contente d'afficher un avertissement et n'envoie rien — le reste de l'API continue de fonctionner normalement.

1. **Créez/sélectionnez un projet Google Cloud** : [console.cloud.google.com](https://console.cloud.google.com) → nouveau projet (ou réutilisez-en un).
2. **Activez l'API Gmail** : dans ce projet, "APIs & Services" → "Library" → recherchez "Gmail API" → Enable.
3. **Créez des identifiants OAuth** : "APIs & Services" → "Credentials" → "Create Credentials" → "OAuth client ID" → type d'application **Web application** (pas "Desktop app" — c'est ce type qui permet de déclarer une URI de redirection, nécessaire pour le Playground à l'étape 5). Dans la section **Authorized redirect URIs**, ajoutez exactement :
   ```
   https://developers.google.com/oauthplayground
   ```
   Notez le **Client ID** et le **Client Secret** générés.
4. **Ajoutez votre compte Gmail comme testeur** (obligatoire tant que l'app n'est pas vérifiée par Google — sinon vous aurez une erreur 403 "access_denied" en essayant de vous authentifier) : dans le menu de gauche de **Google Auth Platform**, allez sur **Audience**.
   - Si **État de la publication** affiche "En production", cliquez sur "Présentation" et repassez l'app en **Testing** (nécessaire : le mode "En production" non vérifié bloque tout le monde, y compris vous, sur ce scope sensible).
   - Une fois en Testing, sur la page **Audience**, section **Utilisateurs test** → **+ Ajouter des utilisateurs** → ajoutez l'adresse Gmail depuis laquelle vous enverrez → Save.
5. **Générez un refresh token** : allez sur [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground), cliquez sur l'icône d'engrenage (en haut à droite) → cochez "Use your own OAuth credentials" → collez votre Client ID/Secret (c'est ce même écran qui utilise l'URI de redirection déclarée à l'étape 3). Dans le panneau de gauche, trouvez et sélectionnez le scope `https://www.googleapis.com/auth/gmail.send` → "Authorize APIs" → connectez-vous avec le compte Gmail ajouté comme testeur à l'étape 4 → "Exchange authorization code for tokens" → copiez le **Refresh token**.
6. **Renseignez `backend/.env`** :
   ```
   GMAIL_CLIENT_ID=<étape 3>
   GMAIL_CLIENT_SECRET=<étape 3>
   GMAIL_REFRESH_TOKEN=<étape 5>
   GMAIL_SENDER_EMAIL=<l'adresse Gmail autorisée à l'étape 5>
   GMAIL_SENDER_NAME=Cabinet RE2M
   ```

   ⚠️ **Important tant que l'app reste en mode Testing** (c'est-à-dire tant qu'elle n'est pas soumise à la vérification Google) : le refresh token expire au bout de **7 jours**. Passé ce délai, l'envoi d'email s'arrête silencieusement (avec un warning en console) jusqu'à ce qu'on refasse l'étape 5 pour en générer un nouveau. Ne repassez pas l'app en "En production" tant que la vérification n'est pas faite : le blocage 403 reviendrait immédiatement, y compris pour vous.

## 4. Déploiement sur Render

1. Poussez ce dépôt (avec le dossier `backend/`) sur GitHub.
2. Tableau de bord Render → New → Web Service → connectez le dépôt.
3. **Root Directory** : `backend`
4. **Build Command** : `npm install && npm run build`
5. **Start Command** : `npm start`
6. Ajoutez les variables d'environnement de `.env.example` (mêmes valeurs que votre `.env` local, plus `CORS_ORIGINS` réglé sur l'URL de votre frontend déployé).
7. Une fois déployé, notez l'URL Render (ex. `https://re2m-api.onrender.com`) — renseignez-la comme `VITE_API_URL` dans l'environnement du frontend (paramètres du projet Vercel) et redéployez le frontend.

## 5. Documentation de l'API

Une fois lancée, Swagger UI est disponible sur `/api-docs` (ex. `http://localhost:4000/api-docs` ou `https://re2m-api.onrender.com/api-docs`).
