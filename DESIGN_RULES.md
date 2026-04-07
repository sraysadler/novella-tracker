# Novella Tracker — Design Rules

## General
- Clean, readable, book-friendly aesthetic
- Warm neutral background (cream/off-white, not stark white)
- Dark text for readability
- Generous whitespace — this is a reading app, it should feel calm
- Mobile-first responsive design (will be used on phone frequently)

## Typography
- Use a clean serif or humanist sans-serif for book titles
- Body text: system font stack for performance
- Book titles should feel literary, not techy

## Colors
- Primary accent: a muted teal or deep blue-green
- Status colors:
  - Not started: neutral/gray
  - Currently reading: accent color (teal/blue-green)
  - Read: a warm gold or green checkmark
- Avoid bright primary colors — this is a literary app, not a dashboard

## Components
- Book cards should show status visually (color dot or icon, not just text)
- Progress bars should use the accent color
- Section headers should be clearly distinct from book entries
- Cluster vibe quotes should be styled as pull quotes (italic, slightly indented)
- Film adaptation indicator: small 🎬 icon next to title, not a separate field

## Layout
- Dashboard: single column, stacked cards
- Reading plan: sections as collapsible accordions
- Book detail: modal overlay on desktop, full page on mobile
