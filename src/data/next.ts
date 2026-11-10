/*
  What I'm working on next, shown at the top of /log/ and on each lab's card on /labs/.
  Kept by hand. When something here ships, delete it and add a line to src/data/log.ts.

  - about: a lab's slug from projects.ts, an app's id from apps.ts, or 'site'.
  - text: one short line, written for visitors.
*/
export interface NextItem {
  about: string;
  text: string;
}

export const next: NextItem[] = [
  { about: 'world-cuisine', text: 'A game for learning the world’s cuisines.' },
  { about: 'recipe-search', text: 'More recipe sites, as I finish vetting them.' },
  { about: 'skill-tree', text: 'Turning it into the starting point for every new lab.' },
];
