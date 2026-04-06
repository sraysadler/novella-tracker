/**
 * Seed script — populates `books` and `reading_progress` from the
 * JSON files in data/.
 *
 * Usage (requires ts-node or tsx):
 *   npx tsx scripts/seed.ts
 *
 * Requires in .env.local (or environment):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   ← service role, NOT the anon key
 *
 * The script is idempotent: it clears reading_progress then books
 * before reinserting, so it is safe to re-run.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// ---------------------------------------------------------------------------
// Bootstrap env from .env.local if running outside Next.js
// ---------------------------------------------------------------------------
import { config } from "dotenv";
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Add them to .env.local (see .env.local.example)."
  );
  process.exit(1);
}

// Service role bypasses RLS — required for the initial seed insert.
const supabase = createClient(supabaseUrl, serviceRoleKey);

// ---------------------------------------------------------------------------
// Load seed data
// ---------------------------------------------------------------------------
const books = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/books.json"), "utf-8")
);

const progressRows = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/initial_progress.json"), "utf-8")
).map((row: { book_id: number; status: string; date_started: string | null; date_completed: string | null }) => ({
  ...row,
  user_id: null, // MVP: no auth yet
}));

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
async function seed() {
  console.log("🌱 Starting seed...\n");

  // Clear in dependency order (progress first, then books)
  console.log("  Clearing reading_progress...");
  const { error: clearProgressError } = await supabase
    .from("reading_progress")
    .delete()
    .neq("id", 0); // delete all rows
  if (clearProgressError) throw clearProgressError;

  console.log("  Clearing books...");
  const { error: clearBooksError } = await supabase
    .from("books")
    .delete()
    .neq("id", 0);
  if (clearBooksError) throw clearBooksError;

  // Insert books in batches of 50
  console.log(`  Inserting ${books.length} books...`);
  for (let i = 0; i < books.length; i += 50) {
    const batch = books.slice(i, i + 50);
    const { error } = await supabase.from("books").insert(batch);
    if (error) throw error;
  }

  // Insert reading_progress in batches of 50
  console.log(`  Inserting ${progressRows.length} reading_progress rows...`);
  for (let i = 0; i < progressRows.length; i += 50) {
    const batch = progressRows.slice(i, i + 50);
    const { error } = await supabase.from("reading_progress").insert(batch);
    if (error) throw error;
  }

  // Verify
  const { count: bookCount } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true });

  const { count: progressCount } = await supabase
    .from("reading_progress")
    .select("*", { count: "exact", head: true });

  console.log(`\n✅ Seed complete:`);
  console.log(`   books             → ${bookCount} rows`);
  console.log(`   reading_progress  → ${progressCount} rows`);
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err.message ?? err);
  process.exit(1);
});
