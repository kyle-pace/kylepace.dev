"""Takes a fresh screenshot of each experiment's main view (the tree, the globe,
the map) for the cards on the kylepace.dev home page. Saves 16:10 images to
src/assets/projects/<slug>.png; Astro turns them into small WebP files at build.

Usage: CHROME=/path/to/chrome python3 scripts/screenshot-projects.py [slug ...]
Needs Playwright for Python. Run it again whenever an experiment's look changes.
"""
import asyncio, os, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/assets/projects"
SLUGS = sys.argv[1:] or re.findall(r"slug: '([^']+)'", (ROOT / "src/data/projects.ts").read_text())

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
    "recipe-search": "?with=ginger,green-onion,tofu",
}

FIRST_BIG = """() => {
  const els = [...(document.querySelector('main') || document.body).querySelectorAll('*')]
    .filter(e => { const r = e.getBoundingClientRect(); return r.width > 600 && r.height > 300 && r.top > 150; });
  els.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  if (els[0]) els[0].setAttribute('data-shot', '');
}"""

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
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
            await page.goto(f"https://kylepace.dev/{slug}/{PATHS.get(slug, '')}", wait_until="networkidle", timeout=60_000)
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
