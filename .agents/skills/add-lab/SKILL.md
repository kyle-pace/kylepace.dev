---
name: add-lab
description: Add a new experiment (lab) to kylepace.dev, or move an existing page there. Use when Kyle starts a new lab or experiment, asks to list a project on kylepace.dev, or asks how labs are set up and routed.
---

# Adding a lab to kylepace.dev

A lab is its own repo, its own Cloudflare Worker and its own page with its own look. This repo (the hub) only lists it. The lab's Worker claims the path `kylepace.dev/<slug>/`, and a route on a path wins over the hub's Custom Domain, so the hub never needs a routing change.

## In the lab's own repo

Start from [kyle-pace/lab-template](https://github.com/kyle-pace/lab-template). It already does steps 2 to 9 below, so a new lab is a working, checked page before any of its own code exists.

1. **Make the repo from the template** under `kyle-pace`, one per lab. Ask Kyle to create it if you can't, and give him the link: https://github.com/new?template_name=lab-template&template_owner=kyle-pace
2. **Set it up:** `npm install`, then `npm run new-lab -- <slug> "<Name>" "<One sentence.>"`. That fills in the slug, name and description, moves the page to `src/pages/<slug>/` and removes the template notes.
3. **Give it its own look.** Write `design/PLAN.md` first, keep its colors in `src/styles/theme.css`, and follow "Look and feel" in the principles. A lab should not look like a page of the hub.
4. **Build the app** in `src/pages/<slug>/index.astro` (the app comes first) and fill in the About page (the `about-page` skill). Send custom events with `track()` from `src/lib/track.ts`, which adds `experiment: '<slug>'`, and put each in the kylepace.dev tracking plan.
5. **Share cards:** restyle `design/og*.html` in the lab's look and run `npm run og`.
6. `npm run build && npm run check`, then push. Connect the repo in Cloudflare Workers Builds (build `npm run build`, deploy `npx wrangler deploy`); Kyle may need to do this: https://dash.cloudflare.com/?to=/:account/workers-and-pages/create

What the template already has, for reference (and for a lab made before it existed):

- **The principles,** synced daily by `.github/workflows/principles.yml` (from [kyle-pace/principles](https://github.com/kyle-pace/principles/tree/main/template)), with `output-dir: dist/client`.
- **Pages under `src/pages/<slug>/`** and `build.assets: '<slug>/_astro'`. Don't use Astro's `base` option: it breaks with the Cloudflare adapter. `site: 'https://kylepace.dev'`.
- **The path claimed** in `wrangler.jsonc`:
  ```jsonc
  "routes": [
    { "pattern": "kylepace.dev/<slug>", "zone_name": "kylepace.dev" },
    { "pattern": "kylepace.dev/<slug>/*", "zone_name": "kylepace.dev" }
  ]
  ```
- **`LabLayout` from kp-design**, pinned to a commit (see the `bump-kp-design` skill): a slim top bar with a back link and an About link, no site header. Analytics goes to the shared kylepace.dev Amplitude project through it.
- **The check command** (the `page-check` skill) and an empty `.agents/allowed-hosts.txt`.
- A lab that shouldn't appear in search sends `X-Robots-Tag: noindex` from its own `public/_headers`.

## In this repo

1. Add an entry to `src/data/projects.ts`: slug, title, summary, blurb, status, accent, started, repo, and an `imageAlt` that describes its screenshot. The hourly lab-activity job reads the repo name from here.
2. Once the lab is live, make its card image with the `card-screenshots` skill.
3. Add a line to the ship log (the `ship-log` skill).
4. `npm run build`, `npm run check`, push.

## If it used to live somewhere else

Add a 301 from the old address. For a page that was at `kylepace.net/labs/<slug>/`, that's a line in kylepace.net's `public/_redirects`.
