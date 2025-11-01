<!--
Purpose: concise, actionable guidance so an AI coding assistant can be productive in this repo.
Keep this file short (20–50 lines) and reference concrete files/examples discovered in the project.
-->

# Copilot / AI assistant instructions (concise)

This Next.js app uses the App Router (`app/`) and TypeScript. The goal here is to give fast, precise pointers so an AI agent can make safe edits and follow project conventions.

- Project root files to inspect first: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, and `README.md`.
- Primary application entry: `app/layout.tsx` (global layout, fonts via `next/font/google`) and `app/page.tsx` (home route).

Important facts and conventions
- App Router: this repo uses the `app/` directory (Next.js App Router). Files in `app/` are server components by default unless they include a top-line `"use client"` directive.
- Fonts: `app/layout.tsx` imports Geist via `next/font/google` and exports CSS variable class names. Preserve the pattern: define font variables in layout and compose them on `<body>`.
- Styling: Global styles live in `app/globals.css`. PostCSS/Tailwind integration is configured in `postcss.config.mjs` (uses `@tailwindcss/postcss` plugin).
- Images/assets: Served from `public/`. The code uses `next/image` in `app/page.tsx` — prefer `next/image` for new images.
- TypeScript: `tsconfig.json` enables `strict` and has path mapping `@/* -> ./*`. Follow the strict types; add types when introducing new modules.
- Linting: `eslint.config.mjs` extends Next.js core/web-vitals and the TypeScript config. Note the project sets global ignores for `.next/**`, `out/**`, `build/**`, and `next-env.d.ts`.

Developer workflows (commands)
- Start dev server: `npm run dev` (runs `next dev`) — serves at http://localhost:3000 by default.
- Build: `npm run build` (runs `next build`).
- Start production server: `npm run start` (runs `next start`).
- Lint: `npm run lint` runs the `eslint` CLI; the project provides `eslint.config.mjs` for rules. If you need to lint files explicitly, run `npx eslint . --ext .ts,.tsx`.

Patterns and examples to follow when editing
- Add routes: create a new directory under `app/` with a `page.tsx` (server component) or `page.tsx` + `client` marker to switch to client components.
- Global CSS: import additional global or utility classes into `app/globals.css`. Component-level styles should use Tailwind utility classes.
- Fonts: reuse the pattern in `app/layout.tsx` (call the font import, pass `variable: "--font-name"`, and add the variable to `<body className={...}>`).
- Images: put static assets in `public/` and reference them with `/filename` in `next/image` `src` props (see `app/page.tsx`).

Integration and deployment notes (discovered)
- README suggests Vercel for deployment (standard for Next.js). No Vercel-specific config found in repo — `next.config.ts` is present but empty.
- Dependencies: Next 16, React 19 and Tailwind/PostCSS plugin are declared in `package.json`.

When opening a PR
- Keep changes minimal and focused. Update `app/layout.tsx` or `app/page.tsx` only when altering fonts, metadata, or the root layout.
- If adding new dependencies, update `package.json` and ensure local `npm run build` succeeds.

If anything in this file is unclear or incomplete, tell me which area (commands, layout, fonts, linting, routing) and I'll expand with examples or tests.
