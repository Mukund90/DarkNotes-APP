# DarkNotes — 3 Independent Layers (Frontend / Backend / Database)

This project has THREE completely separate parts. Each one has its own
package.json, its own dependencies, and runs on its own port. Frontend
never talks to Supabase directly — only the Backend does.

```
DarkNotes/
├── frontend/     → React app (Vite, plain JS)  → runs on port 3000
├── backend/      → Node.js + Express API       → runs on port 5000
└── database/     → schema.sql for Supabase      → no local process, cloud-hosted
```

---

## STEP 0 — Create your Supabase project (Database layer)

1. Go to https://supabase.com → New Project.
2. Once created, open **SQL Editor** → paste the contents of `database/schema.sql` → Run.
   This creates the `notes` table and enables Row Level Security.
3. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `service_role` key (secret — backend only!)
   - `anon` key (not required for this setup since backend uses service role)

---

## STEP 1 — Run the Backend (Terminal 1)

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
```
PORT=5000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
FRONTEND_URL=http://localhost:3000
```

Start it:
```bash
npm start
```

You should see:
```
✅ DarkNotes Backend running independently on http://localhost:5000
```

Test it's alive: open http://localhost:5000 in a browser → should show a JSON message.

---

## STEP 2 — Run the Frontend (Terminal 2, separate terminal window)

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` already points to the backend:
```
VITE_API_URL=http://localhost:5000
```

Start it:
```bash
npm run dev
```

You should see Vite running on **http://localhost:3000**.

---

## STEP 3 — Use the app

1. Open http://localhost:3000 in your browser.
2. You'll be redirected to `/login`.
3. Click "Sign up" → create an account (check your email if Supabase has
   email confirmation ON — you can disable that in Supabase Auth settings
   for local testing).
4. Log in → you land on the Dashboard.
5. Create, edit, delete, and search notes — all requests go from
   Frontend (3000) → Backend (5000) → Supabase (cloud).

---

## Why this counts as "three independent layers"

| Layer     | Own package.json | Own dependencies | Own port | Talks to |
|-----------|:---:|:---:|:---:|---|
| Frontend  | ✅ | ✅ | 3000 | Backend only (REST/fetch) |
| Backend   | ✅ | ✅ | 5000 | Database only (Supabase SDK) |
| Database  | N/A (Supabase managed) | N/A | cloud | Backend only |

- Stopping the frontend doesn't affect the backend, and vice versa.
- Frontend has **zero** Supabase credentials — it only knows the backend URL.
- Backend holds the Supabase service role key, never sent to the browser.
- Database enforces its own security independently via Row Level Security,
  so even if backend had a bug, users still can't see each other's notes.

---

## Troubleshooting

- **CORS error in browser console** → check `FRONTEND_URL` in `backend/.env`
  matches exactly `http://localhost:3000`.
- **401 Unauthorized on notes** → session expired, log out and log back in.
- **Signup works but login fails** → check if Supabase requires email
  confirmation (Authentication → Settings → toggle "Confirm email" off
  for local dev/testing).
