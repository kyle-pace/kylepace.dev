"""Takes a fresh screenshot of each experiment's main view (the tree, the globe,
the map), and of each app's site, for the cards on the home page and /labs/.
Saves 16:10 images to src/assets/projects/<slug>.png and src/assets/apps/<id>.png;
Astro turns them into small WebP files at build.

Usage: CHROME=/path/to/chrome python3 scripts/screenshot-projects.py [slug-or-app-id ...]
Needs Playwright for Python. Run it again whenever an experiment's or app's look changes.
"""
import asyncio, os, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/assets/projects"
APPS_OUT = ROOT / "src/assets/apps"

# Apps live on their own sites. Each shot is the top of the page, as a visitor first sees it.
APPS = {
    "seattle-grocery-deals": "https://seattlegrocery.deals/",
    "henwood": "https://henwood.app/",
}

ALL = re.findall(r"slug: '([^']+)'", (ROOT / "src/data/projects.ts").read_text()) + list(APPS)
SLUGS = sys.argv[1:] or ALL

# The part of each page worth showing. Projects not listed use the first large
# element below the page intro.
SELECTORS = {
    "recipe-search": "#app",
    "skill-tree": "#skill-tree",
    "world-cuisine": ".frame",
    "transit": ".maplibregl-map",
}

# A state worth showing, for projects that open empty.
PATHS = {
    "recipe-search": "?with=ginger,tofu&site=woks",
}

FIRST_BIG = """() => {
  const els = [...(document.querySelector('main') || document.body).querySelectorAll('*')]
    .filter(e => { const r = e.getBoundingClientRect(); return r.width > 600 && r.height > 300 && r.top > 150; });
  els.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  if (els[0]) els[0].setAttribute('data-shot', '');
}"""

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    APPS_OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=os.environ.get("CHROME") or None,
            args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
        )
        for slug in SLUGS:
            # Dark mode, reduced motion so nothing is caught mid-animation.
            page = await browser.new_page(
                viewport={"width": 1280, "height": 900}, color_scheme="dark", reduced_motion="reduce"
            )
            url = APPS.get(slug) or f"https://kylepace.dev/{slug}/{PATHS.get(slug, '')}"
            await page.goto(url, wait_until="networkidle", timeout=60_000)
            if slug in APPS:
                await page.evaluate("""() => document.querySelectorAll('body *').forEach(e => {
                  if (getComputedStyle(e).position === 'fixed') e.style.visibility = 'hidden';
                })""")
                await page.wait_for_timeout(2000)
                await page.screenshot(path=str(APPS_OUT / f"{slug}.png"), clip={"x": 0, "y": 0, "width": 1280, "height": 800})
                print("saved", slug)
                await page.close()
                continue
            selector = SELECTORS.get(slug)
            if not selector:
                await page.evaluate(FIRST_BIG)
                selector = "[data-shot]"
            el = page.locator(selector).first
            # Hide floating controls (like the display settings button) and line the view up with the top.
            await page.add_style_tag(content="body *:is([style*='position: fixed'], .display-settings, .ds-trigger) { visibility: hidden !important; }")
            await page.evaluate("""() => document.querySelectorAll('body *').forEach(e => {
              if (getComputedStyle(e).position === 'fixed') e.style.visibility = 'hidden';
            })""")
            await el.evaluate("e => e.scrollIntoView({ block: 'start' })")
            await page.wait_for_timeout(4000)  # let maps, globes and canvases draw
            box = await el.bounding_box()
            height = min(box["height"], box["width"] * 10 / 16)
            await page.screenshot(
                path=str(OUT / f"{slug}.png"),
                clip={"x": box["x"], "y": box["y"], "width": box["width"], "height": height},
            )
            print("saved", slug)
            await page.close()
        await browser.close()

asyncio.run(main())
