# overview

frontend for a personal website

built using create-vite with react-router-v7 option (i want to get more practice with SSR apps)

uses Bearer token authorization (JWT) to communicate with backend

# deployment

automatically deploys to vercel on changes.
any changes to the `production` branch deploys to production, any changes on any other branch deploy to `staging`.
id like it to just deploy on changes to the `staging` branch, but vercel does not currently support that on their free
tier.

urls

- production: https://personal-website-frontend-production.vercel.app/image-display
- staging: https://personal-website-frontend-staging.vercel.app/image-display

# related repos

- backend: @seanboose/personal-website-backend
- shared types: @seanboose/personal-website-api-types

# roadmap

- create/edit/delete blog posts with images
- serve random ads on those posts
- attribute impressions/clicks of those ads
- generate api schema with oapi to keep client and api synchronized
