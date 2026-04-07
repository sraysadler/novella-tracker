"use client";

import { useState } from "react";
import type { SectionData } from "./page";
import type { ReadingStatus } from "@/lib/types";
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
        className="h-full rounded-full bg-amber-400 transition-all duration-300"
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
}: {
  sections: SectionData[];
}) {
  // Default-open: the section containing a "reading" book, or the first section
  const defaultOpen = (() => {
    const s = initialSections.find((sec) =>
      sec.books.some((b) => b.progress?.status === "reading")
    );
    return s?.section_order ?? initialSections[0]?.section_order;
  })();

  const [openSections, setOpenSections] = useState<Set<number>>(
    () => new Set(defaultOpen !== undefined ? [defaultOpen] : [])
  );

  // State to track status changes for optimistic updates
  const [sections, setSections] = useState(initialSections);

  function toggle(order: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(order)) next.delete(order);
      else next.add(order);
      return next;
    });
  }

  function handleStatusChange(bookId: number, newStatus: ReadingStatus) {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        books: section.books.map((book) => {
          if (book.id === bookId) {
            return {
              ...book,
              progress: book.progress ? { ...book.progress, status: newStatus } : null,
            };
          }
          // If changing this book to "reading", change any other "reading" book to "not_started"
          if (newStatus === "reading" && book.progress?.status === "reading") {
            return {
              ...book,
              progress: book.progress ? { ...book.progress, status: "not_started" } : null,
            };
          }
          return book;
        }),
      }))
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sections.map((section) => {
        const isOpen = openSections.has(section.section_order);
        const readCount = section.books.filter(
          (b) => b.progress?.status === "read"
        ).length;
        const total = section.books.length;

        return (
          <div
            key={section.section_order}
            className="rounded-xl border border-stone-200 dark:border-stone-700/60 overflow-hidden bg-white dark:bg-stone-900"
          >
            {/* ── Section header ── */}
            <button
              onClick={() => toggle(section.section_order)}
              className="w-full flex items-start justify-between gap-3 px-4 py-3.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-700/60 transition-colors text-left"
              aria-expanded={isOpen}
            >
              {/* Left: label + name + subtitle */}
              <div className="flex-1 min-w-0">
                <SectionPill section={section} />
                <p className="font-semibold text-sm text-stone-900 dark:text-stone-50 mt-0.5 leading-snug">
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
                  <div className="px-4 pb-4 pt-2 border-t border-stone-100 dark:border-stone-700/40">
                    <blockquote className="border-l-2 border-teal-400 dark:border-teal-500 pl-3">
                      <p className="text-sm italic text-stone-400 dark:text-stone-500 leading-relaxed">
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
    </div>
  );
}
