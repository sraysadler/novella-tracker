"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import type { BookWithProgress } from "@/lib/types";
import type { ReadingStatus } from "@/lib/types";
import { updateReadingStatus } from "@/lib/actions";

function StatusDot({ status }: { status: ReadingStatus }) {
  const cls = {
    not_started: "bg-stone-300 dark:bg-stone-600",
    reading: "bg-teal-500",
    read: "bg-amber-400",
  }[status];

  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${cls}`}
      aria-hidden="true"
    />
  );
}

export default function BookRow({
  book,
  isFirst,
  onStatusChange,
}: {
  book: BookWithProgress;
  isFirst: boolean;
  onStatusChange?: (bookId: number, newStatus: ReadingStatus) => void;
}) {
  const currentStatus = book.progress?.status ?? "not_started";
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleStatusChange = (newStatus: ReadingStatus) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    // Optimistically update UI
    onStatusChange?.(book.id, newStatus);

    // Call server action
    startTransition(async () => {
      const result = await updateReadingStatus(book.id, newStatus);
      if (!result.success) {
        // On error, revert to current status (parent will handle this via page reload)
        console.error("Failed to update status:", result.error);
      }
    });
  };

  const statusLabels = {
    not_started: "Not started",
    reading: "Reading",
    read: "Read",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 transition-colors relative ${
        isFirst ? "border-t border-stone-200 dark:border-stone-700" : "border-t border-stone-100 dark:border-stone-700/40"
      } ${isPending ? "opacity-75" : ""}`}
    >
      {/* Status dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-1.5 p-1 -m-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          aria-label={`Change status: currently ${statusLabels[currentStatus]}`}
          disabled={isPending}
        >
          <StatusDot status={currentStatus} />
          <svg
            className={`w-3 h-3 text-stone-400 dark:text-stone-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 16 16"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 6 8 10 12 6" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg z-50 min-w-48">
            {(["not_started", "reading", "read"] as ReadingStatus[]).map((status) => (
              <button
                key={status}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(status);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-stone-100 dark:border-stone-700/50 last:border-b-0 flex items-center gap-2 transition-colors ${
                  status === currentStatus
                    ? "bg-stone-100 dark:bg-stone-700 font-medium text-stone-900 dark:text-stone-50"
                    : "hover:bg-stone-50 dark:hover:bg-stone-700/50 text-stone-700 dark:text-stone-300"
                }`}
                disabled={isPending}
              >
                <StatusDot status={status} />
                {statusLabels[status]}
                {status === currentStatus && (
                  <svg className="w-4 h-4 ml-auto text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Link wraps only the book info */}
      <Link
        href={`/book/${book.id}`}
        className="flex items-center gap-3 flex-1 min-w-0 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors -mx-4 px-4 py-2.5 -my-2.5"
      >
        {/* Title + author */}
        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm text-stone-900 dark:text-stone-100 leading-snug">
            {book.title}
          </span>
          <span className="block text-xs text-stone-400 dark:text-stone-500 mt-0.5">
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
              {'\u{1F3AC}\uFE0F'}
            </span>
          )}
          <span className="tabular-nums">{book.pages}p</span>
        </div>
      </Link>
    </div>
  );
}
