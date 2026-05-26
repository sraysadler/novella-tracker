/**
 * Counts books in the database, broken down by rank status.
 *
 * Usage:
 *   npm run count-books
 */

import { createClient } from "@supabase/supabase-js";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const { count: total, error } = await supabase
  .from("books")
  .select("*", { count: "exact", head: true });

if (error) {
  console.error("Query failed:", error.message);
  process.exit(1);
}

const { count: ranked } = await supabase
  .from("books")
  .select("*", { count: "exact", head: true })
  .not("rank", "is", null);

const { count: extra } = await supabase
  .from("books")
  .select("*", { count: "exact", head: true })
  .is("rank", null);

console.log(`Total books:     ${total}`);
console.log(`On master list:  ${ranked}`);
console.log(`Extra/unranked:  ${extra}`);
