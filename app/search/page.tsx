export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Book } from "@/lib/types";

async function searchBooks(query: string): Promise<Book[]> {
  const supabase = await createClient();
  // Strip characters that would break PostgREST filter parsing
  const safe = query.replace(/[,()]/g, " ").trim();
  if (!safe) return [];

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .or(
      [
        `title.ilike.%${safe}%`,
        `author.ilike.%${safe}%`,
        `notes.ilike.%${safe}%`,
        `section_name.ilike.%${safe}%`,
        `section_subtitle.ilike.%${safe}%`,
        `film_adaptation.ilike.%${safe}%`,
        `cluster_vibe.ilike.%${safe}%`,
      ].join(",")
    )
    .order("rank", { ascending: true, nullsFirst: false });

  if (error) return [];
  return (data as Book[]) ?? [];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const books = query ? await searchBooks(query) : [];

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 sm:px-6 py-12 pb-32 w-full">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back link */}
        <Link
          href="/plan"
          className="inline-flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
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
          Back to reading plan
        </Link>

        {/* Page header */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
            {query ? (
              <>
                Results for{" "}
                <span className="italic">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              "Search"
            )}
          </h1>
          {query && (
            <p className="text-stone-500 dark:text-stone-400 mt-1 text-sm">
              {books.length === 0
                ? "No results"
                : `${books.length} ${books.length === 1 ? "book" : "books"} found`}
            </p>
          )}
        </div>

        {/* Results */}
        {!query ? null : books.length === 0 ? (
          <p className="text-stone-600 dark:text-stone-400">
            No results match that search.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="group flex flex-col gap-3"
              >
                {/* Cover image — only shown when available */}
                {book.cover_image_url && (
                  <div className="relative aspect-[2/3] w-full rounded overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm group-hover:shadow-md transition-shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={book.cover_image_url}
                      alt={`Cover of ${book.title}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Title + author */}
                <div className="min-w-0">
                  <p className="font-serif font-semibold text-sm text-stone-900 dark:text-stone-50 line-clamp-2 leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                    {book.title}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                    {book.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
