# overview

frontend for a personal website

built using create-vite with react-router-v7 option (i want to get more practice with SSR apps)

uses Bearer token authorization (JWT) to communicate with backend

# build

this repo is set up for Docker, but i've decided to go with my deploy environment's (Railway) native deploy tools.
since Railway automatically tries to deploy with Docker if it sees a Dockerfile or docker-compose.yml, i prepended those file names with UNUSED_ to force the default build/deploy method (railpack).
remove the `UNUSED_` from those files to build/deploy using Docker (see package.json for local docker scripts)

# deployment

automatically builds/deploys on changes to the `staging` and `production` branches (to their respective deployed environments)
urls

- production: https://personal-website-frontend-production.up.railway.app/
- staging: https://personal-website-frontend-staging.up.railway.app/


# related repos

- backend: @seanboose/personal-website-backend
- shared types: @seanboose/personal-website-api-types

# roadmap

- create/edit/delete blog posts with images
- ads server
  - serve random fake ads on those posts
  - attribute impressions/clicks of those ads
  - build dashboards for viewing ad "performance"
- generate api schema with oapi to keep client and api synchronized
- art gallery tab so i can get off of instagram
- 3d models tab (3d printer stuff)