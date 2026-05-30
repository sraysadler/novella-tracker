# Novella Tracker — Project Setup

**Prerequisite:** Complete the steps in `DEV_SETUP_GENERAL.md` first. This document only covers what's specific to the Novella Tracker project.

---

## 1. Clone the Project

```
cd ~/workspace
git clone https://github.com/sraysadler/novella-tracker.git
cd novella-tracker
npm install
```

---

## 2. Set Up Environment Variables

```
cp .env.local.example .env.local
```

Open `.env.local` in VS Code and fill in these values:

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → General → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API Keys → Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Settings → API Keys → Secret key |

These values are tied to the Supabase project, not the computer. Copy them from your password manager.

---

## 3. Verify the App Runs

```
cd ~/workspace/novella-tracker
npm run dev
```

Open http://localhost:3000 — you should be redirected to `/login`. Sign in to reach the dashboard.

---

## 4. Verify the Database Connection

Go to your Supabase dashboard → Table Editor. You should see:
- `books` (~184 rows — 100 ranked + 59 contemporary list + 25 Additional Reads)
- `reading_progress` (one row per book per user)
- `book_sections` (secondary section memberships)
- `profiles` (one row per user, auto-created on signup)

If `books` is empty:
```
npm run seed              # seeds the 100 core novellas + initial_progress
npm run seed-contemporary # seeds the Best Contemporary list section (59 books)
```

---

## 5. Vercel

Vercel is already connected to the GitHub repo. Deployments happen automatically when code is pushed to `main`. No setup needed on a new computer.

The live app URL and preview deployment URLs are visible in the Vercel dashboard.

---

## 6. Claude Code

- Open Claude Code → select `~/workspace/novella-tracker` as the folder
- Claude Code reads `CLAUDE.md` at the start of every session for project rules
- Start a new session for each task

---

## 7. Project-Specific Credentials

| Credential | Starts with | Sensitive? |
|-----------|------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://...supabase.co` | No — safe in browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_` | No — safe in browser |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_` | **Yes — never expose** |
| Supabase database password | (varies) | **Yes — rarely needed** |
| `ANTHROPIC_API_KEY` | `sk-ant-` | **Yes — needed for study guide feature (not yet built)** |

---

## 8. Project-Specific Terminal Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Run the app locally at http://localhost:3000 |
| `npm run seed` | Seed the 100 core novellas + reading_progress (safe to re-run) |
| `npm run seed-contemporary` | Seed the "Best Contemporary Novels Under 200 Pages" section |
| `npm run count-books` | Query live DB and print book counts by category |
| `npm run update-gary-turk-books` | Upsert attribution and new books from Instagram sources |
| `git pull` | Get latest code after merging a PR |

---

*Last updated: May 2026*
