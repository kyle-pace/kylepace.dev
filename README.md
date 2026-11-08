# kylepace.dev

The home for Kyle Pace's experiments. This repo is the hub: the home page that lists every experiment, plus the shared privacy, accessibility and 404 pages. Each experiment lives in its own repo and deploys its own Cloudflare Worker at `kylepace.dev/<slug>/`.

Built with [Astro](https://astro.build) and hosted on Cloudflare Workers. It follows [kyle-pace/principles](https://github.com/kyle-pace/principles), synced into `AGENTS.md`.

## Run it

```sh
npm install
npm run dev       # local site at http://localhost:4321
npm run build     # builds to dist/
npm run preview   # builds, then runs it the way Cloudflare will
```

## Where things go

| What | Where |
| --- | --- |
| The list of experiments | `src/data/projects.ts` |
| Page shell: colors, type, header, footer, display settings, analytics | `DevLayout` from [kp-design](https://github.com/kyle-pace/kp-design), pinned in `package.json`; the shared links are in its `lib/kylepace-dev.ts` |
| Share cards | `design/og-*.html`, rendered to `public/og-*.png` at 1200×630 |
| Search and crawler rules | `public/robots.txt`, `public/_headers` |
| Principles and shared skills | `AGENTS.md` (between the markers) and `.agents/skills/`, synced daily by `.github/workflows/principles.yml` |

## How the domain is split

```
kylepace.dev              → kylepace-dev Worker (this repo, Custom Domain)
kylepace.dev/<slug>/...   → that experiment's own Worker (a route in its repo)
```

Cloudflare runs a route before a Custom Domain on the same hostname, so an experiment's route takes its path and everything else falls through to the hub. Nothing in this repo has to change when a project is added, except listing it.

## Adding a project

1. **Make the repo.** One repo per experiment under `kyle-pace`. Copy `.github/workflows/principles.yml` from [kyle-pace/principles](https://github.com/kyle-pace/principles/tree/main/template) and run its sync once.
2. **Serve it under its path.** Build it to live at `/<slug>/` (in Astro, set `base: '/<slug>'` and `site: 'https://kylepace.dev'`), and claim the path in its `wrangler.jsonc`:
   ```jsonc
   "routes": [
     { "pattern": "kylepace.dev/<slug>", "zone_name": "kylepace.dev" },
     { "pattern": "kylepace.dev/<slug>/*", "zone_name": "kylepace.dev" }
   ]
   ```
3. **Make it feel like part of the site.** Install [kp-design](https://github.com/kyle-pace/kp-design) and wrap every page in its `DevLayout`, which brings the hub's header, footer, display settings and analytics. Give it its own share card.
4. **List it.** Add an entry to `src/data/projects.ts` here and push.
5. **Point to it from kylepace.net.** If it used to live at `kylepace.net/labs/<slug>/`, add a 301 there in `public/_redirects`.

An experiment that shouldn't show up in search sends `X-Robots-Tag: noindex` from its own `public/_headers`.

## Deploying

Cloudflare Workers Builds deploys `main` on every push (build command `npm run build`, deploy command `npx wrangler deploy`). The Worker is `kylepace-dev`, with `kylepace.dev` as its Custom Domain (set in `wrangler.jsonc`). `www.kylepace.dev` 301s to `kylepace.dev` with a Cloudflare Redirect Rule (a proxied `AAAA 100::` record makes it resolve). DNS for kylepace.dev is on Cloudflare; Porkbun is the registrar.
