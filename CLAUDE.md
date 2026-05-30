# CLAUDE.md — Standing Instructions for Claude Code

## Project
Novella Tracker — a personal reading tracker for the 100 Greatest Novellas reading plan.
Built with Next.js (App Router), Supabase, Tailwind CSS, deployed on Vercel.

## Current State (as of May 2026)
- Auth is live (Supabase email/password). All routes are protected by middleware.
- Dashboard, reading plan, book detail, and search are all built and working.
- 184 books total: 100 ranked (core reading plan) + 59 in the "Best Contemporary Novels
  Under 200 Pages" list section + 25 Additional Reads (sourced from Instagram lists, rank = null).
- User roles system (user / editor / admin) is implemented via a `profiles` table.
- Study guide feature is scaffolded in the DB schema but the UI is not yet built.
- Dark mode is fully supported throughout (Tailwind `dark:` classes).

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
- All server-side DB queries use `lib/supabase/server.ts` (`createClient`).
- All client-side DB queries use `lib/supabase/client.ts` (`createBrowserClient`).
- All types are defined in `lib/types.ts`.
- Server actions live in `lib/actions.ts`.
- Role/permission helpers live in `lib/role.ts`.
- Use Tailwind CSS for styling — no other CSS framework.
- Support dark mode: all new UI must include `dark:` variants.

### Database
Four tables are in use:
- `books` — static book data (title, author, pages, section, rank, cover_image_url, etc.)
- `reading_progress` — per-user status, dates, personal notes, rating, study guide data
- `book_sections` — secondary section memberships (allows a book to appear in multiple clusters)
- `profiles` — user role (user / editor / admin), auto-created on signup via trigger

**Book data model:**
- `rank`: integer 1–100 for core reading plan books. `null` for Additional Reads (extra-list books).
- `section_type`: `'quick_wins'` | `'cluster'` | `'list'` | `null`
  - `null` = Additional Reads (Instagram sourced, not counted in the 100)
  - `'list'` = curated external list (e.g. Best Contemporary Novels), not counted in the 100
- Only books with `rank IS NOT NULL AND rank <= 100` count toward the user's 100-novella progress.

**reading_progress behavior:**
- `user_id` is required (auth is live; always filter by `user.id`).
- `date_started` and `date_completed` are auto-managed by `updateReadingStatus` in `lib/actions.ts`.
- Only one book can have status `'reading'` at a time — `updateReadingStatus` enforces this.
- `pdf_storage_path`, `study_guide`, and `study_guide_source` are scaffolded for a future
  study guide feature but have no UI yet.

**RLS policy rules:**
- When creating new Supabase tables, always enable RLS and add explicit policies.
  Do NOT disable RLS — that silently exposes all rows to any anon request.
  - Public/static tables (e.g. `books`): `TO anon USING (true)` for SELECT.
  - Auth-gated tables (e.g. `profiles`): `TO authenticated USING (id = auth.uid())`.
  - User-owned tables (e.g. `reading_progress`): policies scoped to `auth.uid()`.

### Design
- Clean, readable, book-friendly aesthetic
- Warm neutral background (cream/off-white `stone-50`, not stark white)
- Dark mode fully supported — always add `dark:` Tailwind variants
- Mobile-first responsive design
- Primary accent: muted teal (`teal-600` / `teal-500` in dark)
- Status colors: gray (not started), teal (reading), amber/gold (read)
- Book titles should feel literary, not techy — use serif font (`font-serif`, Lora)
- Cluster vibe quotes styled as pull quotes (italic, slightly indented)
- Film adaptation indicator: small 🎬 icon next to title

### Task Sizing
- Keep changes small and focused.
- "Smaller tasks give Claude Code less room to make wrong assumptions."
