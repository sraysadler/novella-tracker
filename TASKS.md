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
- [ ] Task 7: Build dashboard with progress stats, current read, and up-next card

## Slice 5: Polish
- [ ] Task 8: Responsive design pass (test and fix mobile layout)
- [ ] Task 9: Visual polish pass (colors, typography, spacing per DESIGN_RULES)
- [ ] Task 10: Seed data audit + fresh start reset
  - Verify all 100 books match the reading plan docs
  - Fix any data errors found during testing
  - Run `npm run seed` to reset all reading_progress to clean state
    (all books back to "not_started", Train Dreams back to "reading")
  - This clears any test data from development and gives you a fresh
    start for actually using the app

## Bug Fixes Completed
- Fixed missing Link import in PlanAccordion.tsx (build error)
- Fixed duplicate Link code in PlanAccordion.tsx (build error)
- Fixed status dropdown intercepted by Link navigation (restructured as siblings)
- Fixed page centering (removed CSS reset overriding Tailwind mx-auto)
- Fixed dropdown clipping by section containers (z-index fix)
- Fixed status controls visual update on book detail page (optimistic state)
