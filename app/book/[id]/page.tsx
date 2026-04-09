export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { BookWithProgress } from "@/lib/types";
import BookDetailClient from "./BookDetailClient";

async function fetchBook(id: number): Promise<BookWithProgress | null> {
  if (!supabase) return null;

  const [{ data: books, error: booksError }, { data: progress }] =
    await Promise.all([
      supabase.from("books").select("*").eq("id", id).single(),
      supabase.from("reading_progress").select("*").is("user_id", null),
    ]);

  if (booksError || !books) return null;

  const progressMap = new Map(
    (progress ?? []).map((p: any) => [p.book_id, p])
  );

  return {
    ...books,
    progress: progressMap.get(books.id) ?? null,
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  const book = await fetchBook(bookId);

  if (!book) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 py-8">
        <div className="max-w-3xl mx-auto">
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

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 sm:px-6 py-8 pb-32 w-full">
      <div className="max-w-3xl mx-auto">
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
        <div className="space-y-8">
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
