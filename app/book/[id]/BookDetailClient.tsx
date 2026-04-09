"use client";

import { useState, useTransition } from "react";
import type { BookWithProgress, ReadingStatus } from "@/lib/types";
import { updateReadingStatus } from "@/lib/actions";

function StatusDot({ status }: { status: ReadingStatus }) {
  const cls = {
    not_started: "bg-stone-300 dark:bg-stone-600",
    reading: "bg-teal-500",
    read: "bg-amber-400",
  }[status];

  return (
    <span
      className={`inline-block w-3 h-3 rounded-full shrink-0 ${cls}`}
      aria-hidden="true"
    />
  );
}

export default function BookDetailClient({
  book,
}: {
  book: BookWithProgress;
}) {
  const currentStatus = book.progress?.status ?? "not_started";
  const [isPending, startTransition] = useTransition();

  const statusLabels = {
    not_started: "Not started",
    reading: "Reading",
    read: "Read",
  };

  const statusDescriptions = {
    not_started: "You haven't started this novella yet",
    reading: "You're currently reading this novella",
    read: "You've finished this novella",
  };

  const handleStatusChange = (newStatus: ReadingStatus) => {
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      const result = await updateReadingStatus(book.id, newStatus);
      if (!result.success) {
        console.error("Failed to update status:", result.error);
      }
    });
  };

  return (
    <div className="border-t border-stone-200 dark:border-stone-700 pt-8">
      <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-50 mb-4">
        Your progress
      </h2>

      <div className="space-y-3">
        <p className="text-sm text-stone-600 dark:text-stone-400">
          {statusDescriptions[currentStatus]}
        </p>

        <div className="flex flex-col gap-2">
          {(["not_started", "reading", "read"] as ReadingStatus[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={isPending}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  status === currentStatus
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30"
                    : "border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-teal-400 dark:hover:border-teal-500"
                } ${isPending ? "opacity-60" : ""}`}
              >
                <StatusDot status={status} />
                <div className="flex-1">
                  <span className="font-medium text-stone-900 dark:text-stone-50 block text-sm">
                    {statusLabels[status]}
                  </span>
                </div>
                {status === currentStatus && (
                  <svg
                    className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
