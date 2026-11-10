/*
  The ship log on the home page: what changed lately across everything on kylepace.dev.
  Kept by hand so each line reads well; commit messages are written for the repo, not
  for visitors. Newest first. The home page shows the first five.

  - project: the short name shown in the log (a repo-style slug reads best).
  - href: where the line goes. Use the project's page, or a more specific one.
  - date: YYYY-MM-DD.
*/
export interface LogEntry {
  date: string;
  project: string;
  href: string;
  text: string;
}

export const log: LogEntry[] = [
  {
    date: '2026-11-09',
    project: 'recipe-search',
    href: '/recipe-search/',
    text: 'Recipes people open often rank a little higher, with creators mixed in.',
  },
  {
    date: '2026-11-08',
    project: 'recipe-search',
    href: '/recipe-search/',
    text: 'Added Alton Brown, from his site and his YouTube channel.',
  },
  {
    date: '2026-11-08',
    project: 'henwood',
    href: 'https://henwood.app/claude/',
    text: 'Henwood in Claude: a Mac experiment for asking about your pantry.',
  },
  {
    date: '2026-11-08',
    project: 'labs',
    href: '/labs/',
    text: 'The skill tree, transit map and world cuisine moved here, each with its own look.',
  },
  {
    date: '2026-11-07',
    project: 'grocery-deals',
    href: 'https://seattlegrocery.deals/',
    text: 'A new look for Seattle Grocery Deals: a crow and a Puget evening palette.',
  },
];
