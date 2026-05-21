"use server";

import { createClient } from "@/lib/supabase/server";
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

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Fetch current progress to know what we're changing from (may not exist yet)
    const { data: currentProgress } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("book_id", bookId)
      .eq("user_id", user.id)
      .single();

    const oldStatus = (currentProgress?.status ?? "not_started") as ReadingStatus;
    const now = new Date().toISOString();

    // Build the upsert object
    const upsertObj: Record<string, unknown> = {
      book_id: bookId,
      user_id: user.id,
      status: newStatus,
    };

    // Handle date_started
    if (newStatus === "reading" && oldStatus !== "reading") {
      upsertObj.date_started = now;
    } else if (newStatus !== "reading" && oldStatus === "reading") {
      upsertObj.date_started = null;
    } else {
      upsertObj.date_started = currentProgress?.date_started ?? null;
    }

    // Handle date_completed
    if (newStatus === "read" && oldStatus !== "read") {
      upsertObj.date_completed = now;
    } else if (newStatus !== "read" && oldStatus === "read") {
      upsertObj.date_completed = null;
    } else {
      upsertObj.date_completed = currentProgress?.date_completed ?? null;
    }

    // If changing to "reading", find any other "reading" book and change it to "not_started"
    if (newStatus === "reading" && oldStatus !== "reading") {
      const { data: otherReading } = await supabase
        .from("reading_progress")
        .select("book_id")
        .eq("status", "reading")
        .eq("user_id", user.id)
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
          .eq("user_id", user.id);

        if (updateError) {
          return {
            success: false,
            error: `Failed to update previous reading book: ${updateError.message}`,
          };
        }
      }
    }

    // Upsert — creates the row if it doesn't exist yet
    const { error: upsertError } = await supabase
      .from("reading_progress")
      .upsert(upsertObj, { onConflict: "user_id,book_id" });

    if (upsertError) {
      console.error("Status update error:", upsertError);
      return { success: false, error: upsertError.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
