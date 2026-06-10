# CourseSphere — Deployment Guide

## Architecture

```
Browser  →  Netlify (React SPA)  →  Render (Express API)  →  Supabase (Postgres + Auth)
```

| Layer | Technology | Hosting |
|-------|-----------|---------|
| Frontend | React + Vite | Netlify (free static CDN) |
| Backend | Express.js REST API | Render (free Node.js service) |
| Database + Auth | PostgreSQL | Supabase (already hosted) |

---

## Prerequisites

- [x] GitHub account
- [x] Netlify account — [netlify.com](https://netlify.com)
- [x] Render account — [render.com](https://render.com)
- [x] Supabase project with `init_schema.sql` and `seed_data.sql` already applied
- [x] Supabase API keys (URL, anon key, service role key)

---

## Part 1 — Push Code to GitHub

Both Netlify and Render deploy directly from a GitHub repository.

### 1.1 Create a GitHub Repository

1. Go to **github.com** → click **New repository**
2. Name it `CourseSphere`
3. Set visibility to **Private** (your `.env` secrets must not be committed)
4. Do **not** tick "Add a README" — your repo already has files
5. Click **Create repository**

### 1.2 Push Your Code

Open a terminal inside the `CourseSphere/` folder and run:

```bash
git init
git add .
git commit -m "Initial commit — CourseSphere"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CourseSphere.git
git push -u origin main
```

> **Verify:** Open `.gitignore` at the repo root. Confirm it includes `.env` and `node_modules/`. Never commit real environment files.

---

## Part 2 — Deploy the Backend on Render

The Express API lives in the `backend/` subfolder.

### 2.1 Connect Your Repository

1. Log into **render.com**
2. Click **New +** → **Web Service**
3. Click **Connect a repository**
4. If your repo doesn't appear, click **Configure account** and grant Render access to it
5. Select the `CourseSphere` repository and click **Connect**

### 2.2 Configure the Web Service

Fill in the following settings on the configuration screen:

| Setting | Value |
|---------|-------|
| **Name** | `coursesphere-api` |
| **Region** | Choose closest to your users (e.g. Singapore for South Asia) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

> **Root Directory** is critical — it tells Render that the Node.js app is inside the `backend/` subfolder, not the repo root.

### 2.3 Set Environment Variables

Scroll to the **Environment Variables** section and add all of the following:

| Key | Value | Where to find |
|-----|-------|--------------|
| `SUPABASE_URL` | `https://xxxxxx.supabase.co` | Supabase Dashboard → Project Settings → API → **Project URL** |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase Dashboard → Project Settings → API → **anon** / **public** key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Supabase Dashboard → Project Settings → API → **service_role** / **secret** key |
| `NODE_ENV` | `production` | — |
| `FRONTEND_URL` | *(leave blank — fill in after Netlify deploy in Part 4)* | Your Netlify site URL |

> **Security:** `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security and has full database access. Keep it only in backend environment variables — never in frontend code.

### 2.4 Create and Deploy the Service

Click **Create Web Service**. Render will:
1. Clone your repository
2. Change directory into `backend/`
3. Run `npm install`
4. Start the server with `npm start` (runs `node server.js`)

The first deploy takes 2–4 minutes. Monitor the **Logs** tab for any errors.

### 2.5 Verify the Backend is Running

Once the status shows **Live**, Render assigns a URL like:
```
https://coursesphere-api.onrender.com
```

Test it by visiting the health check endpoint in your browser:
```
https://coursesphere-api.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "CourseSphere API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

If you see this, the backend is deployed successfully. Copy the base URL — you will need it in the next step.

---

## Part 3 — Deploy the Frontend on Netlify

The React app lives in the `frontend/` subfolder. Netlify auto-reads `netlify.toml` from the repo root for build configuration.

### 3.1 Import Your Repository

1. Log into **netlify.com**
2. Click **Add new site** → **Import an existing project**
3. Click **GitHub** and authorize Netlify to access your repositories
4. Select the `CourseSphere` repository

### 3.2 Verify Build Settings

Netlify reads `netlify.toml` automatically. Confirm these values are shown:

| Setting | Expected value |
|---------|---------------|
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |

If they are blank or wrong, enter them manually.

### 3.3 Set Environment Variable

Before clicking Deploy, click **Show advanced** → **Add variable** and set:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://coursesphere-api.onrender.com/api` |

Replace `coursesphere-api` with your actual Render service name. Include `/api` at the end — no trailing slash.

> **Why this matters:** Vite embeds environment variables into the JavaScript bundle at build time. If `VITE_API_URL` is not set before the build, every API call in the frontend will fail.

### 3.4 Deploy the Site

Click **Deploy site**. Netlify will:
1. Change directory into `frontend/`
2. Run `npm install` then `npm run build`
3. Publish the `dist/` output to Netlify's global CDN

The deploy takes 1–3 minutes. Watch the **Deploy log** tab.

### 3.5 Verify the Frontend

Once status shows **Published**, Netlify assigns a URL like:
```
https://coursesphere-abc123.netlify.app
```

Open it and check:
- [ ] Landing page loads
- [ ] Dark/light mode toggle works
- [ ] Sign In button navigates to login page
- [ ] Login with `atiqueashfakarib@gmail.com` / `124578` succeeds
- [ ] Admin dashboard shows stats
- [ ] Browse Courses shows course data grouped by year

---

## Part 4 — Connect Frontend and Backend

### 4.1 Update CORS on Render

Now that you have your Netlify URL, tell the backend to accept requests from it:

1. Go to Render → your `coursesphere-api` service → **Environment**
2. Find `FRONTEND_URL` and set its value to your Netlify URL:
   ```
   https://coursesphere-abc123.netlify.app
   ```
   No trailing slash.
3. Click **Save Changes** — Render will automatically redeploy with the new value

### 4.2 Confirm Cross-Origin Requests Work

1. Open the frontend in your browser
2. Open **DevTools → Network** tab
3. Log in — the login request should go to `coursesphere-api.onrender.com` and return 200
4. If you see CORS errors, double-check that `FRONTEND_URL` on Render exactly matches your Netlify URL

---

## Part 5 — Custom Domain (Optional)

### Frontend Custom Domain (Netlify)

1. Netlify → Site configuration → **Domain management** → **Add custom domain**
2. Enter your domain (e.g. `coursesphere.example.com`)
3. Update your domain registrar's DNS with the CNAME record Netlify provides
4. Netlify provisions an SSL certificate automatically

### Backend Custom Domain (Render)

1. Render → Your service → **Settings** → **Custom Domains** → **Add custom domain**
2. Enter your domain (e.g. `api.coursesphere.example.com`)
3. Add the CNAME record to your DNS registrar
4. After DNS propagates, update two environment variables:
   - On **Render**: change `FRONTEND_URL` to the new frontend domain
   - On **Netlify**: change `VITE_API_URL` to the new backend domain, then **trigger a redeploy**

---

## Part 6 — Subsequent Deployments

Both services auto-deploy on every push to `main`:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Netlify and Render both detect the push and redeploy automatically
```

To trigger a manual redeploy without a code change:
- **Netlify:** Site → Deploys → **Trigger deploy** → Deploy site
- **Render:** Dashboard → Your service → **Manual Deploy** → Deploy latest commit

---

## Environment Variables Reference

### Backend — `backend/.env`

Copy `backend/.env.example` to `backend/.env` and fill in your values for local development.

| Variable | Required | Description |
|----------|:--------:|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon (public) key — safe to use in client |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key — bypasses RLS; keep secret |
| `NODE_ENV` | Recommended | `development` locally, `production` on Render |
| `PORT` | No | Port to listen on (default 5000; Render overrides this automatically) |
| `FRONTEND_URL` | Recommended | Netlify URL for CORS — use `http://localhost:5173` locally |

### Frontend — `frontend/.env`

Copy `frontend/.env.example` to `frontend/.env` and fill in your values for local development.

| Variable | Required | Description |
|----------|:--------:|-------------|
| `VITE_API_URL` | Yes | Backend API base URL including `/api` path, no trailing slash |

---

## Troubleshooting

### API calls return "Failed to fetch" or network error

1. Open DevTools → Network — check what URL the request goes to
2. Verify `VITE_API_URL` on Netlify matches your Render URL exactly
3. Trigger a Netlify redeploy after changing the env var
4. Check Render logs for startup errors

### CORS error in browser console

```
Access to XMLHttpRequest at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

- `FRONTEND_URL` on Render must exactly match your Netlify origin (no trailing slash)
- After updating, wait for Render to redeploy (takes ~1 minute)

### Login returns 500 or "Server configuration error"

- `SUPABASE_SERVICE_ROLE_KEY` is likely missing or wrong on Render
- The signup endpoint requires the service role key to create confirmed users
- Verify the key in Render → Environment matches the one in Supabase → Settings → API

### Page 404 on direct URL or page refresh

- The `_redirects` file in `frontend/public/` and the `[[redirects]]` in `netlify.toml` handle this
- Both redirect all routes to `/index.html` for React Router to handle
- If this still occurs, check that `frontend/public/_redirects` was included in the build

### Render service takes 30–60 seconds to respond (cold start)

Free Render services spin down after 15 minutes of inactivity. The next request wakes them up.

**Solutions:**
- Upgrade to a paid Render plan ($7/month) to keep the service always active
- Use a free uptime monitor (e.g. UptimeRobot) to ping `/api/health` every 10 minutes

### "supabaseAdmin is null" warning in logs

`SUPABASE_SERVICE_ROLE_KEY` is not set. Add it to Render's environment variables. Without it, signup, admin operations, and profile creation will fail.

---

## Running Locally

### Backend

```bash
cd backend
cp .env.example .env       # fill in your Supabase keys
npm install
npm run dev                 # starts with file-watcher on port 5000
```

### Frontend

```bash
cd frontend
cp .env.example .env       # set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # starts Vite dev server on port 5173
```

### Utility Scripts

```bash
cd backend
npm run create-admin        # create/re-create the admin account in Supabase
npm run test-api            # run basic API smoke tests (server must be running)
```
