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
    date: '2026-11-15',
    about: 'world-transit',
    text: 'New lab: World transit, every transit route on Earth with an open schedule on one globe, with live vehicles in over 750 cities. It replaces the Washington map.',
    notes: [
      'It started as the Washington live map and kept going: every open schedule in the three big catalogs, OpenStreetMap lines where countries publish none, and live feeds from Seattle to Helsinki to Sydney, 675,000 routes in all. The hard part was making a planet of routes readable, so trains stay bold, buses go quiet until you zoom in to a street, and the world view draws each rail corridor once. Search for a city or an agency, or try Somewhere random. Old /transit/ links now open the globe on Puget Sound.',
    ],
  },
  {
    date: '2026-11-15',
    about: 'live-earth',
    text: 'New lab: Live Earth, the whole planet as five weather satellites see it right now, from the Americas to Africa to Australia.',
    notes: [
      'It started as a question about live satellite wallpaper. GOES pictures from NOAA came first, then Meteosat from EUMETSAT, which only serves flat maps, so the browser bends each one back into a round planet. Himawari comes from CIRA, the lab that invented GeoColor, as tiles that a tiny server stitches together. Five satellites ring the equator, so between them you can see everywhere but the poles.',
    ],
  },
  {
    date: '2026-11-14',
    about: 'world-cuisine',
    text: 'World cuisine lists every ingredient in one place: all 1,344, each under the part of the world where it’s most at home.',
    notes: [
      'Lemongrass lands in Southeast Asia, suet in the British Isles and pasta in Southern Europe; garlic, sugar and eggs are all over the world. Filter by part of the world, switch to A to Z, or type to find one. It took three tries in one night: a map of dots that was too crowded, then shelves of what’s cooked together that felt arbitrary, then this.',
    ],
    href: 'https://kylepace.dev/world-cuisine/ingredients/',
  },
  {
    date: '2026-11-14',
    about: 'world-cuisine',
    text: 'Ingredient pages now link to recipes: palm sugar shows 143 recipes with it, one tap into Recipe search.',
    notes: [
      'World cuisine names its ingredients the way Wikipedia does, which is not how anyone shops: "Maize", "Agaricus bisporus". Each one is now matched to the same grocery list Recipe search and my other food projects use, so they finally agree on what corn is. Building it turned up 32 everyday groceries that list was missing, sugar and vinegar among them, which also means Recipe search now matches more of every recipe.',
    ],
  },
  {
    date: '2026-11-14',
    about: 'site',
    text: 'New labs now start from a template: one command gives me a working, checked page with its own address, About page and share card.',
    notes: [
      'Every lab here is its own small site on its own corner of kylepace.dev. Setting one up used to mean copying pieces from the skill tree by hand. The template is a lab with placeholder names; a setup script fills in the real ones, and it already passes the same accessibility and layout checks as every other page.',
      'The code is public if you want to see how a lab is put together.',
    ],
    href: 'https://github.com/kyle-pace/lab-template',
  },
  {
    date: '2026-11-14',
    about: 'site',
    text: 'Every lab now has an About page that shows how it works: the transit map, the skill tree, World cuisine and Recipe search.',
    notes: [
      'They all use the same sections, in the same order: what it is, how it works step by step, where the data comes from, privacy, and how to get in touch. Each one keeps its lab’s own look: the transit map’s steps run down a transit line, and the skill tree’s sit on graph paper.',
      'Find them under About on each lab.',
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
