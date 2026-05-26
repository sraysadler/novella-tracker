/**
 * Seed script — adds the "Best Contemporary Novels Under 200 Pages" section.
 *
 * Safe to run against a live database: it upserts new books and
 * book_sections without touching existing reading_progress records.
 *
 * Prerequisites:
 *   1. Run migration 009_add_list_section_type.sql in Supabase first.
 *   2. Have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 *
 * Usage:
 *   npx tsx scripts/seed-contemporary.ts
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
      "Add them to .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const SECTION_NAME = "Best Contemporary Novels Under 200 Pages";
const SECTION_SUBTITLE = "Via Literary Hub — ranked by consensus";
const SECTION_ORDER = 15;

// ---------------------------------------------------------------------------
// Update id:101 (Small Things Like These) to join the contemporary section
// ---------------------------------------------------------------------------
async function updateSmallThings() {
  const { error } = await supabase
    .from("books")
    .update({
      section_type: "list",
      section_name: SECTION_NAME,
      section_order: SECTION_ORDER,
      section_subtitle: SECTION_SUBTITLE,
      order_in_section: 28,
      cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2021/06/713Rnb1Ib7S-214x300.jpg",
    })
    .eq("id", 101);
  if (error) throw error;
  console.log("  Updated id:101 (Small Things Like These)");
}

// ---------------------------------------------------------------------------
// New books (ids 104-161)
// ---------------------------------------------------------------------------
const newBooks = [
  { id: 104, rank: null, title: "Sula", author: "Toni Morrison", year: 1973, pages: 192, notes: "Most canonical modern literary work on this list. An enduring female friendship and rivalry in Ohio's Bottom, showcasing the full complexity of female characters.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 1, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2018/03/sula-1-195x300.jpg" },
  { id: 105, rank: null, title: "Invisible Cities", author: "Italo Calvino", year: 1972, pages: 165, notes: "Most influential on writers and intellectual culture. Postmodern classic framed as Marco Polo describing imaginary cities to Kublai Khan — gorgeous, complex, esoteric.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 2, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2016/11/invisible-cities-by-italo-calvino-193x300.jpg" },
  { id: 106, rank: null, title: "The Vegetarian", author: "Han Kang", year: 2007, pages: 188, notes: "Biggest global literary crossover. A woman's decision to stop eating meat spirals into deeper withdrawal from the world, exploring bodily autonomy and transformation.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 5, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2017/06/The_vegetarian_-_han_kang-198x300.jpg" },
  { id: 107, rank: null, title: "Autobiography of Red", author: "Anne Carson", year: 1998, pages: 149, notes: "Most formally innovative. Novel in verse retelling a Greek myth, erasing the rules about what novels can be through innovative form.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 6, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2018/03/Autobiography-of-Red-195x300.jpg" },
  { id: 108, rank: null, title: "The Sense of an Ending", author: "Julian Barnes", year: 2011, pages: 163, notes: "Most elegantly constructed. Man Booker Prize winner exploring memory, aging, and what constitutes a good life through melancholic reflection.", film_adaptation: "2017 film directed by Ritesh Batra, starring Jim Broadbent and Charlotte Rampling.", section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 9, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2017/02/sense-of-an-ending-cover2-198x300.jpg" },
  { id: 109, rank: null, title: "Convenience Store Woman", author: "Sayaka Murata", year: 2016, pages: 176, notes: "Best entry point for contemporary literary fiction. Dry, funny novel about a woman devoted to her convenience store job, blending love story and psychological thriller.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 10, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2018/06/Sayaka-Murata-Convenience-Store-Woman-222x300.jpg" },
  { id: 110, rank: null, title: "A Pale View of Hills", author: "Kazuo Ishiguro", year: 1982, pages: 192, notes: "Quietly one of the most psychologically sophisticated. Beautiful, subtle debut narrated through the recollections of an aging Japanese woman living in England.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 11, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/81YE47yfEuL-195x300.jpg" },
  { id: 111, rank: null, title: "The Days of Abandonment", author: "Elena Ferrante", year: 2002, pages: 188, notes: "Most emotionally devastating. A woman unravels after being abandoned — her editor calls it the real Ferrante, the true masterpiece.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 12, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2017/06/elena-ferrante-the-days-of-abandonment-193x300.jpg" },
  { id: 112, rank: null, title: "Speedboat", author: "Renata Adler", year: 1976, pages: 193, notes: "Biggest writer-cult reputation. Discursive novel about New York and an elliptical mind — witty, singular, a bible for certain readers.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 13, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/03/81nklLnzhL-188x300.jpg" },
  { id: 113, rank: null, title: "Leaving the Atocha Station", author: "Ben Lerner", year: 2011, pages: 181, notes: "Definitive millennial intellectual novel. A poet in Madrid not writing poetry — one of the most subtly hilarious novels with propulsive energy.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 14, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2015/07/Leaving-the-Atocha-Station-by-Ben-Lerner--200x300.jpg" },
  { id: 114, rank: null, title: "When We Cease to Understand the World", author: "Benjamín Labatut", year: 2020, pages: 192, notes: "Most likely future canon climber. Fictionalized accounts of 20th-century scientists exploring the darker implications of discovery — Haber, Heisenberg, Schrödinger.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 15, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2021/07/9781681375663-194x300.jpg" },
  { id: 115, rank: null, title: "The Loser", author: "Thomas Bernhard", year: 1983, pages: 190, notes: "Most admired monologue form. Possibly the best ill-tempered monologue in contemporary literature, exploring failure and obsession with Glenn Gould.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 16, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2015/08/theloser-194x300.jpg" },
  { id: 116, rank: null, title: "So Long, See You Tomorrow", author: "William Maxwell", year: 1980, pages: 145, notes: "Pure literary craftsmanship. Slim autobiographical novel by the New Yorker's longtime fiction editor — winner of the 1982 National Book Award.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 17, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/so-long-see-you-tomorrow-188x300.jpg" },
  { id: 117, rank: null, title: "Fever Dream", author: "Samanta Schweblin", year: 2014, pages: 189, notes: "Best literary horror blend. Unsettling narrative about obsession and motherhood, centered around environmental poisoning and a child's fate.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 18, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2017/01/fever-dream-212x300.jpg" },
  { id: 118, rank: null, title: "The Mezzanine", author: "Nicholson Baker", year: 1988, pages: 145, notes: "Best extreme-observation novel. Hilarious, cerebral debut set over a single escalator ride, containing multitudes of observations and cultural criticism.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 19, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2015/06/the-mezzanine-180x300.png" },
  { id: 119, rank: null, title: "Minor Detail", author: "Adania Shibli", year: 2017, pages: 105, notes: "Politically and formally severe. Two-part novella covering a 1949 atrocity and a modern search for answers — a haunting, spare work.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 21, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/minor-detail-187x300.jpg" },
  { id: 120, rank: null, title: "Ghost Wall", author: "Sarah Moss", year: 2018, pages: 144, notes: "Most tension per page. Teenager Silvie endures a forced Iron Age reenactment in rural England led by her domineering father, building toward horror.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 22, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2019/01/ghost-wall-240x300.jpg" },
  { id: 121, rank: null, title: "Signs Preceding the End of the World", author: "Yuri Herrera", year: 2009, pages: 128, notes: "Most linguistically compressed. Fable-like narrative about crossing the Mexico-US border, exploring the borders between worlds, words, and people.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 23, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2018/06/Signs-Preceding-the-End-of-the-World_CMYK-SMALL-300x460-196x300-196x300.jpg" },
  { id: 122, rank: null, title: "Lucy", author: "Jamaica Kincaid", year: 1990, pages: 164, notes: "Sharpest voice. Semi-autobiographical coming-of-age story about a West Indian teenager working as an au pair in the US, discovering independence.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 24, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/kincaid-lucy-195x300.jpg" },
  { id: 123, rank: null, title: "The Buddha in the Attic", author: "Julie Otsuka", year: 2011, pages: 144, notes: "Best collective narration. Uses collective first-person narration to tell the story of Japanese picture brides arriving in California.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 25, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2019/11/Screen-Shot-2019-11-13-at-9.09.43-PM-207x300.png" },
  { id: 124, rank: null, title: "Desperate Characters", author: "Paula Fox", year: 1970, pages: 180, notes: "Most underrated near-classic. All-time favorite about a woman who may or may not have rabies — a quietly devastating 1970 novel.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 26, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/04/819V9nw2S9L-200x300.jpg" },
  { id: 125, rank: null, title: "Open Water", author: "Caleb Azumah Nelson", year: 2021, pages: 160, notes: "Strongest recent lyrical debut. Debut about two Black artists in love, using sensual prose and daring second-person to explore race and masculinity.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 27, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2021/04/open-water_caleb-azumah-nelson-194x300.jpg" },
  { id: 126, rank: null, title: "Near to the Wild Heart", author: "Clarice Lispector", year: 1943, pages: 194, notes: "Most intimidating masterpiece. Lispector's debut follows Joana's life through sentences sometimes inscrutable, sometimes wild, sometimes transcendent.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 29, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2018/06/Near-to-the-Wild-Heart-196x300.jpg" },
  { id: 127, rank: null, title: "Sweet Days of Discipline", author: "Fleur Jaeggy", year: 1989, pages: 101, notes: "Coldest emotional atmosphere. An actually perfect novel set in a boarding school where the narrator becomes obsessed with the mysterious new girl Frédérique.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 30, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2019/07/Fleur_J_Sweet_Days_lithub6-206x300.jpg" },
  { id: 128, rank: null, title: "Old School", author: "Tobias Wolff", year: 2003, pages: 195, notes: "Best campus novel here. An unnamed senior at an unnamed boarding school explores literary ambition — the perfect campus novel.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 32, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2018/08/Old-School-Tobias-Wolff-201x300.jpg" },
  { id: 129, rank: null, title: "Visitation", author: "Jenny Erpenbeck", year: 2008, pages: 150, notes: "Best historical compression. Elegiac novel about a house on a Berlin lake as both character and witness across sweeping historical time periods.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 33, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2017/01/Visitation-196x300.jpg" },
  { id: 130, rank: null, title: "At Night All Blood is Black", author: "David Diop", year: 2018, pages: 160, notes: "Most feverish war novel. 2021 International Booker Prize winner — a Senegalese WWI soldier descends into murderous madness after battlefield trauma.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 34, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/07/91TtBC3TxVL-200x300.jpg" },
  { id: 131, rank: null, title: "What Belongs to You", author: "Garth Greenwell", year: 2016, pages: 191, notes: "Most intimate psychological realism. A mesmerizing debut exploring complex desire and relationships in Sofia, Bulgaria.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 35, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2016/12/what-belongs-to-you-garth-greenwell-1-200x300.jpg" },
  { id: 132, rank: null, title: "Assembly", author: "Natasha Brown", year: 2021, pages: 112, notes: "Most efficient social critique. A Black British finance executive with untreated cancer attends a family garden party — sparse, searing debut.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 36, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2021/09/Assembly-Natasha-Brown-214x300.jpeg" },
  { id: 133, rank: null, title: "The Bookshop", author: "Penelope Fitzgerald", year: 1978, pages: 118, notes: "Most quietly perfect. A perfect jewel of a novel about a woman opening a bookstore in Suffolk, ultimately evicted by the local bigwig.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 37, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2018/05/The-Bookshop-Penelope-Fitzgerald-197x300.jpg" },
  { id: 134, rank: null, title: "Winter in the Blood", author: "James Welch", year: 1974, pages: 160, notes: "Foundational Native literary work. Debut about an unnamed Montana narrator seeking connection to his tribe, history, and fractured family amid disaffection.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 39, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/71I7UFpHgSL-196x300.jpg" },
  { id: 135, rank: null, title: "Orbital", author: "Samantha Harvey", year: 2023, pages: 136, notes: "Most likely recent Booker-era riser. Contemplative novel set on the International Space Station, following six astronauts circling the planet.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 40, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2023/11/OrbitalHC-1-340x509-1-200x300.png" },
  { id: 136, rank: null, title: "The Passion", author: "Jeanette Winterson", year: 1987, pages: 160, notes: "Most playful literary fantasy. Sly historical fairy tale featuring a web-footed Venetian pickpocket and a soldier's quest.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 41, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2017/06/jeanette-winterson-203x300.jpg" },
  { id: 137, rank: null, title: "The English Understand Wool", author: "Helen DeWitt", year: 2022, pages: 64, notes: "Best miniature satire. Sly, delightful novella satirizing taste and manners with a distinctive heroine's voice.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 43, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2022/01/Screen-Shot-2022-01-03-at-10.39.13-AM-216x300.png" },
  { id: 138, rank: null, title: "The Witch", author: "Marie NDiaye", year: 1996, pages: 144, notes: "Most unsettling domestic surrealism. A mother initiates her daughters into witchcraft, but the girls are unimpressed as family dynamics unravel.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 44, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2026/03/the-witch-195x300.jpg" },
  { id: 139, rank: null, title: "Mariette in Ecstasy", author: "Ron Hansen", year: 1991, pages: 192, notes: "Most spiritually ambiguous. Gorgeous, precise novel set in a 1906 Roman Catholic convent with exquisite language in service of an elusive subject.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 46, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/MARIETTE-204x300.jpg" },
  { id: 140, rank: null, title: "Never Mind", author: "Edward St. Aubyn", year: 1992, pages: 197, notes: "Harshest upper-class dismantling. A harrowing work of genius — the entry point into St. Aubyn's Patrick Melrose series.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 47, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/86a091525785ce5ee5d2604bedc873e0-198x300.jpg" },
  { id: 141, rank: null, title: "Faces in the Crowd", author: "Valeria Luiselli", year: 2011, pages: 162, notes: "Most literary self-reflection. Fresh, compelling debut about a young translator with a doubled-back perspective on artistic identity.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 48, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2017/01/Faces-in-the-Crowd1-186x300.jpg" },
  { id: 142, rank: null, title: "Perfection", author: "Vincenzo Latronico", year: 2022, pages: 136, notes: "Best internet-age alienation. Contemporary update of Perec's Things, following digital nomads in Berlin navigating internet-driven identities.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 49, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2025/12/Perfection-by-Vincenzo-Latronico-copy-203x300.jpg" },
  { id: 143, rank: null, title: "The Most", author: "Jessica Anthony", year: 2024, pages: 144, notes: "Strong recent critical riser. Cheeveresque story of a marriage told through omniscient back-and-forth narration that creates a lingering mood.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 51, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2024/05/91FCIbiPjCL._SL1500_-200x300.jpg" },
  { id: 144, rank: null, title: "Why Did I Ever", author: "Mary Robison", year: 2001, pages: 200, notes: "Fragmentation pushed furthest. Fragment novel following Money Breton, a script doctor and mother with obsessive tendencies. Funny, irreverent, and weirdly moving.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 52, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2018/08/Why-Did-I-Ever-Mary-Robison-187x300.jpg" },
  { id: 145, rank: null, title: "Elect Mr. Robinson for a Better World", author: "Donald Antrim", year: 1993, pages: 164, notes: "Most anarchic satire. Surreal suburban nightmare about a town descending into madness and a teacher attempting restoration through suspect methods.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 53, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/03/81o0p3YWFHL-200x300.jpg" },
  { id: 146, rank: null, title: "Treasure Island!!!", author: "Sara Levine", year: 2011, pages: 172, notes: "Most unhinged comic voice. A truly insane novel about a woman who decides to live by Robert Louis Stevenson's principles of boldness and independence.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 54, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/71Kvk-WpQL-197x300.jpg" },
  { id: 147, rank: null, title: "Sylvia", author: "Leonard Michaels", year: 1992, pages: 123, notes: "Most emotionally raw memoir-fiction. Autobiographical novel recounting the author's marriage to the abnormally bright but depressed Sylvia Bloch, told in matter-of-fact prose.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 55, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/71rxguBnJ6L-194x300.jpg" },
  { id: 148, rank: null, title: "Such Small Hands", author: "Andrés Barba", year: 2008, pages: 94, notes: "Most claustrophobic. A vicious little book about an orphaned girl — language like walls closing in.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 56, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2017/04/smallhands_online-197x300.png" },
  { id: 149, rank: null, title: "Ghosts", author: "César Aira", year: 1990, pages: 141, notes: "Purest Aira entry. A builder's family squats in an unfinished apartment building populated by visible ghosts in this playful, imaginative work.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 57, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/01/Ghosts-214x300.jpg" },
  { id: 150, rank: null, title: "On the Calculation of Volume (Book I)", author: "Solvej Balle", year: 2021, pages: 176, notes: "Highest future-upside reputation. First volume of a celebrated Danish septology — a woman unable to escape November 18th, a meditation on consciousness.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 58, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2024/12/51gj7w1LtAL._SL1200_-188x300.jpg" },
  { id: 151, rank: null, title: "Machine", author: "Susan Steinberg", year: 2015, pages: 149, notes: "Most under-read experimental work. Elliptical novel about a tragic summer involving a drowning — an undersung work deserving modern classic status.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 59, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2019/08/9781555978471-200x300.jpg" },
  { id: 152, rank: null, title: "The Orange Eats Creeps", author: "Grace Krilanovich", year: 2010, pages: 172, notes: "Most punk-energy book. Rule-breaking, weird punk novel — a careening, side-elbowing nightmare everyone should read.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 60, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/the-orange-eats-creeps-2-214x300.jpg" },
  { id: 153, rank: null, title: "Killing Stella", author: "Marlen Haushofer", year: 1958, pages: 80, notes: "Sharpest knife-edge novella. A brutal little novella exploring domesticity and silence — quick and sharp as a kitchen knife.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 61, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2025/06/9780811238656-194x300.jpg" },
  { id: 154, rank: null, title: "Mapping the Interior", author: "Stephen Graham Jones", year: 2017, pages: 112, notes: "Strongest genre-horror entry. Coming-of-age horror story about menace, memory, and hope from a prolific genre-manipulating writer.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 62, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/61OH30YYscL-188x300.jpg" },
  { id: 155, rank: null, title: "In the Cut", author: "Susanna Moore", year: 1995, pages: 179, notes: "Most psychologically dangerous. Dark psychological novel capturing a range of emotions and impulses rarely committed to paper.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 64, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/41GMMX644JL-204x300.jpg" },
  { id: 156, rank: null, title: "Saint Sebastian's Abyss", author: "Mark Haber", year: 2022, pages: 160, notes: "Most Bernhard-adjacent. A novel of obsession and art — a narrator travels to his rival's deathbed, told through circuitous, hilarious prose.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 65, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2022/06/Saint-Sebastians-Abyss-194x300.jpg" },
  { id: 157, rank: null, title: "Transcription", author: "Ben Lerner", year: 2023, pages: 144, notes: "Most essayistic. A poetic, genre-less meditation on mortality, technology, and truth.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 66, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2025/12/Ben-Lerner-Transcription-196x300.jpg" },
  { id: 158, rank: null, title: "Ring Shout", author: "P. Djèlí Clark", year: 2020, pages: 192, notes: "Most conceptually entertaining. Horror reimagining where The Birth of a Nation functions as a spell summoning literal Ku Klux demons.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 67, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2024/10/ring-shout-185x300.jpg" },
  { id: 159, rank: null, title: "Margaret the First", author: "Danielle Dutton", year: 2016, pages: 160, notes: "Most niche-literary admired. First-person account of 17th-century writer Margaret Cavendish — a glinting dagger of a novel.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 68, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2016/11/Margaret-the-First-200x300.jpg" },
  { id: 160, rank: null, title: "Slowness", author: "Milan Kundera", year: 1995, pages: 176, notes: "Lesser Kundera, still substantial. Metafictional meditation on modernity, memory, and performance in contemporary life.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 69, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/05/51z3yNt4UcL-199x300.jpg" },
  { id: 161, rank: null, title: "Hôtel Splendid", author: "Marie Redonnet", year: 1986, pages: 113, notes: "Most likely to split readers hard. Weird, charming novel about three sisters maintaining a hotel determined to sink — part of a loose trilogy.", film_adaptation: null, section_type: "list", section_name: SECTION_NAME, section_order: SECTION_ORDER, section_subtitle: SECTION_SUBTITLE, cluster_vibe: null, order_in_section: 70, cover_image_url: "https://s26162.pcdn.co/wp-content/uploads/2020/04/71b0hVgcJJL-191x300.jpg" },
];

// ---------------------------------------------------------------------------
// New book_sections for existing books already in the DB
// book_id -> their HTML rank position in the contemporary list
// ---------------------------------------------------------------------------
const newBookSections = [
  { book_id: 1,  section_order: SECTION_ORDER, order_in_section: 3  }, // Train Dreams
  { book_id: 52, section_order: SECTION_ORDER, order_in_section: 4  }, // The House on Mango Street
  { book_id: 41, section_order: SECTION_ORDER, order_in_section: 7  }, // The Lover
  { book_id: 84, section_order: SECTION_ORDER, order_in_section: 8  }, // Dept. of Speculation
  { book_id: 83, section_order: SECTION_ORDER, order_in_section: 20 }, // Grief Is the Thing with Feathers
  { book_id: 54, section_order: SECTION_ORDER, order_in_section: 31 }, // We the Animals
  { book_id: 85, section_order: SECTION_ORDER, order_in_section: 38 }, // Mrs. Caliban
  { book_id: 82, section_order: SECTION_ORDER, order_in_section: 42 }, // Who Will Run the Frog Hospital?
  { book_id: 92, section_order: SECTION_ORDER, order_in_section: 45 }, // Binti
  { book_id: 69, section_order: SECTION_ORDER, order_in_section: 50 }, // Point Omega
  { book_id: 72, section_order: SECTION_ORDER, order_in_section: 63 }, // McGlue
];

async function seed() {
  console.log("🌱 Seeding contemporary section...\n");

  // Update Small Things Like These primary section
  await updateSmallThings();

  // Upsert 58 new books
  console.log(`  Inserting ${newBooks.length} new books...`);
  for (let i = 0; i < newBooks.length; i += 50) {
    const batch = newBooks.slice(i, i + 50);
    const { error } = await supabase
      .from("books")
      .upsert(batch, { onConflict: "id" });
    if (error) throw error;
  }

  // Clear any existing section_order=15 book_sections then reinsert
  console.log("  Clearing existing section_order=15 book_sections...");
  const { error: deleteError } = await supabase
    .from("book_sections")
    .delete()
    .eq("section_order", SECTION_ORDER);
  if (deleteError) throw deleteError;

  console.log(`  Inserting ${newBookSections.length} book_sections rows...`);
  const { error: sectionsError } = await supabase
    .from("book_sections")
    .insert(newBookSections);
  if (sectionsError) throw sectionsError;

  // Summary
  const { count: bookCount } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true });
  const { count: sectionsCount } = await supabase
    .from("book_sections")
    .select("*", { count: "exact", head: true });

  console.log(`\n✅ Done:`);
  console.log(`   books total         → ${bookCount} rows`);
  console.log(`   book_sections total → ${sectionsCount} rows`);
}

seed().catch((err) => {
  console.error("\n❌ Failed:", err.message ?? err);
  process.exit(1);
});
