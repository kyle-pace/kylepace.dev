/*
  The ship log: what changed lately across everything on kylepace.dev. The home page shows
  the newest five lines; /log/ shows all of it, with any notes, and /log/feed.xml is its RSS
  feed. Kept by hand so each line reads well; commit messages are written for the repo, not
  for visitors. Newest first (entries on the same day keep the order written here).

  - date: YYYY-MM-DD.
  - about: what it's about. A lab's slug from projects.ts ('transit'), an app's id from
    apps.ts ('henwood'), or 'site' for kylepace.dev itself. A lab's newest entry also counts
    toward how high it sits on the home page and /labs/ (src/lib/log.ts).
  - text: one line, shown everywhere. Say what changed for the person using it.
  - notes: optional paragraphs, shown under the line on /log/ and in the feed. This is where
    the story goes: why, what was hard, what's next.
  - href: optional. Where the line links, when it isn't the project's own page.
  - label: optional. The short name shown in the log, when it isn't the slug or id.

  What's coming next lives in src/data/next.ts.
*/
export interface LogEntry {
  date: string;
  about: string;
  text: string;
  notes?: string[];
  href?: string;
  label?: string;
}

export const log: LogEntry[] = [
  {
    date: '2026-11-14',
    about: 'site',
    text: 'Three labs now have a page that shows how they work: the transit map, the skill tree and World cuisine.',
    notes: [
      'Each one walks through where its information comes from and the steps it takes to reach your screen, in the lab’s own style. The transit map’s is a line with six stops, the skill tree’s is a five-tier build order, and World cuisine’s is a recipe. Recipe search already had one.',
      'Find them under About on each lab: kylepace.dev/transit/about/, kylepace.dev/skill-tree/about/ and kylepace.dev/world-cuisine/about/.',
    ],
    href: 'https://kylepace.dev/labs/',
  },
  {
    date: '2026-11-13',
    about: 'seattle-grocery-deals',
    text: 'The iPhone and iPad app is in public beta. Anyone can try it free through TestFlight, Apple’s app for testing apps early.',
    href: 'https://testflight.apple.com/join/NbQ9pXvw',
  },
  {
    date: '2026-11-09',
    about: 'recipe-search',
    text: 'Recipe sites now come from one vetted list that all my food projects share.',
    notes: [
      'Recipe search used to keep its own list of sites. Now it reads the same list as my other food projects, so a site I vet once can show up everywhere.',
    ],
  },
  {
    date: '2026-11-09',
    about: 'world-cuisine',
    text: 'Fixed dish photos that weren’t loading on the globe.',
  },
  {
    date: '2026-11-09',
    about: 'recipe-search',
    text: 'A quieter search page, especially in dark mode.',
  },
  {
    date: '2026-11-09',
    about: 'recipe-search',
    text: 'Recipes people open often rank a little higher, with creators mixed in.',
  },
  {
    date: '2026-11-08',
    about: 'recipe-search',
    text: 'Added Alton Brown, from his site and his YouTube channel.',
  },
  {
    date: '2026-11-08',
    about: 'henwood',
    href: 'https://henwood.app/claude/',
    text: 'Henwood in Claude: a Mac experiment for asking about your pantry.',
  },
  {
    date: '2026-11-08',
    about: 'skill-tree',
    text: 'The skill tree stands on its own now, with a character-sheet look.',
  },
  {
    date: '2026-11-08',
    about: 'site',
    label: 'labs',
    href: '/labs/',
    text: 'The skill tree, transit map and world cuisine moved here, each with its own look.',
  },
  {
    date: '2026-11-07',
    about: 'seattle-grocery-deals',
    label: 'grocery-deals',
    href: 'https://seattlegrocery.deals/',
    text: 'A new look for Seattle Grocery Deals: a crow and a Puget evening palette.',
  },
];
