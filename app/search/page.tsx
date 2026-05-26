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
    .or(`title.ilike.%${safe}%,author.ilike.%${safe}%`)
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
          <div className="divide-y divide-stone-200 dark:divide-stone-800 border-y border-stone-200 dark:border-stone-800">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="group flex items-center gap-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors -mx-4 px-4 sm:-mx-6 sm:px-6"
              >
                {book.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.cover_image_url}
                    alt={`Cover of ${book.title}`}
                    className="w-9 h-14 object-cover rounded flex-shrink-0 border border-stone-200 dark:border-stone-700"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-serif font-semibold text-stone-900 dark:text-stone-50 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors truncate">
                    {book.title}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                    {book.author}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-stone-300 dark:text-stone-600 flex-shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 4 10 8 6 12" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
