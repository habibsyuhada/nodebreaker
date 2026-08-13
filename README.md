# NODEBREAKER

A pixel-art hacking puzzle game for mobile-portrait screens, built as an installable, offline-capable
PWA. No backend, no login — all progress lives in `localStorage`, and every sprite/icon/sound is
generated from code (no external image or audio assets).

Explore fictional servers, tap-hold text to save clues, combine them on the Workbench, and log in —
while a trace meter climbs on risky moves. 8 levels, each with a before/after story beat about the
person on the other end of the hack.

See [`PROGRESS.md`](./PROGRESS.md) for the full build history, architecture reference, and design
brief (source of truth for scope).

## Stack

- React + Vite + TypeScript
- Tailwind v4 (`@theme` tokens, see `src/index.css`)
- Zustand (`persist` middleware for the save file)
- `vite-plugin-pwa` (manifest + Workbox service worker)
- Bubblewrap (TWA) for the Google Play release, via `.github/workflows/release-play.yml`

## Development

```sh
npm install
npm run dev       # dev server (no service worker — see PROGRESS.md's PWA notes)
npm run lint       # oxlint
npx tsc -b --noEmit
npm run build      # production build, generates the PWA manifest + service worker
npm run preview    # serve the production build, for testing PWA/offline behavior
```

## Deployment

- `deploy-pages.yml` builds and publishes to GitHub Pages on every push to `main`.
- `release-play.yml` is manual (`workflow_dispatch`) and wraps the deployed PWA as a Trusted Web
  Activity, then uploads a signed App Bundle to the Play Console.
