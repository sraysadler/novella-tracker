export type SectionType = "quick_wins" | "cluster";

export type ReadingStatus = "not_started" | "reading" | "completed";

export interface Book {
  id: number;
  rank: number;
  title: string;
  author: string;
  year: number;
  pages: number;
  notes: string;
  film_adaptation: string | null;
  section_type: SectionType;
  section_name: string;
  section_order: number;
  section_subtitle: string;
  cluster_vibe: string | null;
  order_in_section: number;
}

export interface ReadingProgress {
  book_id: number;
  status: ReadingStatus;
  date_started: string | null;
  date_completed: string | null;
  notes_personal: string | null;
  rating: number | null;
  pdf_storage_path: string | null;
  study_guide: string | null;
  study_guide_source: string | null;
  cover_image_url: string | null;
  user_id: string | null;
}

export interface BookWithProgress extends Book {
  progress: ReadingProgress | null;
}
