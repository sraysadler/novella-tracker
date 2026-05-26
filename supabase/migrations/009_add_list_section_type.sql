-- ============================================================
-- Migration 009: Add 'list' section_type for curated reading lists
-- Allows books to belong to external curated lists
-- (e.g. "Best Contemporary Novels Under 200 Pages") without
-- being counted in the 100-novella plan.
-- ============================================================

ALTER TABLE books
  DROP CONSTRAINT IF EXISTS books_section_type_check;

ALTER TABLE books
  ADD CONSTRAINT books_section_type_check
    CHECK (section_type IN ('quick_wins', 'cluster', 'list') OR section_type IS NULL);
