# Changelog

## 2025-11-09 — Features & fixes

- Added Steam playtime integration:
  - Server API: `app/api/steam-playtime/route.ts` — calls Steam Web API GetOwnedGames and returns playtime for Space Engineers (appid 244850) and Warframe (appid 230410).
  - Includes both total playtime (`playtime_forever`) and last-2-weeks (`playtime_2weeks`) in minutes and converted hours.
  - Client components:
    - `app/components/SteamPlaytime.tsx` — combined view showing total and last-2-weeks hours for both games.
    - `app/components/GamePlaytime.tsx` — per-game component used in the About page cards to display live hours.
  - About page updated to render live playtime (SteamID set to provided ID for testing): `app/about/page.tsx`.

- UI updates:
  - Replaced hardcoded "Hours played" in About page cards for Warframe and Space Engineers with live values from Steam.
  - Removed minute-bracket display; shows hours only.

- Social links:
  - Added Discord link/icon to header and footer (placeholder invite URL). Files: `app/components/Header.tsx`, `app/components/Footer.tsx`.

- Tests / tooling:
  - Created lightweight in-repo fetch mock and various component tests previously (see `tests/`), and added `.gitattributes` to normalize LF endings.

Security notes
- Do NOT commit secrets. Add your Steam API key locally in `.env.local` as `STEAM_API_KEY` (or `STEAM_API_KEY_DEV` / `STEAM_API_KEY_PROD` if you prefer environment-specific names). The API route reads from env and keeps the key server-side.

How to test locally
- Add `.env.local` with `STEAM_API_KEY=YOUR_KEY` and (optionally) `STEAM_PROFILE_ID=76561198153222775`.
- Run dev server: `npm run dev` and open `/about` to view live playtime.

If you want different behavior (on-page SteamID input, remove the About page SteamID, or swap minute/hour display), tell me and I can adjust it.
# CHANGELOG

All notable changes to this repository are documented in this file. This changelog was generated on 2025-11-01 and summarizes the edits and test work completed during the recent migration and improvements session.

## [Unreleased] - 2025-11-01

### Added
- Vitest testing setup and tests
  - `vitest.config.ts` and `test/setup.ts` configured for jsdom/node environments.
  - Tests added under `tests/` for components and API routes (clips, schedule, stream).
    - `tests/api/clips.route.spec.ts` (detailed token/user/clips flows).
    - `tests/api/schedule.route.spec.ts` (token + schedule success and error cases).
    - `tests/api/stream.route.spec.ts` (live and offline stream cases).
    - Component tests: `CallToAction.test.tsx`, `GameHeroBackground.test.tsx`, `TwitchPlayer.test.tsx`, `VodsSection.test.tsx`.

- Vercel deployment docs/config
  - `vercel.json` and `VERCEL.md` added (deployment notes and environment variable requirements).

- Copyright-safe site background
  - `public/images/logo-watermark.svg` (generated initials watermark).
  - `app/components/GameHeroBackground.tsx` (client background component).

### Changed
- Type-safety and runtime parsing for Twitch Helix server routes
  - `app/api/twitch/clips/route.ts` — replaced `any` with typed interfaces (TwitchClip, ClipsPayload), added token caching and safe parsing guards.
  - `app/api/twitch/schedule/route.ts` — added SchedulePayload types, robust parsing of Helix schedule responses, token caching, and in-memory schedule cache.
  - `app/api/twitch/stream/route.ts` — added StreamPayload types, token caching, and safe parsing of Helix streams responses.

- Frontend wiring
  - `app/components/TwitchPlayer.tsx` — updated to accept `parent: string | string[]` and removed deprecated iframe props.
  - `app/components/ScheduleSection.tsx` and `app/schedule/page.tsx` — wired to server-side `/api/twitch/schedule` and render real scheduled segments or a "No scheduled stream" message. Timezone set to `America/St_Johns` where applicable.
  - `app/page.tsx` — integrated `GameHeroBackground` and watermark layer.
  - `app/globals.css` — styles supporting the watermark and hero background.

- Test & coverage scripts
  - `package.json` scripts updated: `test`, `test:watch`, `test:coverage`.
  - Coverage configured (v8 provider) and run; coverage reports saved (text and lcov).

### Removed / Deprecated
- Removed deprecated iframe attributes from Twitch embed usage.

### Notes & Environment
- Required environment variables for Twitch API routes:
  - `TWITCH_CLIENT_ID`
  - `TWITCH_CLIENT_SECRET`

- Local git push is pending because committing requires a configured git user.name and user.email. I will not modify your git identity without your explicit confirmation. See next steps for options.

### Tests & Coverage
- Tests: multiple suites added and run. All tests pass locally (14 tests across 9 files as of 2025-11-01).
- Coverage: improved after adding schedule/stream tests but global thresholds are not yet met; uncovered areas include many UI components and page-level code under `app/`.

## Next recommended actions
1. Add focused component tests for untested components (ScheduleSection, Header, Layout, and several pages) to raise line/function/branch coverage.
2. Add a CI (GitHub Actions) workflow to run tests and coverage on push/PR.
3. Decide on git commit author identity and allow committing/pushing the current changes.

---
Generated automatically by developer tooling on 2025-11-01.

## 2025-11-19 — Test expansion & small improvements

- Added many new tests to increase coverage and harden server routes and client components:
  - Component tests: `tests/SteamPlaytime.test.tsx`, `tests/GamePlaytime.test.tsx`, `tests/SchedulePage.test.tsx`, plus additions/updates to `tests/VodsSection.test.tsx` (debounce fix), and numerous existing component tests under `tests/`.
  - API route tests: `tests/api/steam-playtime.route.spec.ts` to validate the Steam proxy route behavior (missing env var and successful Steam response parsing).
  - Test harness improvements: continued use of the in-repo `test/fetchMock.ts` to stub fetch calls across tests and `test/setup.ts` for test bootstrap.

- Small code changes to support testing and reliability:
  - `app/components/VodsSection.tsx`: added configurable `debounceMs` prop (default 250) so tests can render synchronously with `debounceMs={0}` to avoid flaky timing.
  - Tests updated to await async Server Components where necessary (e.g., `tests/SchedulePage.test.tsx` calls the async `SchedulePage` before rendering its returned JSX).

- Test run results (local): full suite passed after changes — `29 files, 55 tests` (Vitest run on 2025-11-19).

If you'd like, I can now push these test files and the updated changelog to `origin/main` (I will run Husky hooks; if your environment's pre-push hook errors, I can push with `--no-verify` on your command). 
