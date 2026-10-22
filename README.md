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

Landwhale PNGs live in `public/assets/landwhale/`. Add new public routes to the
prerender list in `react-router.config.ts`. Keep initial rendering safe for the
build environment; browser APIs belong in effects or event handlers.

## Deployment

Cloudflare Pages builds with `pnpm run build` and publishes `build/client`.
Use the repository root, Node 22, pnpm 10.18.3 and no application secrets.
`public/404.html` handles unknown paths; no SPA catch-all is needed.

Review changes into `master` and validate its Pages preview before promoting to
`production`. Pages previews all non-production branches and deploys production
from `production` to https://seanboose.com. The owner handles merges; use merge
commits when promoting between long-lived branches.

Test a hosted deployment with:

```sh
PLAYWRIGHT_BASE_URL=https://YOUR_PREVIEW.pages.dev pnpm run e2e
```
