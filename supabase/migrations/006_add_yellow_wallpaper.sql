-- ============================================================
-- Migration 006: Add The Yellow Wallpaper to Additional Reads
-- ============================================================

INSERT INTO books (
  id, rank, title, author, year, pages, notes, film_adaptation,
  section_type, section_name, section_order, section_subtitle,
  cluster_vibe, order_in_section
) VALUES (
  103, NULL, 'The Yellow Wallpaper', 'Charlotte Perkins Gilman', 1892, 64,
  'A woman confined to her room by her physician husband slowly unravels — or sees through the wallpaper to something real. One of the great feminist horror stories, written from inside a breakdown.',
  NULL, NULL, NULL, NULL, NULL, NULL, NULL
);

INSERT INTO reading_progress (book_id, user_id, status, date_started, date_completed)
VALUES (103, NULL, 'not_started', NULL, NULL);
