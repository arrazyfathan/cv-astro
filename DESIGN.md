# Design System

## Direction

A warm technical portfolio inspired by a well-used field notebook and a precise mobile interface. The page is read by a hiring lead on a laptop in daylight, moving quickly between broad fit and implementation detail. The surface is light, tactile, and calm; signal orange marks decisions and actions.

## Color

- Canvas: warm off-white in low-chroma OKLCH.
- Ink: deep warm-charcoal for primary text and dark bands.
- Slate: muted cool-neutral for supporting copy and rules.
- Signal: orange is the only saturated accent and stays below roughly ten percent of the page.
- Paper: a slightly lighter warm neutral for inset surfaces.

## Typography

- Recursive Variable is the sole family.
- Proportional Sans axis for headings and body copy, with a modest Casual axis for warmth.
- Mono axis only for short metadata, dates, technology labels, and compact navigational details.
- Body copy stays between 65 and 75 characters per line with fluid heading sizes and strong weight contrast.

## Layout

- Wide editorial bands create five distinct homepage chapters without turning content into cards.
- The hero and featured projects use intentionally asymmetric grids.
- Project rows alternate their text structure; absent imagery removes the media column entirely.
- Spacing is fluid and varied, with tight metadata clusters and generous section transitions.
- Resume content remains constrained and optimized for print at `/resume/`.

## Components

- Text links use a visible underline or directional cue.
- Primary actions use signal orange; secondary actions use an ink outline.
- Technology tags are compact mono metadata, not decorative pills.
- Focus rings are high-contrast and offset from the component edge.
- Images, when present, use modest rounding and descriptive alternative text.

## Motion

- Use a short first-paint reveal and small transform-based hover cues.
- Respect `prefers-reduced-motion` by removing movement and smooth scrolling.
- Avoid motion that changes layout or delays access to content.
