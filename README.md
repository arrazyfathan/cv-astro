# Astro CV

A fast, static, print-friendly CV website built with Astro, TypeScript, and Tailwind CSS. The resume content is driven by a single JSON file, so the site can be updated without changing component markup.

Inspired by [Bartosz Jarocki's CV project](https://github.com/BartoszJarocki/cv).

## Features

- Static Astro site with minimal client-side JavaScript.
- TypeScript resume data contract in `src/data/resume.ts`.
- Resume content managed from `src/data/resume.json`.
- JSON resume endpoint at `/resume.json`.
- Responsive layout optimized for desktop, mobile, and print.
- Lightweight command menu available with `Cmd+J` on macOS or `Ctrl+J` elsewhere.
- Quick actions for downloading a generated PDF and opening configured social links.
- SEO, Open Graph, Twitter card, favicon, and analytics tags in the shared layout.
- Ready for static hosting on Cloudflare Pages or any host that can serve the `dist` directory.

## Tech Stack

- [Astro](https://astro.build/) for static site generation.
- [TypeScript](https://www.typescriptlang.org/) for typed data and components.
- [Tailwind CSS](https://tailwindcss.com/) through the Vite plugin.

## Project Structure

```text
.
|-- public/
|   |-- _headers
|   |-- apple-icon.png
|   |-- favicon.ico
|   |-- icon.png
|   |-- opengraph-image.jpg
|   `-- profile-image.jpg
|-- src/
|   |-- components/
|   |   |-- Badge.astro
|   |   |-- CommandMenu.astro
|   |   |-- Education.astro
|   |   |-- Header.astro
|   |   |-- Icon.astro
|   |   |-- Projects.astro
|   |   |-- Section.astro
|   |   |-- Skills.astro
|   |   |-- Summary.astro
|   |   `-- WorkExperience.astro
|   |-- data/
|   |   |-- resume.json
|   |   `-- resume.ts
|   |-- layouts/BaseLayout.astro
|   |-- pages/
|   |   |-- index.astro
|   |   `-- resume.json.ts
|   `-- styles/global.css
|-- astro.config.mjs
|-- package.json
|-- package-lock.json
`-- tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18.17 or newer.
- npm.

### Install Dependencies

```bash
npm install
```

### Start Local Development

```bash
npm run dev
```

Astro starts a local development server, usually at `http://localhost:4321`.

### Validate the Project

```bash
npm run check
```

This runs Astro's TypeScript and content checks.

### Build for Production

```bash
npm run build
```

The build command runs `astro check` first and then generates the static site in `dist/`.

### Preview the Production Build

```bash
npm run preview
```

Use this after `npm run build` to inspect the generated site locally.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Astro development server with telemetry disabled. |
| `npm run check` | Run Astro checks. |
| `npm run build` | Check and build the static site into `dist/`. |
| `npm run preview` | Serve the built site locally for production preview. |

## Editing Resume Content

Most content changes should be made in `src/data/resume.json`. The JSON is imported by `src/data/resume.ts`, which defines the expected shape through the `ResumeData` interface.

### Top-Level Fields

| Field | Purpose |
| --- | --- |
| `name` | Full name displayed in the header and page title. |
| `initials` | Initials used as a fallback visual identity. |
| `location` | Human-readable location text. |
| `locationLink` | Link opened from the location element. |
| `about` | Short professional title shown near the name. |
| `description` | SEO/Open Graph description. |
| `summary` | Main resume summary paragraph. |
| `avatarUrl` | Public path for the profile image, such as `/profile-image.jpg`. |
| `personalWebsiteUrl` | Optional website URL included in the command menu when set. |
| `contact` | Email, phone, and social links. |
| `education` | Education entries. |
| `work` | Work experience entries. |
| `skills` | Grouped skill lists. |
| `projects` | Project cards shown near the end of the resume. |

### Contact Links

The `contact.social` array currently supports these icon values:

```ts
"github" | "linkedin"
```

To add another social icon, update both:

- `SocialIcon` in `src/data/resume.ts`.
- The icon rendering logic in `src/components/Icon.astro`.

### Work Experience

Each item in `work` supports:

```json
{
  "company": "Company name",
  "link": "https://example.com",
  "badges": ["Remote", "Android", "Kotlin"],
  "title": "Mobile Engineer",
  "start": "2022",
  "end": null,
  "description": {
    "paragraph": "Short role overview.",
    "bullets": ["Impact or responsibility"]
  }
}
```

Use `end: null` for a current role. Use an empty `link` only when there is no public company or project URL.

### Projects

Each project supports:

```json
{
  "title": "Project name",
  "techStack": ["Android Native", "Kotlin"],
  "description": "Short project description.",
  "link": {
    "label": "Project link label",
    "href": "https://example.com"
  }
}
```

If a project is private, leave `href` empty or add the best public reference available.

## Assets

Static assets live in `public/` and are served from the site root.

| File | Used For |
| --- | --- |
| `public/profile-image.jpg` | Header avatar through `avatarUrl`. |
| `public/opengraph-image.jpg` | Default social sharing image in `BaseLayout.astro`. |
| `public/favicon.ico` | Browser favicon. |
| `public/icon.png` | PNG favicon. |
| `public/apple-icon.png` | Apple touch icon. |
| `public/_headers` | Static hosting headers, useful for Cloudflare Pages. |

When replacing images, keep the same filenames or update the paths in `src/data/resume.json` and `src/layouts/BaseLayout.astro`.

## Pages and Routes

| Route | Source | Description |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Main resume page. |
| `/resume.json` | `src/pages/resume.json.ts` | JSON representation of the resume data. |

## Layout and Styling

- Global styles are defined in `src/styles/global.css`.
- Tailwind CSS is configured through `@tailwindcss/vite` in `astro.config.mjs`.
- `BaseLayout.astro` owns document metadata, favicons, Open Graph tags, Twitter card tags, and Google Analytics.
- Resume sections are split into small Astro components under `src/components/`.
- The command menu is isolated in `src/components/CommandMenu.astro` and uses a small browser script instead of a hydrated framework island.

## SEO and Analytics

The shared layout includes:

- Standard page title and meta description.
- Search keywords.
- Open Graph profile metadata.
- Twitter summary card metadata.
- Bing site verification.
- Google Analytics using measurement ID `G-RJ4100DQ7M`, loaded only in production after initial page load.

For a fork or another person, update these values in `src/layouts/BaseLayout.astro` and keep `description` current in `src/data/resume.json`.

## Print Support

The resume has a dedicated PDF export generated from `src/data/resume.json`:

- Print-specific Tailwind classes reduce spacing.
- The command menu and shortcut hint are hidden during print.
- `scripts/generate-resume-pdf.mjs` creates `public/CV - Ar Razy Fathan Rabbani.pdf` during `npm run dev` and `npm run build`.
- The command menu includes a direct `Download PDF` action and does not open the browser print dialog.

Use Poppler and `pypdf` to render and inspect the generated pages after large content updates.

## Deployment

The site is static and does not require an Astro server adapter.

### Cloudflare Pages

Use these settings:

| Setting | Value |
| --- | --- |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | repository root |

### Other Static Hosts

For Netlify, Vercel static output, GitHub Pages, or a traditional web server:

1. Run `npm run build`.
2. Deploy the generated `dist/` directory.

## Maintenance Checklist

Before publishing a resume update:

1. Update `src/data/resume.json`.
2. Replace assets in `public/` if needed.
3. Run `npm run check`.
4. Run `npm run build`.
5. Preview with `npm run preview`.
6. Check the main page, `/resume.json`, mobile layout, and print preview.

## License

See `LICENSE`.
