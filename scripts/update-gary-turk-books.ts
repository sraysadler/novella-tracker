/**
 * Targeted update — adds 4 new books and patches notes for 8 existing books
 * without clearing reading_progress.
 *
 * Usage:
 *   npx tsx scripts/update-gary-turk-books.ts
 */

import { createClient } from "@supabase/supabase-js";
import { resolve } from "path";
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

const supabase = createClient(supabaseUrl, serviceRoleKey);

const noteUpdates: { id: number; notes: string }[] = [
  {
    id: 1,
    notes:
      "Your starting point. A day laborer's life across the American West — love, loss, and ghosts. Pulitzer finalist. (via @gary_turk on Instagram)",
  },
  {
    id: 95,
    notes:
      'A fugitive on a deserted island falls in love with a woman who may not be real. Borges and Octavio Paz both called it "perfect." A beautiful, eerie precursor to virtual-reality fiction. The most literary read in this cluster. (via @gary_turk on Instagram)',
  },
  {
    id: 102,
    notes:
      "A man invisible to his wife — who can't remember they're married — has one cross-country flight to make her see him again. Whimsical, warm, and surprisingly moving. (via @gary_turk on Instagram)",
  },
  {
    id: 135,
    notes:
      "Most likely recent Booker-era riser. Contemplative novel set on the International Space Station, following six astronauts circling the planet. (via @gary_turk on Instagram)",
  },
];

const newBooks = [
  {
    id: 162,
    rank: null,
    title: "A Short Stay in Hell",
    author: "Steven L. Peck",
    year: 2012,
    pages: 120,
    notes:
      "A man dies and finds himself in a Borges-designed hell — an infinite library containing every book that could ever exist. To escape, he must find the single volume that holds his own life story. Strange, precise, and philosophically devastating. (via @gary_turk on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 163,
    rank: null,
    title: "I Who Have Never Known Men",
    author: "Jacqueline Harpman",
    year: 1995,
    pages: 183,
    notes:
      "Forty women imprisoned underground escape into a world emptied of all human life. The youngest — born in captivity — has never known the outside world. Desolate, spare, and quietly devastating. (via @gary_turk on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 164,
    rank: null,
    title: "Termush",
    author: "Sven Holm",
    year: 1967,
    pages: 127,
    notes:
      "Wealthy survivors shelter in a luxury coastal hotel after nuclear catastrophe, while the dying press against the gates outside. Management keeps the rules. Cold, precise, and prophetic about privilege under collapse. (via @gary_turk on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 165,
    rank: null,
    title: "Foster",
    author: "Claire Keegan",
    year: 2010,
    pages: 89,
    notes:
      "A young Irish girl spends the summer with a quiet, warm couple in rural Ireland. Something unspoken shadows their kindness. Spare, precise, and heartbreaking — Claire Keegan at her most distilled. (via @gary_turk on Instagram)",
    film_adaptation:
      "2022 Irish-language film The Quiet Girl (An Cailín Ciúin), directed by Colm Bairéad — the first Irish-language film nominated for the Academy Award for Best International Feature Film.",
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
];

async function run() {
  console.log("Patching notes for 4 existing books...");
  for (const { id, notes } of noteUpdates) {
    const { error } = await supabase.from("books").update({ notes }).eq("id", id);
    if (error) throw error;
    console.log(`  Updated id ${id}`);
  }

  console.log("\nInserting 4 new books...");
  const { error: insertError } = await supabase.from("books").insert(newBooks);
  if (insertError) throw insertError;
  console.log("  Inserted ids 162–165");

  console.log("\n✅ Done. reading_progress was not touched.");
}

run().catch((err) => {
  console.error("\n❌ Failed:", err.message ?? err);
  process.exit(1);
});
