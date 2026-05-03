// Always fetch fresh — this page reads live reading progress.
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Book, ReadingProgress, BookWithProgress, BookSection } from "@/lib/types";
import PlanAccordion from "./PlanAccordion";

export type SectionData = {
  section_order: number;
  section_name: string;
  section_subtitle: string;
  section_type: "quick_wins" | "cluster";
  cluster_vibe: string | null;
  books: BookWithProgress[];
};

type FetchResult = {
  sections: SectionData[];
  extraBooks: BookWithProgress[];
};

async function fetchSections(): Promise<FetchResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: books, error: booksError }, { data: progress }, { data: bookSections }] =
    await Promise.all([
      supabase
        .from("books")
        .select("*")
        .order("section_order", { ascending: true })
        .order("order_in_section", { ascending: true }),
      supabase.from("reading_progress").select("*").eq("user_id", user.id),
      supabase.from("book_sections").select("*"),
    ]);

  if (booksError || !books) return { sections: [], extraBooks: [] };

  const progressMap = new Map<number, ReadingProgress>(
    (progress ?? []).map((p: ReadingProgress) => [p.book_id, p])
  );

  const booksWithProgress = new Map<number, BookWithProgress>();
  const extraBooks: BookWithProgress[] = [];

  for (const book of books as Book[]) {
    const bwp: BookWithProgress = {
      ...book,
      progress: progressMap.get(book.id) ?? null,
    };
    if (book.section_type === null) {
      extraBooks.push(bwp);
    } else {
      booksWithProgress.set(book.id, bwp);
    }
  }

  // section_order -> SectionData (metadata only, no books yet)
  const sectionsMap = new Map<number, SectionData>();

  // Add primary section entries from books table (extra-list books excluded above)
  for (const book of booksWithProgress.values()) {
    if (!sectionsMap.has(book.section_order)) {
      sectionsMap.set(book.section_order, {
        section_order: book.section_order,
        section_name: book.section_name,
        section_subtitle: book.section_subtitle,
        section_type: book.section_type as "quick_wins" | "cluster",
        cluster_vibe: book.cluster_vibe,
        books: [],
      });
    }
  }

  // Build a list of (section_order, order_in_section, BookWithProgress) entries
  type BookPlacement = { section_order: number; order_in_section: number; book: BookWithProgress };
  const placements: BookPlacement[] = [];

  // Primary memberships
  for (const book of booksWithProgress.values()) {
    placements.push({
      section_order: book.section_order,
      order_in_section: book.order_in_section,
      book,
    });
  }

  // Secondary memberships from book_sections
  for (const bs of (bookSections ?? []) as BookSection[]) {
    const book = booksWithProgress.get(bs.book_id);
    if (!book) continue;
    // Section metadata must come from the book that primarily owns this section_order,
    // or we may need to find it. We only add the section to the map if already present
    // (all sections should already be seeded via primary memberships).
    placements.push({
      section_order: bs.section_order,
      order_in_section: bs.order_in_section,
      book,
    });
  }

  // Sort placements and distribute into sections
  placements.sort((a, b) =>
    a.section_order !== b.section_order
      ? a.section_order - b.section_order
      : a.order_in_section - b.order_in_section
  );

  for (const section of sectionsMap.values()) {
    section.books = [];
  }
  for (const { section_order, book } of placements) {
    sectionsMap.get(section_order)?.books.push(book);
  }

  return {
    sections: Array.from(sectionsMap.values()).sort((a, b) => a.section_order - b.section_order),
    extraBooks,
  };
}

export default async function PlanPage() {
  const { sections, extraBooks } = await fetchSections();

  // Only count list books (rank !== null) toward the 100-book total
  const readBookIds = new Set(
    sections
      .flatMap((s) => s.books)
      .filter((b) => b.progress?.status === "read")
      .map((b) => b.id)
  );
  const totalRead = readBookIds.size;

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 sm:px-6 py-12 pb-32 w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50 mb-2">
          Reading Plan
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-10">
          {totalRead}{" "}of 100 novellas read &middot; Quick Wins path &rarr; 10 theme clusters
        </p>

        {sections.length === 0 ? (
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            No data yet — run <code className="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">npm run seed</code> to populate the database.
          </p>
        ) : (
          <PlanAccordion sections={sections} extraBooks={extraBooks} />
        )}
      </div>
    </main>
  );
}
