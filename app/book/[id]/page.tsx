import Link from "next/link";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 py-8">
      <div className="max-w-2xl mx-auto">
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

        <div className="rounded-xl border border-stone-200 dark:border-stone-700/60 bg-white dark:bg-stone-900 px-6 py-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400 mb-2">
            Book #{id}
          </p>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-2">
            Book detail
          </h1>
          <p className="text-sm text-stone-400 dark:text-stone-500">
            Coming soon — full book detail page with notes, study guide, and
            status controls.
          </p>
        </div>
      </div>
    </main>
  );
}
