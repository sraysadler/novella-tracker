export default function SearchBar() {
  return (
    <form action="/search" method="GET" role="search" className="relative w-full">
      <input
        type="search"
        name="q"
        placeholder="Search books, authors…"
        className="w-full pl-4 pr-10 py-2 text-sm rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-50 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-colors"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="8.5" cy="8.5" r="5.5" />
          <line x1="13" y1="13" x2="18" y2="18" />
        </svg>
      </button>
    </form>
  );
}
