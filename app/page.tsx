export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Book, ReadingProgress, BookWithProgress } from "@/lib/types";

type SectionProgress = {
  section_order: number;
  section_name: string;
  total: number;
  read: number;
};

async function fetchDashboardData() {
  if (!supabase) {
    return {
      books: [],
      progress: [],
      sections: [],
    };
  }

  const [{ data: books, error: booksError }, { data: progress }] =
    await Promise.all([
      supabase
        .from("books")
        .select("*")
        .order("section_order", { ascending: true })
        .order("order_in_section", { ascending: true }),
      supabase.from("reading_progress").select("*").is("user_id", null),
    ]);

  if (booksError || !books) {
    return {
      books: [],
      progress: [],
      sections: [],
    };
  }

  const progressMap = new Map<number, ReadingProgress>(
    (progress ?? []).map((p: ReadingProgress) => [p.book_id, p])
  );

  const booksWithProgress: BookWithProgress[] = (books as Book[]).map(
    (book) => ({
      ...book,
      progress: progressMap.get(book.id) ?? null,
    })
  );

  // Calculate section progress
  const sectionsMap = new Map<number, SectionProgress>();
  for (const book of booksWithProgress) {
    if (!sectionsMap.has(book.section_order)) {
      sectionsMap.set(book.section_order, {
        section_order: book.section_order,
        section_name: book.section_name,
        total: 0,
        read: 0,
      });
    }
    const section = sectionsMap.get(book.section_order)!;
    section.total++;
    if (book.progress?.status === "read") {
      section.read++;
    }
  }

  return {
    books: booksWithProgress,
    progress: progress ?? [],
    sections: Array.from(sectionsMap.values()).sort(
      (a, b) => a.section_order - b.section_order
    ),
  };
}

export default async function Home() {
  const { books, sections } = await fetchDashboardData();

  // Calculate stats
  const totalRead = books.filter((b) => b.progress?.status === "read").length;
  const totalPages = books
    .filter((b) => b.progress?.status === "read")
    .reduce((sum, b) => sum + b.pages, 0);

  // Find currently reading book
  const currentlyReading = books.find((b) => b.progress?.status === "reading");

  // Find next unread book (in same section as currently reading, or first section with unread)
  let nextBook: BookWithProgress | undefined;
  if (currentlyReading) {
    nextBook = books.find(
      (b) =>
        b.section_order === currentlyReading.section_order &&
        b.progress?.status === "not_started"
    );
  }
  if (!nextBook) {
    nextBook = books.find((b) => b.progress?.status === "not_started");
  }

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 sm:px-6 py-12 pb-32 w-full">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="font-serif text-4xl font-bold text-stone-900 dark:text-stone-50 mb-2">
            Your Reading Journey
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Track your progress through 100 great novellas
          </p>
        </div>

        {books.length === 0 ? (
          <div className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              No data yet — run{" "}
              <code className="font-mono bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                npm run seed
              </code>{" "}
              to populate the database.
            </p>
          </div>
        ) : (
          <>
            {/* Progress Summary */}
            <section className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
                  <div className="text-4xl font-bold text-stone-900 dark:text-stone-50">
                    {totalRead}
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    of 100 read
                  </p>
                </div>
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
                  <div className="text-4xl font-bold text-stone-900 dark:text-stone-50">
                    {totalPages}
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    pages read
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-50">
                    Overall Progress
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {totalRead}%
                  </p>
                </div>
                <div className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 dark:bg-teal-500 transition-all duration-300"
                    style={{ width: `${totalRead}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Currently Reading */}
            <section>
              <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-50 mb-4">
                Currently Reading
              </h2>
              {currentlyReading ? (
                <Link href={`/book/${currentlyReading.id}`}>
                  <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-50 truncate">
                          {currentlyReading.title}
                        </h3>
                        <p className="text-stone-600 dark:text-stone-400 mt-1">
                          {currentlyReading.author}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-500 mt-2">
                          {currentlyReading.pages} pages
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-3 h-3 bg-teal-500 rounded-full mt-1" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6 text-center">
                  <p className="text-stone-600 dark:text-stone-400 mb-4">
                    Pick your next book from the reading plan
                  </p>
                  <Link
                    href="/plan"
                    className="inline-block px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white text-sm font-medium rounded hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
                  >
                    View Reading Plan
                  </Link>
                </div>
              )}
            </section>

            {/* Up Next */}
            {nextBook && (
              <section>
                <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-50 mb-4">
                  Up Next
                </h2>
                <Link href={`/book/${nextBook.id}`}>
                  <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-50 truncate">
                          {nextBook.title}
                        </h3>
                        <p className="text-stone-600 dark:text-stone-400 mt-1">
                          {nextBook.author}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-500 mt-2">
                          {nextBook.pages} pages
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-3 h-3 bg-stone-300 dark:bg-stone-600 rounded-full mt-1" />
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Section Progress */}
            <section>
              <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-50 mb-4">
                Progress by Section
              </h2>
              <div className="space-y-3">
                {sections.map((section) => (
                  <Link
                    key={section.section_order}
                    href="/plan"
                    className="block"
                  >
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif font-semibold text-stone-900 dark:text-stone-50 truncate">
                            {section.section_name}
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                            {section.read} of {section.total} read
                          </p>
                        </div>
                        <div className="text-right text-sm font-medium text-stone-600 dark:text-stone-400 flex-shrink-0">
                          {Math.round((section.read / section.total) * 100)}%
                        </div>
                      </div>
                      <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-600 dark:bg-teal-500 transition-all duration-300"
                          style={{
                            width: `${Math.round((section.read / section.total) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="text-center">
              <Link
                href="/plan"
                className="inline-block px-6 py-3 bg-teal-600 dark:bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
              >
                View Full Reading Plan
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
