# AGENTS.md — Standing Instructions for Codex

## Project
Novella Tracker — a personal reading tracker for the 100 Greatest Novellas reading plan.
Built with Next.js (App Router), Supabase, Tailwind CSS, deployed on Vercel.

## Current State (as of May 2026)
- Auth is live (Supabase email/password). All routes are protected by middleware.
- Dashboard, reading plan, book detail, and search are all built and working.
- 184 books total: 100 ranked (core plan) + 59 "Best Contemporary" list + 25 Additional Reads.
- User roles system (user / editor / admin) via `profiles` table.
- Dark mode fully supported throughout (Tailwind `dark:` classes).

## File Structure
This project does NOT use a `src/` folder. Top-level structure:
- `app/` — Next.js pages and components
- `lib/` — Shared utilities (supabase/server.ts, supabase/client.ts, actions.ts, types.ts, role.ts)
- `data/` — Seed data JSON files
- `scripts/` — Utility scripts (seed, seed-contemporary, count-books, update-gary-turk-books)
- `components/` — Reusable UI components
- `supabase/` — Migration files
- `public/` — Static assets

## Rules for Every Task

### Dependencies
- Always install any npm packages required by the code you write.
  Do not create files that import modules without first running
  `npm install` for those modules.
- Always add any new scripts to the `scripts` section of package.json.
  If you create a script that should be run via `npm run <name>`, add it.

### Git Workflow
- When your work is complete, do ALL of the following in order:
  1. Commit all changes with a clear commit message
  2. Push the branch to GitHub
  3. Provide the direct PR creation URL for the developer to click
- Always target the `main` branch.
- The developer will create and merge the PR on GitHub.

### Environment Variables
- If your code requires environment variables that are not already
  in `.env.local`, explicitly list them and tell the user exactly
  where to find the values (e.g., "Supabase dashboard → Settings → API").
- Never commit actual keys. Only update `.env.local.example` with
  placeholder values.

### Code Style
- TypeScript for all files.
- Use server components where possible, client components only
  when needed (interactivity, state).
- Server-side DB: `import { createClient } from "@/lib/supabase/server"`
- Client-side DB: `import { createBrowserClient } from "@/lib/supabase/client"`
- All types are defined in `lib/types.ts`.
- Server actions in `lib/actions.ts`. Role helpers in `lib/role.ts`.
- Use Tailwind CSS for styling — no other CSS framework.
- Always include `dark:` Tailwind variants on new UI.

### Database
Four tables are in use:
- `books` — static book catalog (184 total)
- `reading_progress` — per-user reading state (status, dates, notes, rating, study guide)
- `book_sections` — secondary section memberships (book appearing in multiple clusters)
- `profiles` — user role, auto-created on signup via DB trigger

**Book rank / section_type model:**
- `rank 1–100`, `section_type IN ('quick_wins', 'cluster')` — core reading plan
- `section_type = 'list'` — curated list books (not counted in the 100)
- `rank = null`, `section_type = null` — Additional Reads (not counted)

**reading_progress rules:**
- `user_id` is required. Always filter by `user.id`.
- `date_started` / `date_completed` managed automatically by `updateReadingStatus`.
- Only one book can have status `'reading'` at a time.

**RLS policy rules:**
- Always enable RLS when creating new tables and add explicit policies.
  Do NOT disable RLS — it silently exposes all rows to any anon request.
  - Public/static tables (e.g. `books`): `TO anon USING (true)` for SELECT.
  - Auth-gated tables (e.g. `profiles`): `TO authenticated USING (id = auth.uid())`.
  - User-owned tables: policies scoped to `auth.uid()`.

### Design
- Clean, readable, book-friendly aesthetic
- Warm neutral background (cream/off-white, not stark white)
- Dark mode fully supported — always add `dark:` Tailwind variants
- Mobile-first responsive design
- Primary accent: muted teal (`teal-600` light / `teal-500` dark)
- Status colors: gray (not started), teal (reading), amber/gold (read)
- Book titles should feel literary, not techy — use serif font (Lora, `font-serif`)
- Cluster vibe quotes styled as pull quotes (italic, indented)
- Film adaptation indicator: small 🎬 icon next to title

### Task Sizing
- Keep changes small and focused.
- "Smaller tasks give Codex less room to make wrong assumptions."
