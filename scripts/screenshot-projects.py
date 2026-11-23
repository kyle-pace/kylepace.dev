"""Takes a fresh screenshot of each experiment's main view (the tree, the globe,
the map), and of each app's site, for the cards on the home page and /labs/.
Saves 16:10 images to src/assets/projects/<slug>.png and src/assets/apps/<id>.png;
Astro turns them into small WebP files at build.

Usage:
  python3 scripts/screenshot-projects.py [slug-or-app-id ...]   # these, or all of them
  python3 scripts/screenshot-projects.py --changed              # only the ones that look out of date

--changed retakes a lab when src/data/activity.json says it was worked on after its card
was last taken, an app once its card is a month old, and anything with no card yet. That's
what .github/workflows/card-screenshots.yml runs every day, so cards keep up on their own.

Every run also:
- records when each card was checked in src/data/screenshots.json
- keeps the old image if the new one comes out blank or fails to load, and exits with an
  error so the workflow run goes red instead of publishing a broken card
- keeps the old image if the new one looks the same, so nothing churns
- re-renders any share card in design/og-*.html that shows a card that changed
  (fonts come from node_modules, so run `npm ci` first)

Needs Playwright and Pillow for Python (pip install playwright pillow) and Node 22.18+.
Set CHROME=/path/to/chrome to use a Chrome that's already installed.
"""
import asyncio, json, os, subprocess, sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from PIL import Image, ImageChops, ImageStat
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/assets/projects"
APPS_OUT = ROOT / "src/assets/apps"
TAKEN_FILE = ROOT / "src/data/screenshots.json"
ACTIVITY_FILE = ROOT / "src/data/activity.json"

# Apps live on their own sites. Each shot is the top of the page, as a visitor first sees it.
APPS = {
    "seattle-grocery-deals": "https://seattlegrocery.deals/",
    "henwood": "https://henwood.app/",
}
# Apps have no activity feed here, so their cards are retaken once they're this old.
APP_MAX_AGE = timedelta(days=30)

# The part of each page worth showing. Projects not listed use the first large
# element below the page intro.
SELECTORS = {
    "skill-tree": "#skill-tree",
    "world-cuisine": ".frame",
    "world-transit": ".frame",
    "live-earth": "[data-viewer]",
}

# Projects shot from the top of the page, like the apps, because the whole first screen
# is the app (Findish: the logo, the search box and the first results).
TOP_OF_PAGE = {"recipe-search"}

# A state worth showing, for projects that open empty.
PATHS = {
    "world-transit": "?at=-25,42,2.2",  # the whole globe: North America, Europe and Africa
    "live-earth": "?sat=east&view=earth",  # the Americas; the workflow runs in their daytime
    "world-cuisine": "?lng=30",  # Europe, Africa and Asia, not open ocean
    "recipe-search": "?with=ginger,tofu&site=woks",
    "cooking-reference": "#pork",  # what goes with pork
}

# Projects that load their main picture after the page is up: wait until this is true.
READY = {
    "live-earth": "document.querySelector('[data-status]')?.hidden && !document.querySelector('.is-loading')",
}

FIRST_BIG = """() => {
  const els = [...(document.querySelector('main') || document.body).querySelectorAll('*')]
    .filter(e => { const r = e.getBoundingClientRect(); return r.width > 600 && r.height > 300 && r.top > 150; });
  els.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  if (els[0]) els[0].setAttribute('data-shot', '');
}"""

HIDE_FIXED = """() => document.querySelectorAll('body *').forEach(e => {
  if (getComputedStyle(e).position === 'fixed') e.style.visibility = 'hidden';
})"""

# A new image counts as blank below this much contrast (standard deviation of its grey
# levels, 0 to 255), and as unchanged below this average difference from the old one.
MIN_CONTRAST = 8
MIN_CHANGE = 1.5


def load_projects():
    """projects.ts is TypeScript; Node 22.18+ runs it directly by stripping the types."""
    code = "const { projects } = await import(process.argv[1]); console.log(JSON.stringify(projects));"
    out = subprocess.run(
        ["node", "--input-type=module", "-e", code, (ROOT / "src/data/projects.ts").as_uri()],
        check=True, capture_output=True, text=True,
    ).stdout
    return {p["slug"]: p for p in json.loads(out)}


def read_json(path):
    try:
        return json.loads(path.read_text())
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def parse_time(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00")) if s else None


def out_of_date(names, taken, activity, now):
    picked = []
    for name in names:
        last = parse_time(taken.get(name))
        if last is None:
            picked.append(name)
        elif name in APPS:
            if now - last > APP_MAX_AGE:
                picked.append(name)
        elif (worked := parse_time(activity.get(name))) and worked > last:
            picked.append(name)
    return picked


def url_for(name, projects):
    if name in APPS:
        return APPS[name]
    p = projects[name]
    base = p.get("url") or f"https://kylepace.dev/{name}/"
    return base + PATHS.get(name, "")


def image_path(name):
    return (APPS_OUT if name in APPS else OUT) / f"{name}.png"


async def shoot(browser, name, projects, dest):
    # Dark mode, reduced motion so nothing is caught mid-animation.
    page = await browser.new_page(
        viewport={"width": 1280, "height": 900}, color_scheme="dark", reduced_motion="reduce"
    )
    try:
        response = await page.goto(url_for(name, projects), wait_until="networkidle", timeout=60_000)
        if response and not response.ok:
            raise RuntimeError(f"HTTP {response.status}")
        if name in APPS or name in TOP_OF_PAGE:
            await page.evaluate(HIDE_FIXED)
            await page.wait_for_timeout(3000)
            await page.screenshot(path=str(dest), clip={"x": 0, "y": 0, "width": 1280, "height": 800})
            return
        selector = SELECTORS.get(name)
        if not selector:
            await page.evaluate(FIRST_BIG)
            selector = "[data-shot]"
        el = page.locator(selector).first
        # Hide floating controls (like the display settings button) and line the view up with the top.
        await page.add_style_tag(content="body *:is([style*='position: fixed'], .display-settings, .ds-trigger) { visibility: hidden !important; }")
        await page.evaluate(HIDE_FIXED)
        await el.evaluate("e => e.scrollIntoView({ block: 'start' })")
        if name in READY:
            await page.wait_for_function(READY[name], timeout=90_000)
        await page.wait_for_timeout(4000)  # let maps, globes and canvases draw
        box = await el.bounding_box()
        if not box:
            raise RuntimeError(f"nothing matched {selector}")
        height = min(box["height"], box["width"] * 10 / 16)
        await page.screenshot(
            path=str(dest), clip={"x": box["x"], "y": box["y"], "width": box["width"], "height": height}
        )
    finally:
        await page.close()


def judge(new, old):
    """'blank', 'same' or 'changed'."""
    with Image.open(new) as img:
        grey = img.convert("L")
        if ImageStat.Stat(grey).stddev[0] < MIN_CONTRAST:
            return "blank"
        if not old.exists():
            return "changed"
        with Image.open(old) as before:
            if before.size != img.size:
                return "changed"
            diff = ImageChops.difference(grey, before.convert("L"))
            return "same" if ImageStat.Stat(diff).mean[0] < MIN_CHANGE else "changed"


def share_cards_showing(changed):
    """Share cards that show a changed card image, as design/og-<name>.html -> public/og-<name>.png."""
    return [
        html for html in sorted((ROOT / "design").glob("og-*.html"))
        if any(f"/{image_path(n).parent.name}/{n}.png" in html.read_text() for n in changed)
    ]


async def main():
    args = sys.argv[1:]
    projects = load_projects()
    everything = list(projects) + list(APPS)
    taken = read_json(TAKEN_FILE)
    now = datetime.now(timezone.utc)

    if args == ["--changed"]:
        names = out_of_date(everything, taken, read_json(ACTIVITY_FILE), now)
    else:
        unknown = [a for a in args if a not in everything]
        if unknown:
            sys.exit(f"Not a lab or app: {', '.join(unknown)}")
        names = args or everything

    if not names:
        print("Every card is up to date.")
        return

    OUT.mkdir(parents=True, exist_ok=True)
    APPS_OUT.mkdir(parents=True, exist_ok=True)
    changed, failed = [], []
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=os.environ.get("CHROME") or None,
            args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
        )
        for name in names:
            dest = image_path(name)
            new = dest.with_suffix(".new.png")
            try:
                await shoot(browser, name, projects, new)
                verdict = judge(new, dest)
            except Exception as err:  # one bad page never stops the rest
                verdict = f"failed ({err})"
            if verdict == "changed":
                new.replace(dest)
                changed.append(name)
            else:
                new.unlink(missing_ok=True)
            if verdict in ("changed", "same"):
                taken[name] = now.strftime("%Y-%m-%dT%H:%M:%SZ")
            else:
                failed.append(name)
            print(f"{name}: {verdict}")

        for html in share_cards_showing(changed):
            page = await browser.new_page(viewport={"width": 1200, "height": 630})
            await page.goto(html.as_uri(), wait_until="networkidle")
            await page.wait_for_timeout(500)
            png = ROOT / "public" / html.with_suffix(".png").name
            await page.screenshot(path=str(png))
            await page.close()
            print(f"re-rendered {png.relative_to(ROOT)}")
        await browser.close()

    TAKEN_FILE.write_text(json.dumps(dict(sorted(taken.items())), indent=2) + "\n")
    if failed:
        sys.exit(f"Kept the old card for: {', '.join(failed)}")


asyncio.run(main())
