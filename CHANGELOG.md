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
2. Add MSW for centralized API mocking across node and jsdom tests.
3. Add a CI (GitHub Actions) workflow to run tests and coverage on push/PR.
4. Decide on git commit author identity and allow committing/pushing the current changes.

---
Generated automatically by developer tooling on 2025-11-01.
