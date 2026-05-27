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
  // @zacareads attribution updates for existing books
  {
    id: 143,
    notes:
      "Strong recent critical riser. Cheeveresque story of a marriage told through omniscient back-and-forth narration that creates a lingering mood. (via @sunnysbooktruck on Instagram)",
  },
  {
    id: 114,
    notes:
      "Most likely future canon climber. Fictionalized accounts of 20th-century scientists exploring the darker implications of discovery — Haber, Heisenberg, Schrödinger. (via @zacareads on Instagram)",
  },
  {
    id: 162,
    notes:
      "A man dies and finds himself in a Borges-designed hell — an infinite library containing every book that could ever exist. To escape, he must find the single volume that holds his own life story. Strange, precise, and philosophically devastating. (via @gary_turk and @zacareads on Instagram)",
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
  {
    id: 166,
    rank: null,
    title: "The Tiny Wife",
    author: "Andrew Kaufman",
    year: 2011,
    pages: 80,
    notes:
      "A bank robber steals the most meaningful thing from each hostage — not their money, but a piece of their soul. One woman begins literally shrinking. Dark, whimsical, and weirder than it sounds. From the same author as All My Friends Are Superheroes. (via @gary_turk on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 167,
    rank: null,
    title: "The Man Who Planted Trees",
    author: "Jean Giono",
    year: 1953,
    pages: 50,
    notes:
      "Over four decades, a solitary shepherd silently replants a barren valley in Provence — one acorn at a time. Originally published as a short story, it reads like a parable. One of the most quietly hopeful pieces of fiction ever written. (via @gary_turk on Instagram)",
    film_adaptation: "1987 Oscar-winning animated short film directed by Frédéric Back.",
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 168,
    rank: null,
    title: "The Divine Farce",
    author: "Michael S. A. Graziano",
    year: 2017,
    pages: 192,
    notes:
      "A neuroscientist's dark comic novel about consciousness, death, and academia. Funny, unsettling, and stranger than its premise suggests — written by a Princeton professor who clearly enjoys breaking things. (via @gary_turk on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 169,
    rank: null,
    title: "Malagash",
    author: "Joey Comeau",
    year: 2017,
    pages: 168,
    notes:
      "A teenage girl whose father is dying of cancer decides to write a computer virus in his voice — to make him immortal, in the only way she knows how. Tender, strange, and unexpectedly moving. (via @gary_turk on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  // @zacareads books
  {
    id: 170,
    rank: null,
    title: "I'm Thinking of Ending Things",
    author: "Iain Reid",
    year: 2016,
    pages: 224,
    notes:
      "A woman on a long drive to meet her boyfriend's parents begins to doubt everything — their relationship, her memories, who she really is. Gets darker and stranger as it goes. One of those books that rewards knowing as little as possible going in. (via @zacareads on Instagram)",
    film_adaptation: "2020 Netflix film directed by Charlie Kaufman.",
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 171,
    rank: null,
    title: "It Lasts Forever and Then It's Over",
    author: "Anne de Marcken",
    year: 2023,
    pages: 128,
    notes:
      "A woman and her dog wander through the afterlife. Spare, dreamlike, and quietly profound — a meditation on consciousness, attachment, and what persists after death. (via @zacareads on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 172,
    rank: null,
    title: "The Lathe of Heaven",
    author: "Ursula K. Le Guin",
    year: 1971,
    pages: 184,
    notes:
      "A man in near-future Portland discovers his dreams literally change reality. His psychiatrist sees an opportunity to fix the world — one dream at a time. A Le Guin classic about power, utopia, and the catastrophic weight of good intentions. (via @zacareads on Instagram)",
    film_adaptation: "1980 PBS TV movie; 2002 A&E adaptation.",
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 173,
    rank: null,
    title: "Annihilation",
    author: "Jeff VanderMeer",
    year: 2014,
    pages: 195,
    notes:
      "Four unnamed women enter Area X — a quarantined wilderness where eleven previous expeditions met disturbing ends. Eerie, paranoid, and beautifully unresolved. The first book of the Southern Reach trilogy. (via @zacareads on Instagram)",
    film_adaptation: "2018 film directed by Alex Garland, starring Natalie Portman.",
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 174,
    rank: null,
    title: "Die, My Love",
    author: "Ariana Harwicz",
    year: 2017,
    pages: 128,
    notes:
      "A woman in rural France unravels after childbirth — with desire, violence, and a language that burns. Translated from Spanish. Raw, incantatory, and unlike anything else. (via @zacareads on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 175,
    rank: null,
    title: "Coup de Grâce",
    author: "Sofia Ajram",
    year: 2024,
    pages: 160,
    notes:
      "A debut novella about mortality, care, and the intimacy of dying — told with an unsettling precision. Quiet and relentless. (via @zacareads on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 176,
    rank: null,
    title: "The Deep",
    author: "Rivers Solomon, with Daveed Diggs, William Hutson, and Jonathan Snipes",
    year: 2019,
    pages: 160,
    notes:
      "The descendants of African women thrown overboard during the Middle Passage have evolved into an underwater civilization. Expanded from the song by clipping. — a novella about inherited trauma, memory, and what we owe the dead. (via @zacareads on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 177,
    rank: null,
    title: "Moon of the Crusted Snow",
    author: "Waubgeshig Rice",
    year: 2018,
    pages: 213,
    notes:
      "An Anishinaabe community in northern Ontario loses contact with the outside world as power and communications fail. A First Nations post-apocalyptic novel — quiet, communal, and rooted in a sense of place and survival that most apocalypse fiction misses entirely. (via @zacareads on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  // @sunnysbooktruck books
  {
    id: 178,
    rank: null,
    title: "On the Clock",
    author: "Claire Baglin",
    year: 2022,
    pages: 120,
    notes:
      "A young woman works numbing shifts at a fast-food restaurant while memories of her working-class childhood and her father surface between orders. A debut novella about labor, class, and the body — translated from French. (via @sunnysbooktruck on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 179,
    rank: null,
    title: "City of Rats",
    author: "Copi",
    year: 1979,
    pages: 112,
    notes:
      "A surrealist plague-city overrun by rats, written by the Argentine-French playwright and cartoonist Copi. Absurd, feverish, and wickedly funny — the kind of novella that could only have been written in 1970s Paris. (via @sunnysbooktruck on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 180,
    rank: null,
    title: "Role Play",
    author: "Clara Drummond",
    year: 2022,
    pages: 144,
    notes:
      "A Brazilian novella exploring identity, desire, and the blurry lines between performance and self. Sharp, unsettling, and difficult to put down. (via @sunnysbooktruck on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 181,
    rank: null,
    title: "Lithium",
    author: "Denis",
    year: 2023,
    pages: 128,
    notes:
      "A compact, charged novella that moves between mental health, dependency, and the texture of daily life under pharmaceutical management. Spare and unflinching. (via @sunnysbooktruck on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 182,
    rank: null,
    title: "The Dry Heart",
    author: "Natalia Ginzburg",
    year: 1947,
    pages: 96,
    notes:
      "A woman shoots her husband on the first page. The rest of the book is her explanation. A masterpiece of compressed fury — Ginzburg strips a marriage down to its bones in fewer than 100 pages. (via @sunnysbooktruck on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 183,
    rank: null,
    title: "Paradáis",
    author: "Fernanda Melchor",
    year: 2021,
    pages: 128,
    notes:
      "Two teenagers — an isolated, overweight boy and an older, reckless girl — orbit each other in the grounds of a walled luxury complex in Mexico. Dark, violent, and stylistically relentless. From the author of Hurricane Season. (via @sunnysbooktruck on Instagram)",
    film_adaptation: null,
    section_type: null,
    section_name: null,
    section_order: null,
    section_subtitle: null,
    cluster_vibe: null,
    order_in_section: null,
  },
  {
    id: 184,
    rank: null,
    title: "The Employees",
    author: "Olga Ravn",
    year: 2018,
    pages: 160,
    notes:
      "On a spaceship, human and humanoid employees file committee statements about their work and their attachment to objects collected from a strange new world. A meditation on labor, longing, and what it means to be alive. Shortlisted for the International Booker Prize. (via @sunnysbooktruck on Instagram)",
    film_adaptation: null,
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
  const { error: insertError } = await supabase.from("books").upsert(newBooks, { onConflict: "id" });
  if (insertError) throw insertError;
  console.log("  Inserted ids 162–184 (excluding 114, 143, and 162, which were note-patched above)");

  console.log("\n✅ Done. reading_progress was not touched.");
}

run().catch((err) => {
  console.error("\n❌ Failed:", err.message ?? err);
  process.exit(1);
});
