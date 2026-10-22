# Security and retirement checklist

The repository audit cannot determine what the Railway incident exposed. Check
both frontend/backend services, production/staging environments, shared/sealed/
reference variables, build credentials, deployment logs and integrations manually.
Do not paste credential values into issues, logs or migration documentation.

## Rotate while still needed; revoke when retired

- [ ] `AUTH_REQUEST_KEY`: frontend/backend shared key. Rotate both deployed sides
      if potentially exposed. No replacement is needed for the static site.
- [ ] `JWT_KEY`: backend signing key for access and refresh tokens. Rotate if
      potentially exposed, invalidating existing sessions. Retire with the API.
- [ ] AWS access-key pair: identify every current/historical key ID in dotenv
      history, its IAM user, policy, usage and reuse. Rotate exposed active pairs;
      revoke keys dedicated to the retired backend after assets are copied.
      Review CloudTrail where available, S3 policies and billing. Never publish
      the whole bucket just to host these images.
- [ ] `GH_PACKAGES_PAT` and older `GITHUB_PACKAGES_PAT`: the owner reports the PAT
      has expired. Verify expiry, reuse and remaining consumers. Remove obsolete
      Railway/GitHub secrets; do not issue a replacement for this frontend.
- [ ] Railway account/project tokens and deploy hooks: inventory manually;
      revoke retired credentials and remove obsolete GitHub integrations/webhooks.
- [ ] GitHub App/OAuth installations, deploy keys, publishing PATs and repo/org/
      environment secrets: review scope and other consumers before removal.

Confirmed repository findings: a tracked AWS access-key ID and historical IDs;
a nonempty tracked E2E `AUTH_REQUEST_KEY` (removed by this migration). The E2E key
differs from local development keys, but production reuse is unknown. Historical
AWS secret assignments inspected during the audit were empty/placeholders.
`.npmrc` used an environment reference, not a literal PAT. This targeted audit is
not a complete forensic scan of all Git history, remote branches or artifacts.
Removing files does not remove historical values; rotate/revoke actual exposed
credentials first. Review history cleanup separately if needed.

## Non-secret configuration

API/S3 URLs, bucket names, AWS region, token lifetimes, ports and environment names
need no rotation. AWS access-key IDs are identifiers, not standalone passwords;
investigate their associated pairs. No `VITE_*` values or application environment
variables are required by the static site. Never put server secrets in browser
code, prerendered HTML/data, or `public/`.

## Account and billing checks after successful cutover

- [ ] Verify `seanboose.com` HTTPS, routing and assets on Pages.
- [ ] End rollback window and explicitly approve Railway decommissioning.
- [ ] Remove frontend/backend staging and production services, unused volumes,
      databases, scheduled jobs and subscriptions; verify final Railway billing.
- [ ] Remove unused AWS objects/buckets/IAM credentials only after verifying they
      are not shared; inspect versioned storage and remaining AWS charges.
- [ ] Check older Render/Vercel services referenced in stale project documents.
- [ ] Archive backend/API-types repositories and retire package publishing only
      after confirming no other consumers.
