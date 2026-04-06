-- ============================================================
-- Migration 001: Create books and reading_progress tables
-- ============================================================

-- ------------------------------------------------------------
-- Table: books
-- Static reference data — 100 novellas, seeded once.
-- ------------------------------------------------------------
create table if not exists books (
  id                integer       primary key,
  rank              integer       not null,
  title             text          not null,
  author            text          not null,
  year              integer       not null,
  pages             integer       not null,
  notes             text          not null,
  film_adaptation   text          null,
  section_type      text          not null
    constraint books_section_type_check
      check (section_type in ('quick_wins', 'cluster')),
  section_name      text          not null,
  section_order     integer       not null,
  section_subtitle  text          not null,
  cluster_vibe      text          null,
  order_in_section  integer       not null,
  cover_image_url   text          null
);

-- ------------------------------------------------------------
-- Table: reading_progress
-- One row per (user, book). user_id is nullable for MVP;
-- will become non-nullable when auth is added.
-- ------------------------------------------------------------
create table if not exists reading_progress (
  id                  integer       primary key generated always as identity,
  user_id             uuid          null,
  book_id             integer       not null
    references books (id),
  status              text          not null default 'not_started'
    constraint reading_progress_status_check
      check (status in ('not_started', 'reading', 'read')),
  date_started        timestamptz   null,
  date_completed      timestamptz   null,
  notes_personal      text          null,
  rating              integer       null
    constraint reading_progress_rating_check
      check (rating between 1 and 5),
  pdf_storage_path    text          null,
  study_guide         text          null,
  study_guide_source  text          null
    constraint reading_progress_study_guide_source_check
      check (study_guide_source in ('pdf', 'ai_knowledge')),
  constraint reading_progress_user_book_unique
    unique (user_id, book_id)
);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table books           enable row level security;
alter table reading_progress enable row level security;

-- books: anonymous read only (static data, no writes via API)
create policy "books_anon_read"
  on books
  for select
  to anon
  using (true);

-- reading_progress: anonymous read and update only (MVP)
-- Insert is handled by the seed script using the service role.
-- Delete is not permitted.
create policy "reading_progress_anon_read"
  on reading_progress
  for select
  to anon
  using (true);

create policy "reading_progress_anon_update"
  on reading_progress
  for update
  to anon
  using (true)
  with check (true);
