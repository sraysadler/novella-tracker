# CLAUDE.md — Standing Instructions for Claude Code

## Project
Novella Tracker — a personal reading tracker for the 100 Greatest Novellas reading plan.
Built with Next.js 14+ (App Router), Supabase, Tailwind CSS, deployed on Vercel.

## File Structure
This project does NOT use a `src/` folder. Top-level structure:
- `app/` — Next.js pages and components
- `lib/` — Shared utilities (supabase.ts, types.ts)
- `data/` — Seed data JSON files
- `scripts/` — Utility scripts (seed, etc.)
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
- All database queries go through `lib/supabase.ts`.
- All types are defined in `lib/types.ts`.
- Use Tailwind CSS for styling — no other CSS framework.

### Database
- Two tables: `books` (static book data) and `reading_progress`
  (user-specific status/notes/ratings).
- `reading_progress.user_id` is nullable in MVP.
- Always query `reading_progress` with a `user_id` filter
  (use `IS NULL` for MVP).
- Never assume a single user — the schema is designed for
  multi-user auth to be added later.
- When creating new Supabase tables, always include
  `ALTER TABLE <tablename> DISABLE ROW LEVEL SECURITY;`
  immediately after the CREATE TABLE statement. RLS is enabled
  by default and will silently block all API reads if no
  policies are set.
  
### Design
- Clean, readable, book-friendly aesthetic
- Warm neutral background (cream/off-white, not stark white)
- Dark text for readability
- Mobile-first responsive design
- Primary accent: muted teal or deep blue-green
- Status colors: gray (not started), teal (reading), gold (read)
- Book titles should feel literary, not techy
- Cluster vibe quotes styled as pull quotes (italic, indented)
- Film adaptation indicator: small 🎬 icon next to title

### Task Sizing
- Keep changes small and focused.
- "Smaller tasks give Claude Code less room to make wrong assumptions."
