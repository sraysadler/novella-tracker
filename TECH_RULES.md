# Novella Tracker — Tech Rules

## Stack
- Next.js 16+ (App Router)
- Supabase (PostgreSQL database, Auth, JS client via @supabase/ssr)
- Tailwind CSS v4 for styling
- Deploy to Vercel

## Code Standards
- TypeScript for all files
- Use server components where possible, client components only when needed
  (interactivity, state, hooks)
- Server-side DB: `import { createClient } from "@/lib/supabase/server"`
- Client-side DB: `import { createBrowserClient } from "@/lib/supabase/client"`
- Do NOT import from `lib/supabase.ts` (legacy) — use the split server/client modules
- Server actions go in `lib/actions.ts` (marked `"use server"`)
- Role helpers go in `lib/role.ts`
- No ORMs — use Supabase JS client directly
- Environment variables for all Supabase keys (never hardcode)
- Support dark mode on all new UI: include `dark:` Tailwind variants

## Database
Four tables:
- `books` — static book catalog (title, author, year, pages, rank, section info, cover_image_url)
- `reading_progress` — per-user reading state (status, dates, personal notes, rating, study guide)
- `book_sections` — secondary section memberships (a book can appear in multiple clusters)
- `profiles` — user role (user / editor / admin), auto-created on signup via DB trigger

**Book rank / section_type model:**
- `rank 1–100` + `section_type IN ('quick_wins', 'cluster')` — core reading plan books
- `rank 1–100` or `rank > 100` + `section_type = 'list'` — curated list books (not in the 100)
- `rank = null` + `section_type = null` — Additional Reads (extra-list, not counted)
- Only books with `rank IS NOT NULL AND rank <= 100` count toward the 100-novella progress total.

**reading_progress rules:**
- `user_id` is required (auth is live). Always filter by `user.id`.
- `date_started` / `date_completed` are managed automatically by `updateReadingStatus`.
- Enforces single "reading" book: switching to "reading" clears the previous one.
- `pdf_storage_path`, `study_guide`, `study_guide_source` — scaffolded for future study guide UI.
- Status enum: `'not_started'` | `'reading'` | `'read'`
- All dates use timestamptz (ISO 8601)

## Auth
- Supabase email/password auth is live
- All routes are protected by Next.js middleware (`middleware.ts`)
- Auth callback route at `app/auth/callback/route.ts`
- Post-sign-in redirect uses `window.location.href = "/"` (hard redirect required to
  flush the session cookie before server rendering)

## RLS Policy Rules
- Always enable RLS when creating new tables. Add explicit policies for each access pattern.
  Do NOT disable RLS — it silently exposes all rows to any anon request.
  - Public/static tables (e.g. `books`): `TO anon USING (true)` for SELECT.
  - Auth-gated tables (e.g. `profiles`): `TO authenticated USING (id = auth.uid())`.
  - User-owned tables (e.g. `reading_progress`): policies scoped to `auth.uid()`.

## File Structure
```
app/
  page.tsx               — Dashboard
  layout.tsx             — Root layout (header with search bar + role badge, footer)
  login/page.tsx         — Login page
  auth/callback/route.ts — Supabase auth callback
  plan/page.tsx          — Full reading plan view
  plan/PlanAccordion.tsx — Client accordion component
  plan/BookRow.tsx       — Individual book row with status dropdown
  book/[id]/page.tsx     — Book detail (server)
  book/[id]/BookDetailClient.tsx — Status controls (client)
  search/page.tsx        — Search results
components/
  SearchBar.tsx          — Search input (client, hidden on /login)
  SignOutButton.tsx      — Sign-out button (client)
  SectionProgressLink.tsx — Clickable section progress card (client)
lib/
  supabase/server.ts     — Server-side Supabase client
  supabase/client.ts     — Browser-side Supabase client
  actions.ts             — Server actions (updateReadingStatus)
  types.ts               — TypeScript types
  role.ts                — Role helpers (getUserRole, isAdmin, isEditor)
data/
  books.json             — Seed data for all books
  book_sections.json     — Secondary section membership data
  initial_progress.json  — Seed data for reading_progress
scripts/
  seed.ts                — Seed books + reading_progress (safe to re-run)
  seed-contemporary.ts   — Seed "Best Contemporary" list section
  count-books.ts         — Query live DB for book counts by category
  update-gary-turk-books.ts — Upsert attribution/books from Instagram sources
supabase/migrations/     — SQL migration files (001–009)
```

## Do Not
- Do not install a CSS framework other than Tailwind
- Do not create API routes unless necessary — use server components with direct Supabase calls
- Do not use localStorage for reading progress — all state lives in Supabase
- Do not expose the Supabase service role key in browser code
- Do not hardcode a single-user assumption — always filter reading_progress by user_id
- Do not use `router.push` alone after auth actions — use a hard redirect

## Task Sizing & Token Management
- Keep individual tasks small and focused — both to limit wrong assumptions and to
  keep Claude Code token cost manageable
- If a task involves processing large input data or generating large output (e.g., building
  a 100-entry JSON), split content generation from code placement:
  - Use Claude Chat to generate data files and content
  - Use Claude Code only to place files and write code that interacts with the codebase
- "Smaller tasks give Claude Code less room to make wrong assumptions"
