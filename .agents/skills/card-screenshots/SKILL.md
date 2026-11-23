---
name: card-screenshots
description: Retake the screenshots shown on kylepace.dev's lab and app cards. Use when a lab or app is added, when a card shows the wrong part of the page, or when a card image looks out of date.
---

# Card screenshots

Each card on the home page and `/labs/` shows a screenshot of the real thing: `src/assets/projects/<slug>.png` for labs and `src/assets/apps/<id>.png` for apps. `scripts/screenshot-projects.py` takes them from the live sites in dark mode at 1280 px, and Astro turns them into small WebP files at build.

## They keep themselves current

`.github/workflows/card-screenshots.yml` runs every day at 18:23 UTC (daylight for Live Earth's Americas view) and runs the script with `--changed`:

- A lab's card is retaken when `src/data/activity.json` says the lab was worked on after its card was last taken (`src/data/screenshots.json`). An app's card is retaken once it's a month old.
- A new image that comes out blank, or a page that fails to load, keeps the old card and turns the run red.
- A new image that looks the same as the old one is thrown away, so nothing churns.
- Share cards in `design/og-*.html` that show a changed card (like `og-labs.html`) are re-rendered.
- The site is built, then the change is committed and pushed to `main`.

To retake cards now, run the workflow from the Actions tab: leave the names empty for the out-of-date ones, give slugs, or type `all`. Give a branch other than `main` to push a preview branch to look at first.

## When to step in

The workflow only knows what each page looks like from the settings below. Change them when:

- **A new lab or app is added.** Labs come from `src/data/projects.ts` on their own; a new app needs its address in `APPS`. Run the workflow with its name once it's live.
- **A card shows the wrong part of the page.** Add a CSS selector for the interesting part (the tree, the globe, the map) to `SELECTORS`, or put the project in `TOP_OF_PAGE` if its whole first screen is the app.
- **A card opens empty.** Add a query string or `#hash` that shows a good state to `PATHS`.
- **A card is caught loading.** Add a "ready" test to `READY`.
- **A card only looks right at some hours** (Live Earth needs daylight over the Americas). Give its UTC hours in `DAYLIGHT_UTC`; outside them the card waits for the next run.

Then update `imageAlt` in `src/data/projects.ts` or `src/data/apps.ts` so it describes what the new image shows.

## Running it by hand

```sh
npm ci                       # share cards load their fonts from node_modules
pip install playwright pillow
CHROME=/path/to/chrome python3 scripts/screenshot-projects.py <slug-or-app-id> ...   # or --changed, or nothing for all
```

Look at each image, then `npm run build`, `npm run check` and push.
