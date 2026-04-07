# Novella Tracker — Tech Rules

## Stack
- Next.js 14+ (App Router)
- Supabase (PostgreSQL database, JS client)
- Tailwind CSS for styling
- Deploy to Vercel

## Code Standards
- TypeScript for all files
- Use server components where possible, client components only when needed
  (interactivity, state)
- All database queries go through a single lib/supabase.ts client file
- No ORMs — use Supabase JS client directly
- Environment variables for all Supabase keys (never hardcode)

## Database
- Two tables: `books` (static book data) and `reading_progress` (user-specific status/notes/ratings)
- `reading_progress.user_id` is nullable in MVP, becomes required when auth is added
- `reading_progress.book_id` is a foreign key to `books.id`
- Status is stored as an enum: 'not_started' | 'reading' | 'read'
- All dates use timestamptz (ISO 8601 with time) for future analytics
- Seed the `books` table with all 100 entries from the reading plan data
- Seed `reading_progress` with 100 rows (one per book, all 'not_started', null user_id)

## Auth Readiness
- Schema is designed for multi-device access via Supabase Auth
- When auth is added: make user_id required, add RLS policy (user_id = auth.uid()),
  add login/signup page, seed reading_progress per user on first login
- Do not add auth in MVP — but do not make any design decisions that
  assume a single user permanently

## File Structure
app/
  page.tsx              — Dashboard
  plan/
    page.tsx            — Full reading plan view
  book/[id]/
    page.tsx            — Book detail
components/             — Reusable UI components
lib/
  supabase.ts           — Supabase client
  types.ts              — TypeScript types
data/
  books.json            — Seed data for all 100 books (static)
  initial_progress.json — Seed data for reading progress

## Do Not
- Do not install a CSS framework other than Tailwind
- Do not add authentication in MVP (but keep schema auth-ready)
- Do not create API routes unless necessary — use server components
  with direct Supabase calls
- Do not use localStorage for progress — all state lives in Supabase
- Do not expose the Supabase service role key in browser code
- Do not hardcode a single-user assumption — always query reading_progress
  with a user_id filter (use null for MVP)

## Task Sizing & Token Management
- Keep individual tasks small and focused — both to limit wrong
  assumptions and to keep Claude Code token cost manageable
- If a task involves processing large input data or generating large
  output (e.g., building a 100-entry JSON from source documents),
  split the content generation from the code placement:
  - Use Claude Chat to generate data files and content
  - Use Claude Code only to place files and write code that interacts
    with the codebase
- Claude Code's token budget is best spent on work that requires
  access to the codebase — not reading documents or producing data
- Heavy tasks (large data processing, long code generation) will be
  flagged in task briefs so they can be planned around daily token resets
- "Smaller tasks give Claude Code less room to make wrong assumptions"
  — this is a core development principle for this project

## Claude Code Task Rules
- Always install any packages required by the code you write — do not
  create files that import modules without adding them to package.json
- Always add any new scripts (e.g., seed, migrate) to package.json
- If a task requires environment variables or API keys that aren't
  already in .env.local, list them explicitly in the task output so
  the developer knows what to add

## Credentials & Environment Variables
- Every task brief that touches an external service must include a
  "Before you start" section listing any keys or credentials needed
- The master credentials list for the project is maintained in the
  app plan document — gather all credentials at project start
- Never commit actual keys to the repo — only .env.local.example
  with placeholder values
