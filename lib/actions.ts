"use server";

import { supabase } from "@/lib/supabase";
import type { ReadingStatus } from "@/lib/types";

export interface UpdateProgressResult {
  success: boolean;
  error?: string;
}

/**
 * Update a book's reading status with side-effect handling:
 * - Auto-set/clear date_started and date_completed based on status
 * - Ensure only one book has "reading" status at a time
 */
export async function updateReadingStatus(
  bookId: number,
  newStatus: ReadingStatus
): Promise<UpdateProgressResult> {
  if (!supabase) {
    return { success: false, error: "Database not available" };
  }

  try {
    // Fetch current progress to know what we're changing from
    const { data: currentProgress, error: fetchError } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("book_id", bookId)
      .is("user_id", null)
      .single();

    if (fetchError || !currentProgress) {
      return { success: false, error: "Book progress not found" };
    }

    const oldStatus = currentProgress.status as ReadingStatus;
    const now = new Date().toISOString();

    // Build the update object
    const updateObj: Record<string, any> = { status: newStatus };

    // Handle date_started
    if (newStatus === "reading" && oldStatus !== "reading") {
      updateObj.date_started = now;
    } else if (newStatus !== "reading" && oldStatus === "reading") {
      updateObj.date_started = null;
    }

    // Handle date_completed
    if (newStatus === "read" && oldStatus !== "read") {
      updateObj.date_completed = now;
    } else if (newStatus !== "read" && oldStatus === "read") {
      updateObj.date_completed = null;
    }

    // If changing to "reading", find any other "reading" book and change it to "not_started"
    if (newStatus === "reading" && oldStatus !== "reading") {
      const { data: otherReading } = await supabase
        .from("reading_progress")
        .select("book_id")
        .eq("status", "reading")
        .is("user_id", null)
        .neq("book_id", bookId)
        .single();

      if (otherReading) {
        const { error: updateError } = await supabase
          .from("reading_progress")
          .update({
            status: "not_started",
            date_started: null,
          })
          .eq("book_id", otherReading.book_id)
          .is("user_id", null);

        if (updateError) {
          return {
            success: false,
            error: `Failed to update previous reading book: ${updateError.message}`,
          };
        }
      }
    }

    // Update the target book
    const { error: updateError } = await supabase
      .from("reading_progress")
      .update(updateObj)
      .eq("book_id", bookId)
      .is("user_id", null);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
