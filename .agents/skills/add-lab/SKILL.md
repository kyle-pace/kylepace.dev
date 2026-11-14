---
name: add-lab
description: Add a new experiment (lab) to kylepace.dev, or move an existing page there. Use when Kyle starts a new lab or experiment, asks to list a project on kylepace.dev, or asks how labs are set up and routed.
---

# Adding a lab to kylepace.dev

A lab is its own repo, its own Cloudflare Worker and its own page with its own look. This repo (the hub) only lists it. The lab's Worker claims the path `kylepace.dev/<slug>/`, and a route on a path wins over the hub's Custom Domain, so the hub never needs a routing change.

## In the lab's own repo

1. **Make the repo** under `kyle-pace`, one per lab. Ask Kyle to create it if you can't, and give him the link: https://github.com/new
2. **Bring in the principles.** Copy `template/.github/workflows/principles.yml` from [kyle-pace/principles](https://github.com/kyle-pace/principles/tree/main/template), set its `output-dir`, then run the sync once with `--platforms web`.
3. **Build it to live under its path.** Put the pages under `src/pages/<slug>/`. Don't use Astro's `base` option: it breaks with the Cloudflare adapter. Set `site: 'https://kylepace.dev'`.
4. **Claim the path** in the lab's `wrangler.jsonc`:
   ```jsonc
   "routes": [
     { "pattern": "kylepace.dev/<slug>", "zone_name": "kylepace.dev" },
     { "pattern": "kylepace.dev/<slug>/*", "zone_name": "kylepace.dev" }
   ]
   ```
5. **Use `LabLayout` from kp-design**, pinned to the same commit as the other sites (see the `bump-kp-design` skill). It gives a slim top bar with a back link to Labs and an About link, and no site header. The app comes first; the explanation goes in the About section.
6. **Give it its own look.** Write `design/PLAN.md` first, keep its colors in its own `theme.css`, and follow "Look and feel" in the principles. A lab should not look like a page of the hub.
7. **Set up the check command** (the `page-check` skill) and make its share card (the `share-card` skill).
8. **Analytics** goes to the shared kylepace.dev Amplitude project through kp-design. Custom events send `experiment: '<slug>'`.
9. A lab that shouldn't appear in search sends `X-Robots-Tag: noindex` from its own `public/_headers`.

## In this repo

1. Add an entry to `src/data/projects.ts`: slug, title, summary, blurb, status, accent, started, repo, and an `imageAlt` that describes its screenshot. The hourly lab-activity job reads the repo name from here.
2. Once the lab is live, make its card image with the `card-screenshots` skill.
3. Add a line to the ship log (the `ship-log` skill).
4. `npm run build`, `npm run check`, push.

## If it used to live somewhere else

Add a 301 from the old address. For a page that was at `kylepace.net/labs/<slug>/`, that's a line in kylepace.net's `public/_redirects`.
