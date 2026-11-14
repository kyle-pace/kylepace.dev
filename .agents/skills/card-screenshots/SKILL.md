---
name: card-screenshots
description: Retake the screenshots shown on kylepace.dev's lab and app cards. Use when a lab or app is added, when its look changes, or when a card image looks out of date or shows the wrong part of the page.
---

# Card screenshots

Each card on the home page and `/labs/` shows a screenshot of the real thing: `src/assets/projects/<slug>.png` for labs and `src/assets/apps/<id>.png` for apps. `scripts/screenshot-projects.py` takes them from the live sites in dark mode at 1280 px, and Astro turns them into small WebP files at build.

## Steps

1. The lab or app must be live first; the script reads the public address.
2. Run it for the ones that changed (no names means all of them):
   ```sh
   CHROME=/path/to/chrome python3 scripts/screenshot-projects.py <slug-or-app-id>
   ```
   It needs Playwright for Python (`pip install playwright`).
3. Look at each image. It should show the interesting part (the tree, the globe, the map), not a header or an empty state.
   - Wrong part of the page: add a CSS selector for it to `SELECTORS` in the script.
   - Opens empty: add a query string that shows a good state to `PATHS`.
   - A new app: add its address to `APPS`.
4. Update `imageAlt` in `src/data/projects.ts` or `src/data/apps.ts` so it describes what the new image shows.
5. `npm run build`, `npm run check`, push.
