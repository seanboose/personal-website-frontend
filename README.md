# Personal website

React Router 7, React 19, Tailwind 4 and Vite. The home (`/`) and landwhale
(`/landwhale`) pages are prerendered and hosted as static files on Cloudflare Pages.

## Development

Use Node 22 and pnpm 10.18.3.

```sh
pnpm install --frozen-lockfile
pnpm run dev
pnpm test         # asset validation, lint, types, build and static-output tests
pnpm run e2e     # builds and tests the static output in three browsers
pnpm run preview # existing build at http://127.0.0.1:3000
```

Open http://localhost:5173/ for development. The dev server prints its actual
address on the `Local:` line at startup; if port 5173 is busy, it uses the next
available port. Watch processes preserve terminal output so that address stays
visible in the scrollback.

Landwhale PNGs live in `public/assets/landwhale/`. Add new public routes to the
prerender list in `react-router.config.ts`. Keep initial rendering safe for the
build environment; browser APIs belong in effects or event handlers.

## Deployment

Cloudflare Pages builds with `pnpm run build` and publishes `build/client`.
Use the repository root, Node 22, pnpm 10.18.3 and no application secrets.
`public/404.html` handles unknown paths; no SPA catch-all is needed.

Review changes into `master`, promote to `staging` for a preview, then promote to
`production`. Pages previews all non-production branches; its production branch
is `production` (`csr-migration` temporarily during setup). The owner handles merges.

Test a hosted deployment with:

```sh
PLAYWRIGHT_BASE_URL=https://YOUR_PREVIEW.pages.dev pnpm run e2e
```
