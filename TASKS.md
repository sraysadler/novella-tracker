# Novella Tracker — Task Queue

## Slice 1: Foundation
- [x] Task 1: Scaffold Next.js project with Tailwind, connect to Supabase and Vercel
- [x] Task 2: Create books.json and initial_progress.json seed data from reading plan documents
- [x] Task 3: Create Supabase tables (books + reading_progress) and seed them

## Slice 2: Reading Plan View
- [x] Task 4: Build the full reading plan page with collapsible sections
- [x] Task 4b: Apply DESIGN_RULES.md styling to /plan page
- [x] Task 5: Add status toggle (not started / reading / read) to each book row

## Slice 3: Book Detail
- [x] Task 6: Build book detail page with full notes, film info, and status controls
- [x] Task 6.5: Persist accordion open/closed state on /plan using sessionStorage

## Slice 4: Dashboard
- [x] Task 7: Build dashboard with progress stats, current read, and up-next card

## Auth
- [x] Add Supabase email/password auth (login page, middleware, sign-out)
- [x] Fix login redirect hanging after sign-in (hard redirect via window.location.href)

## Search
- [x] Add site-wide search by title/author (/search page + SearchBar component)
- [x] Center search bar in header; hide on /login

## Content Expansion
- [x] Add secondary section memberships (book_sections table — books in multiple clusters)
- [x] Add "Best Contemporary Novels Under 200 Pages" section (section_type = 'list', 59 books)
- [x] Add Additional Reads from @gary_turk, @zacareads, @sunnysbooktruck (25 books, rank = null)
- [x] Add cover_image_url to books table; show in search results

## Roles
- [x] Add profiles table with user_role enum (user / editor / admin)
- [x] Show role badge (Admin / Editor) in header
- [x] Add role helper utilities in lib/role.ts

## Slice 5: Polish
- [ ] Task 8: Responsive design pass (test and fix mobile layout)
- [ ] Task 9: Visual polish pass (colors, typography, spacing per DESIGN_RULES)
- [ ] Task 10: Seed data audit + fresh start reset
  - Verify all 100 ranked books match the reading plan docs
  - Fix any data errors found during testing
  - Run `npm run seed` to reset all reading_progress to clean state

## Phase 3
- [ ] Task 32: Custom books ("My Other Reads") — track books entirely outside all curated lists
- [ ] Study guide feature — UI for existing DB scaffolding (pdf_storage_path, study_guide,
  study_guide_source); requires ANTHROPIC_API_KEY

## Open Bugs
- [ ] "Appears in" missing on book detail page for cluster-only books
- [ ] "Back to Reading Plan" link doesn't preserve scroll position
- [ ] /plan subtitle double-counts books with secondary memberships

## Bug Fixes Completed
- Fixed missing Link import in PlanAccordion.tsx (build error)
- Fixed duplicate Link code in PlanAccordion.tsx (build error)
- Fixed status dropdown intercepted by Link navigation (restructured as siblings)
- Fixed page centering (removed CSS reset overriding Tailwind mx-auto)
- Fixed dropdown clipping by section containers (z-index fix)
- Fixed status controls visual update on book detail page (optimistic state)
- Fixed login redirect hanging (router.refresh + router.push race condition)
- Fixed login spinner stuck (replaced with hard redirect window.location.href)
