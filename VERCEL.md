# Deploying to Vercel

This repository is a Next.js app and is ready to be hosted on Vercel. The file `vercel.json` is included to make the project intent explicit.

Quick steps

1. Go to https://vercel.com and sign in with GitHub (or your preferred provider).
2. Import the repository `SkullGaming31/website` (or the repository connected to this project).
3. Vercel will auto-detect the Next.js framework. Use the default build command and output settings:
   - Build command: `npm run build` (or `pnpm build` / `yarn build`)
   - Output: automatic (Next.js)

Environment variables

This project reads Twitch credentials in server-side API routes. Set these Environment Variables in the Vercel project settings (Dashboard → Settings → Environment Variables):

- `TWITCH_CLIENT_ID` — your Twitch App client ID
- `TWITCH_CLIENT_SECRET` — your Twitch App client secret

Notes & troubleshooting

- The repo root contains a `package.json` with `build` script (`next build`) and Next.js v16. Vercel supports Next.js projects natively.
- If you use a GitHub integration, Vercel will trigger a deploy on each push to the connected branches.
- If you want the project to live on a custom domain, add the domain in Vercel and follow their DNS instructions.

If you'd like, I can also:

- Add GitHub Actions to run tests or lint on push.
- Create a small deploy checklist or CI job to validate the build before pushing to Vercel.
