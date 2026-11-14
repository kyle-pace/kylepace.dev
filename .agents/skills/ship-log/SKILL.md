---
name: ship-log
description: Add an entry to kylepace.dev's ship log, or update what's up next. Use after shipping something a visitor would notice on any of Kyle's apps, labs or the site itself, and whenever asked to log, announce or note a change.
---

# The ship log

The ship log is the site's running blog: `src/data/log.ts` feeds the home page terminal, `/log/` and the RSS feed at `/log/feed.xml`. `src/data/next.ts` is the short "up next" list.

## When to add a line

Add one when a visitor or user would notice the change: a new feature, a new lab or app, a public beta, a redesign, a new data source. Skip fixes nobody saw, refactors, dependency and kp-design bumps, and small copy or link changes.

Leave out anything Kyle hasn't linked publicly yet (a draft, an unannounced app, a private repo). If unsure, ask.

## How to write it

Add the entry at the top of the `log` array (newest first):

```ts
{
  date: '2026-11-13',            // the day it shipped, YYYY-MM-DD
  about: 'seattle-grocery-deals', // a lab's slug (projects.ts), an app's id (apps.ts), or 'site'
  text: 'One line saying what changed for the person using it.',
  notes: ['Optional paragraphs: why, what was hard, what comes next.'],
  href: 'https://…',              // optional: where the line links, if not the project's page
},
```

- `text` is for visitors, not for the repo. "You can now search by ingredient", not "Add ingredient index".
- Plain language. If a term needs explaining (TestFlight, RSS), explain it in the line.
- Write in Kyle's voice, first person where it fits ("my other food projects").
- A lab's newest entry moves it up the home page and `/labs/`, so the date matters.

## Up next

If the change finishes something in `src/data/next.ts`, delete that item. If it changes what's coming, update the list. Keep each item to one short line.

Then `npm run build` and push.
