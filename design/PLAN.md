# kylepace.dev hub: design notes

The hub shares kylepace.net's look (kp-design tokens, Atkinson, display settings). Its own
twist is a terminal: a path above each page's headline and the `git log` on the home page.

## Ship log (/log/)

- **Subject and reader:** a running devlog for people curious what I'm building, and for me
  to keep myself honest about what's next.
- **One bold element:** each entry hangs off a stripe in its project's own accent color, so
  the page reads as a column of colored threads, one per project, over time.
- **Colors:** the existing tokens. Each project's accent (violet skill tree, tangerine world
  cuisine, sky transit, mint recipe search, sage Henwood, evening Grocery Deals) on `--bg`.
- **Up next is dashed,** like the outline of something not built yet; shipped work is solid.
- **Layout:** dates down a left rail on wide screens (sticky as you scroll a long day), entries
  to the right, capped near 70 characters. On phones the date sits above its entries.

```
~/log
Ship log
lede + RSS
┌ ─ ─ Up next ─ ─ ─ ─ ─ ─ ┐
  world-cuisine   ...
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
Nov 9   │ recipe-search
2026    │ The line, bold
        │ notes, muted
        │ world-cuisine
        │ ...
```
