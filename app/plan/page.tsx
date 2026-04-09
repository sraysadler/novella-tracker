// Always fetch fresh — this page reads live reading progress.
export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import type { Book, ReadingProgress, BookWithProgress } from "@/lib/types";
import PlanAccordion from "./PlanAccordion";

export type SectionData = {
  section_order: number;
  section_name: string;
  section_subtitle: string;
  section_type: "quick_wins" | "cluster";
  cluster_vibe: string | null;
  books: BookWithProgress[];
};

async function fetchSections(): Promise<SectionData[]> {
  if (!supabase) return [];

  const [{ data: books, error: booksError }, { data: progress }] =
    await Promise.all([
      supabase
        .from("books")
        .select("*")
        .order("section_order", { ascending: true })
        .order("order_in_section", { ascending: true }),
      supabase.from("reading_progress").select("*").is("user_id", null),
    ]);

  if (booksError || !books) return [];

  const progressMap = new Map<number, ReadingProgress>(
    (progress ?? []).map((p: ReadingProgress) => [p.book_id, p])
  );

  const booksWithProgress: BookWithProgress[] = (books as Book[]).map(
    (book) => ({
      ...book,
      progress: progressMap.get(book.id) ?? null,
    })
  );

  const sectionsMap = new Map<number, SectionData>();

  for (const book of booksWithProgress) {
    if (!sectionsMap.has(book.section_order)) {
      sectionsMap.set(book.section_order, {
        section_order: book.section_order,
        section_name: book.section_name,
        section_subtitle: book.section_subtitle,
        section_type: book.section_type,
        cluster_vibe: book.cluster_vibe,
        books: [],
      });
    }
    sectionsMap.get(book.section_order)!.books.push(book);
  }

  return Array.from(sectionsMap.values());
}

export default async function PlanPage() {
  const sections = await fetchSections();

  const totalRead = sections.reduce(
    (sum, s) => sum + s.books.filter((b) => b.progress?.status === "read").length,
    0
  );

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 sm:px-6 py-12 pb-32 w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50 mb-2">
          Reading Plan
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-10">
          {totalRead} of 100 novellas read &middot; Quick Wins path &rarr; 10 theme clusters
        </p>

        {sections.length === 0 ? (
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            No data yet — run <code className="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">npm run seed</code> to populate the database.
          </p>
        ) : (
          <PlanAccordion sections={sections} />
        )}
      </div>
    </main>
  );
}
