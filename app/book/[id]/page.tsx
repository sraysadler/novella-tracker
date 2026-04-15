export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BookWithProgress } from "@/lib/types";
import BookDetailClient from "./BookDetailClient";

async function fetchBook(
  id: number
): Promise<{ book: BookWithProgress; sectionNames: string[] } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: books, error: booksError },
    { data: progress },
    { data: bookSections },
    { data: allBooks },
  ] = await Promise.all([
    supabase.from("books").select("*").eq("id", id).single(),
    supabase.from("reading_progress").select("*").eq("user_id", user.id),
    supabase.from("book_sections").select("*").eq("book_id", id),
    supabase.from("books").select("section_order, section_name"),
  ]);

  if (booksError || !books) return null;

  const progressMap = new Map(
    (progress ?? []).map((p: any) => [p.book_id, p])
  );

  const book: BookWithProgress = {
    ...books,
    progress: progressMap.get(books.id) ?? null,
  };

  // Build deduplicated list of section names this book belongs to
  const sectionNameMap = new Map<number, string>(
    (allBooks ?? []).map((b: any) => [b.section_order, b.section_name])
  );
  const sectionOrdersSeen = new Set<number>([books.section_order]);
  const sectionNames: string[] = [books.section_name];
  for (const bs of bookSections ?? []) {
    if (!sectionOrdersSeen.has(bs.section_order)) {
      sectionOrdersSeen.add(bs.section_order);
      const name = sectionNameMap.get(bs.section_order);
      if (name) sectionNames.push(name);
    }
  }

  return { book, sectionNames };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  const result = await fetchBook(bookId);

  if (!result) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/plan"
            className="inline-flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mb-6"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="10 4 6 8 10 12" />
            </svg>
            Back to Reading Plan
          </Link>

          <div className="mt-12">
            <p className="text-stone-500 dark:text-stone-400">
              Book not found.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const { book, sectionNames } = result;

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 sm:px-6 py-8 pb-32 w-full">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/plan"
          className="inline-flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mb-8"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="10 4 6 8 10 12" />
          </svg>
          Back to Reading Plan
        </Link>

        {/* Main content */}
        <div className="space-y-8 max-w-2xl mx-auto">
          {/* Header: Title, author, rank, year */}
          <div>
            <h1 className="font-serif text-4xl font-bold text-stone-900 dark:text-stone-50 mb-2">
              {book.title}
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-400 mb-4">
              {book.author}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-stone-600 dark:text-stone-400">
              <span>#{book.rank} on the master list</span>
              <span>&middot;</span>
              <span>Published {book.year}</span>
              <span>&middot;</span>
              <span>{book.pages} pages</span>
            </div>
            {sectionNames.length > 0 && (
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
                Appears in:{" "}
                {sectionNames.join(" · ")}
              </p>
            )}
          </div>

          {/* Film adaptation (if any) */}
          {book.film_adaptation && (
            <div className="border-l-4 border-teal-500 bg-teal-50 dark:bg-teal-950/30 px-4 py-3 rounded">
              <div className="flex items-start gap-2">
                <span className="text-xl mt-0.5">🎬</span>
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-50 text-sm">
                    Film Adaptation
                  </p>
                  <p className="text-stone-700 dark:text-stone-300 text-sm">
                    {book.film_adaptation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes section */}
          {book.notes && (
            <div>
              <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-50 mb-3">
                About this novella
              </h2>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                {book.notes}
              </p>
            </div>
          )}

          {/* Status controls */}
          <BookDetailClient book={book} />

          {/* Dates (display only) */}
          {(book.progress?.date_started || book.progress?.date_completed) && (
            <div className="border-t border-stone-200 dark:border-stone-700 pt-6 space-y-3">
              {book.progress?.date_started && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">
                    Date started
                  </span>
                  <span className="text-stone-900 dark:text-stone-50 font-medium">
                    {new Date(book.progress.date_started).toLocaleDateString()}
                  </span>
                </div>
              )}
              {book.progress?.date_completed && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">
                    Date completed
                  </span>
                  <span className="text-stone-900 dark:text-stone-50 font-medium">
                    {new Date(book.progress.date_completed).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
