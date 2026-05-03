-- ============================================================
-- Migration 005: Allow books outside the 100-novella list
-- Makes ranking and section fields nullable so extra-list
-- books can be stored without dummy values.
-- ============================================================

ALTER TABLE books
  ALTER COLUMN rank             DROP NOT NULL,
  ALTER COLUMN notes            DROP NOT NULL,
  ALTER COLUMN section_type     DROP NOT NULL,
  ALTER COLUMN section_name     DROP NOT NULL,
  ALTER COLUMN section_order    DROP NOT NULL,
  ALTER COLUMN section_subtitle DROP NOT NULL,
  ALTER COLUMN order_in_section DROP NOT NULL;

ALTER TABLE books
  DROP CONSTRAINT IF EXISTS books_section_type_check;

ALTER TABLE books
  ADD CONSTRAINT books_section_type_check
    CHECK (section_type IN ('quick_wins', 'cluster') OR section_type IS NULL);
