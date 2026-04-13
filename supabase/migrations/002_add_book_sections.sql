CREATE TABLE book_sections (
  id bigint primary key generated always as identity,
  book_id bigint not null references books(id) on delete cascade,
  section_order integer not null,
  order_in_section integer not null
);
CREATE INDEX idx_book_sections_book_id ON book_sections(book_id);
CREATE INDEX idx_book_sections_section_order ON book_sections(section_order);
