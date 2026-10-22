# Personal website

React Router 7, React 19, Tailwind 4 and Vite. Public routes are prerendered at
build time and served as static files. There is no production application server,
API, authentication, package-registry token or application secret.

## Development and validation

Use Node 22 (`.node-version`) and pnpm 10.18.3 (`packageManager`).

```sh
pnpm install --frozen-lockfile
pnpm run dev
pnpm run build       # image validation, ESLint, route types, TypeScript, static build
pnpm test            # production build and static artifact checks
pnpm run e2e        # builds and serves the static output; Chromium/Firefox/WebKit
pnpm run preview    # existing build at http://127.0.0.1:3000
```

Preview uses a separate Vite configuration with no React Router server plugin or
SPA catch-all. Node is a local development/build tool, not a production service.
Cloudflare's clean-URL normalization and custom 404 response require hosted checks.

Routes: `/`, `/landwhale`, `/image-display`. `/login` is retired and returns 404.
Keep new public routes in `react-router.config.ts`'s prerender list. Do not add
server actions or request-dependent loaders to a static deployment.

## Images

Landwhale images live in `public/assets/landwhale/`: `base.png`, `backpack.png`,
`gold-flipper.png`, `scanner.png`, `spikes.png`, and `spine-eyes.png`.
The image page discovers PNG files recursively in `public/assets/images/` at build time,
shows the first in filename order, and cycles through them with its button.
Only place public content here. Do not copy credentials or signed URLs.

If importing from the old S3 bucket, use an authorized AWS CLI profile locally:

```sh
pnpm run import:images -- YOUR_BUCKET
pnpm run check:assets
```

Replace `YOUR_BUCKET` with the actual production bucket. Inspect downloaded files;
nested object keys are preserved. The import command only reads S3. Commit the public images so
builds never require AWS credentials or access to the old bucket. Keep individual
assets below Cloudflare Pages' 25 MiB limit.

## Cloudflare Pages

Create a **Pages** project connected to the existing frontend GitHub repository.
Limit the GitHub App installation to this repository.

| Setting             | Value                                                            |
| ------------------- | ---------------------------------------------------------------- |
| Framework preset    | None (custom static build)                                       |
| Root directory      | Repository root (blank)                                          |
| Production branch   | `production`                                                     |
| Preview branches    | `csr-migration`, `staging`, other desired branches               |
| Build command       | `pnpm run build`                                                 |
| Build output        | `build/client`                                                   |
| Node version        | 22 (`.node-version`; set `NODE_VERSION=22` if needed)            |
| pnpm version        | 10.18.3 (`packageManager`; set `PNPM_VERSION=10.18.3` if needed) |
| Application secrets | None                                                             |

Use Git deployments; no Cloudflare API token in GitHub Actions, Workers adapter,
Pages Functions, database, Docker image or paid plan is required. Static hosting
is expected to fit the free tier; domain registration remains a separate cost.

Pages serves the prerendered route files directly. `public/404.html` disables its
automatic SPA fallback, so missing assets and unknown/retired routes return 404.
There is deliberately no blanket `_redirects` rule. Verify slash and non-slash
URLs on the preview. Google Fonts remains an external stylesheet dependency.

To run the same browser tests against a deployment instead of a local server:

```sh
PLAYWRIGHT_BASE_URL=https://YOUR_PREVIEW.pages.dev pnpm run e2e
```

For the first deployment, select `csr-migration` temporarily as the Pages project's
production branch. This publishes only to the new `pages.dev` hostname; leave the
custom domain and DNS untouched. The existing `production` branch still contains
the SSR build until the migration is merged. After validation and merge, change
the Pages production branch to `production`. Use a branch preview for the final
preview-specific `noindex` check; the temporary production `pages.dev` URL does
not have the same preview indexing guarantees.

## Cutover (requires owner approval)

1. Complete the image import and validation before deploying.
2. Connect Pages and deploy `csr-migration` as a preview. Test all three routes,
   refresh/direct navigation, equipment toggles, images, styles/fonts, metadata,
   missing assets and unknown routes. Confirm preview responses are not indexed.
3. Complete the credential inventory and rotations in [SECURITY-CUTOVER.md](SECURITY-CUTOVER.md).
4. Record current DNS records and rollback targets. Confirm the DNS provider and
   preserve mail/verification records if nameservers must change.
5. With explicit approval, merge into `production`, add `seanboose.com` in Pages,
   and switch DNS. Apex Pages domains require Cloudflare nameservers. Check CAA
   compatibility, certificate issuance, HTTPS and the desired www redirect.
6. Verify the real domain, all routes/assets, and deployment updates. Keep Railway
   available through the agreed rollback window; reverting DNS is the rollback.
7. With explicit approval, remove Railway frontend/backend production and staging
   resources, obsolete credentials/integrations and any unused storage. Check
   Railway and AWS billing, subscriptions and older Render/Vercel deployments.
8. Archive the backend and API-types repositories if they have no other consumers.

`personal-website-frontend-production.up.railway.app` belongs to Railway and cannot
be moved to Pages. It stops working when that Railway service is removed.
