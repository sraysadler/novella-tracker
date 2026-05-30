# Novella Tracker — Product Spec

## What This App Does
A personal reading tracker for the "100 Greatest Novellas" reading plan.
Users work through the plan (Quick Wins path, then 10 Theme Clusters)
and track their progress. Also includes curated supplementary reading lists.

## Built Features (as of May 2026)

### Core
1. Dashboard — progress stats (books read, pages read, overall %), currently reading card,
   up-next card, section-by-section progress bars
2. Full reading plan view — collapsible sections, accordion state persisted in sessionStorage
3. Book detail view — full notes, film adaptation indicator, status controls
4. Status toggle — not started / currently reading / read (only one book can be "reading" at a time)
5. Progress persists in Supabase — per-user, tied to authenticated account

### Auth
- Supabase email/password auth is live
- All routes are protected by Next.js middleware
- Login page at `/login` with fixed post-sign-in redirect
- Auto-created user profile on signup (via Supabase trigger)

### Search
- Site-wide search at `/search` by title or author
- Search bar in the global header (hidden on `/login`)

### Content
- 100 ranked novellas across 4 Quick Win phases and 10 theme clusters
- Secondary section memberships via `book_sections` table (a book can appear in multiple clusters)
- 59 books in "Best Contemporary Novels Under 200 Pages" list section (`section_type = 'list'`)
- 25 Additional Reads (`rank = null`) sourced from Instagram accounts
  (@gary_turk, @zacareads, @sunnysbooktruck)
- Cover images stored as URLs on the `books` table

### Roles
- User roles: `user` (default) | `editor` | `admin`
- Role badge visible in header for editor/admin accounts
- Role helpers: `getUserRole`, `isAdmin`, `isEditor` in `lib/role.ts`

### Dark Mode
- Full dark mode support throughout the app (Tailwind `dark:` system classes)

## Scaffolded / Planned (not yet built)
- **Study guide feature** — DB columns exist (`pdf_storage_path`, `study_guide`,
  `study_guide_source`) and `ANTHROPIC_API_KEY` is noted, but no UI exists yet
- **Personal notes UI** — `notes_personal` and `rating` columns exist in `reading_progress`
  but are not surfaced in any UI
- **Custom "My Other Reads"** — track books entirely outside all curated lists (Task 32)
- **Responsive design pass** — mobile layout has not been formally audited (Task 8)
- **Visual polish pass** — final typography/spacing pass not done (Task 9)

## Explicitly Out of Scope
- Social features or sharing
- Reading time estimates
- Calendar integration
- Multi-user admin tools

## Data Model Summary
- `books` — static catalog (184 total: 100 ranked + 59 list + 25 extra)
- `reading_progress` — per-user reading state, dates, notes, rating, study guide data
- `book_sections` — secondary section memberships
- `profiles` — user role, auto-created on signup

## Target User
A single user (the app creator) tracking personal reading progress across devices.
Auth is live. Multi-user access is architecturally supported but not a current goal.
