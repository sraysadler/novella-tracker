"use client";

import { useState, useEffect } from "react";
import type { SectionData } from "./page";
import type { ReadingStatus, BookWithProgress } from "@/lib/types";
import BookRow from "./BookRow";

// ---------------------------------------------------------------------------
// Chevron icon
// ---------------------------------------------------------------------------
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 shrink-0 transition-transform duration-200 text-stone-400 dark:text-stone-500 ${
        open ? "rotate-180" : ""
      }`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="4 6 8 10 12 6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Section label pill (Quick Wins vs Cluster N)
// ---------------------------------------------------------------------------
function SectionPill({
  section,
}: {
  section: SectionData;
}) {
  if (section.section_type === "quick_wins") {
    return (
      <span className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
        Quick Wins
      </span>
    );
  }
  // "The Wild & the Elements" → show cluster number derived from section_order (5-14 → 1-10)
  const clusterNum = section.section_order - 4;
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
      Cluster {clusterNum}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------
function ProgressBar({ read, total }: { read: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((read / total) * 100);
  return (
    <div className="h-1 w-16 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
      <div
        className="h-full rounded-full bg-teal-600 dark:bg-teal-500 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main accordion
// ---------------------------------------------------------------------------
export default function PlanAccordion({
  sections: initialSections,
  extraBooks: initialExtraBooks = [],
}: {
  sections: SectionData[];
  extraBooks?: BookWithProgress[];
}) {
  // Default-open: the section containing a "reading" book, or the first section
  const defaultOpen = (() => {
    const s = initialSections.find((sec) =>
      sec.books.some((b) => b.progress?.status === "reading")
    );
    return s?.section_order ?? initialSections[0]?.section_order;
  })();

  const [openSections, setOpenSections] = useState<Set<number>>(
    () => {
      // Try to load from sessionStorage first
      try {
        const stored = sessionStorage.getItem("plan-open-sections");
        if (stored) {
          const parsed = JSON.parse(stored) as number[];
          return new Set(parsed);
        }
      } catch {
        // Ignore parse errors, fall through to default
      }
      return new Set(defaultOpen !== undefined ? [defaultOpen] : []);
    }
  );

  // Restore scroll position when returning from a book detail page
  useEffect(() => {
    const savedY = sessionStorage.getItem("plan-scroll-y");
    if (savedY) {
      window.scrollTo({ top: parseInt(savedY), behavior: "instant" });
      sessionStorage.removeItem("plan-scroll-y");
      return;
    }
    // Scroll to the target section when arriving from dashboard link
    try {
      const stored = sessionStorage.getItem("plan-open-sections");
      if (stored) {
        const parsed = JSON.parse(stored) as number[];
        if (parsed.length === 1) {
          const el = document.getElementById(`section-${parsed[0]}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // State to track status changes for optimistic updates
  const [sections, setSections] = useState(initialSections);
  const [extraBooks, setExtraBooks] = useState(initialExtraBooks);
  const [extraOpen, setExtraOpen] = useState(false);

  // Save to sessionStorage whenever openSections changes
  useEffect(() => {
    const openArray = Array.from(openSections);
    sessionStorage.setItem("plan-open-sections", JSON.stringify(openArray));
  }, [openSections]);

  function toggle(order: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(order)) next.delete(order);
      else next.add(order);
      return next;
    });
  }

  function handleStatusChange(bookId: number, newStatus: ReadingStatus) {
    function updateBook(book: BookWithProgress) {
      if (book.id === bookId) {
        return {
          ...book,
          progress: book.progress ? { ...book.progress, status: newStatus } : null,
        };
      }
      if (newStatus === "reading" && book.progress?.status === "reading") {
        return {
          ...book,
          progress: book.progress ? { ...book.progress, status: "not_started" } : null,
        };
      }
      return book;
    }

    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        books: section.books.map(updateBook),
      }))
    );
    setExtraBooks((prev) => prev.map(updateBook));
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section) => {
        const isOpen = openSections.has(section.section_order);
        const readCount = section.books.filter(
          (b) => b.progress?.status === "read"
        ).length;
        const total = section.books.length;

        return (
          <div
            key={section.section_order}
            id={`section-${section.section_order}`}
            className="rounded-xl border border-stone-200 dark:border-stone-700/60 bg-stone-50 dark:bg-stone-900"
          >
            {/* ── Section header ── */}
            <button
              onClick={() => toggle(section.section_order)}
              className="w-full flex items-start justify-between gap-3 px-4 py-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-700/60 transition-colors text-left"
              aria-expanded={isOpen}
            >
              {/* Left: label + name + subtitle */}
              <div className="flex-1 min-w-0">
                <SectionPill section={section} />
                <p className="font-serif font-semibold text-base text-stone-900 dark:text-stone-50 mt-0.5 leading-snug">
                  {section.section_name}
                </p>
                <p className="text-xs italic text-stone-400 dark:text-stone-500 mt-0.5 leading-snug">
                  {section.section_subtitle}
                </p>
              </div>

              {/* Right: progress + chevron */}
              <div className="flex flex-col items-end gap-1.5 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-400 dark:text-stone-500 whitespace-nowrap tabular-nums">
                    {readCount} of {total}
                  </span>
                  <Chevron open={isOpen} />
                </div>
                <ProgressBar read={readCount} total={total} />
              </div>
            </button>

            {/* ── Book list (collapsible) ── */}
            {isOpen && (
              <div>
                <ul role="list">
                  {section.books.map((book, idx) => (
                    <li key={book.id}>
                      <BookRow
                        book={book}
                        isFirst={idx === 0}
                        onStatusChange={handleStatusChange}
                      />
                    </li>
                  ))}
                </ul>

                {/* ── Cluster vibe pull quote ── */}
                {section.cluster_vibe && (
                  <div className="px-5 pb-5 pt-3 border-t border-stone-100 dark:border-stone-700/40">
                    <blockquote className="border-l-[3px] border-teal-400 dark:border-teal-500 pl-4 ml-1">
                      <p className="text-sm italic text-stone-500 dark:text-stone-400 leading-relaxed">
                        {section.cluster_vibe}
                      </p>
                    </blockquote>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Additional Reads section ── */}
      {extraBooks.length > 0 && (
        <div
          id="section-extra"
          className="rounded-xl border border-stone-200 dark:border-stone-700/60 bg-stone-50 dark:bg-stone-900"
        >
          <button
            onClick={() => setExtraOpen((prev) => !prev)}
            className="w-full flex items-start justify-between gap-3 px-4 py-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-700/60 transition-colors text-left"
            aria-expanded={extraOpen}
          >
            <div className="flex-1 min-w-0">
              <p className="font-serif font-semibold text-base text-stone-900 dark:text-stone-50 mt-0.5 leading-snug">
                Additional Reads
              </p>
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <Chevron open={extraOpen} />
            </div>
          </button>

          {extraOpen && (
            <ul role="list">
              {extraBooks.map((book, idx) => (
                <li key={book.id}>
                  <BookRow
                    book={book}
                    isFirst={idx === 0}
                    onStatusChange={handleStatusChange}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
