"use client";

import { useState } from "react";
import Link from "next/link";
import type { SectionData } from "./page";
import type { ReadingStatus } from "@/lib/types";

// ---------------------------------------------------------------------------
// Status dot
// ---------------------------------------------------------------------------
function StatusDot({ status }: { status: ReadingStatus }) {
  const cls = {
    not_started: "bg-stone-300 dark:bg-stone-600",
    reading: "bg-teal-500",
    read: "bg-amber-400",
  }[status];

  const label = {
    not_started: "Not started",
    reading: "Currently reading",
    read: "Read",
  }[status];

  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${cls}`}
      aria-label={label}
      title={label}
    />
  );
}

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
  sections,
}: {
  sections: SectionData[];
}) {
  // Default-open: the section containing a "reading" book, or the first section
  const defaultOpen = (() => {
    const s = sections.find((sec) =>
      sec.books.some((b) => b.progress?.status === "reading")
    );
    return s?.section_order ?? sections[0]?.section_order;
  })();

  const [openSections, setOpenSections] = useState<Set<number>>(
    () => new Set(defaultOpen !== undefined ? [defaultOpen] : [])
  );

  function toggle(order: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(order)) next.delete(order);
      else next.add(order);
      return next;
    });
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
                      <Link
                        href={`/book/${book.id}`}
                        className={`flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors ${
                          idx > 0
                            ? "border-t border-stone-100 dark:border-stone-700/40"
                            : "border-t border-stone-200 dark:border-stone-700"
                        }`}
                      >
                        <StatusDot
                          status={book.progress?.status ?? "not_started"}
                        />

                        {/* Title + author */}
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm text-stone-900 dark:text-stone-100 leading-snug">
                            {book.title}
                          </span>
                          <span className="text-stone-400 dark:text-stone-500 text-xs ml-2">
                            {book.author}
                          </span>
                        </div>

                        {/* Page count + film badge */}
                        <div className="flex items-center gap-2 shrink-0 text-xs text-stone-400 dark:text-stone-500">
                          {book.film_adaptation && (
                            <span
                              title={book.film_adaptation}
                              aria-label="Film adaptation exists"
                            >
                              🎬
                            </span>
                          )}
                          <span className="tabular-nums">{book.pages}p</span>
                        </div>
                      </Link>
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
