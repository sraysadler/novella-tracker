# Novella Tracker — Design Rules

## General
- Clean, readable, book-friendly aesthetic
- Warm neutral background (`stone-50` cream/off-white, not stark white)
- Dark text for readability
- Generous whitespace — this is a reading app, it should feel calm
- Mobile-first responsive design (used on phone frequently)
- Full dark mode support — every component must include `dark:` Tailwind variants

## Typography
- Serif font for headings and book titles: Lora (`font-serif`, via `--font-lora` CSS variable)
- Body text: Geist Sans (system-style, set via `--font-geist-sans`)
- Mono: Geist Mono for code snippets (`--font-geist-mono`)
- Book titles should feel literary, not techy

## Colors
- Background: `stone-50` (light) / `stone-950` (dark)
- Border: `stone-200` (light) / `stone-800` (dark)
- Card surface: `white` (light) / `stone-900` (dark)
- Primary accent: teal — `teal-600` (light) / `teal-500` (dark)
- Status colors:
  - Not started: `stone-300` dot (light) / `stone-600` (dark)
  - Currently reading: `teal-500` dot
  - Read: `amber-400` dot
- Role badges: `red-900/80` bg for Admin, `blue-800/70` bg for Editor
- Avoid bright primary colors — this is a literary app, not a dashboard

## Components
- Book cards: status shown as a colored dot (not text label alone)
- Progress bars: teal accent color, `rounded-full`
- Section headers: clearly distinct from book entries (serif, bold)
- Cluster vibe quotes: styled as pull quotes (italic, slightly indented)
- Film adaptation indicator: small 🎬 icon next to the title, not a separate field
- Cover images: displayed where available (`cover_image_url`); no placeholder when absent

## Layout
- Max content width: `max-w-6xl mx-auto`
- Page padding: `px-4 sm:px-6 py-12 pb-32`
- Dashboard: single column, stacked cards
- Reading plan: sections as collapsible accordions
- Book detail: full page on all screen sizes
- Header: 3-column flex layout — logo (left) | search bar (center) | actions (right)
- Footer: centered text link, minimal
- Search bar: hidden on `/login` page
