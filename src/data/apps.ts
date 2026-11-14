/*
  Kyle's apps, shown on /apps/ in this order. To add one, copy an entry.
  Moved here from kylepace.net on November 8, 2026 (kylepace.net/apps/ redirects here).

  - platforms: each place the app runs. status is live, beta or coming-soon; add url when
    there's somewhere to go. store: 'app-store' shows Apple's official badge, which links
    once status is live and there's a url. store: 'testflight' shows our own TestFlight
    badge (Apple has no official one) linking to the public TestFlight url; the badge names
    the devices (name) and a line under it says what TestFlight is.
  - icon: a square image in public/apps/ (leave it out to show the app's initial).
  - imageAlt: describes the home page screenshot of the app's site (src/assets/apps/<id>.png,
    made by scripts/screenshot-projects.py) for anyone who can't see it.
  - caseStudy: the full kylepace.net address of its case study. Add it once the case study
    is published there; until then nothing shows.
*/
export type AppStatus = 'live' | 'beta' | 'coming-soon';

export interface App {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  icon?: string;
  /** Describes the screenshot in src/assets/apps/<id>.png. */
  imageAlt?: string;
  /** An accent name from kp-design's tokens.css. */
  accent: string;
  platforms: { name: string; status: AppStatus; url?: string; label?: string; store?: 'app-store' | 'testflight' }[];
  caseStudy?: string;
}

export const apps: App[] = [
  {
    id: 'seattle-grocery-deals',
    name: 'Seattle Grocery Deals',
    tagline: 'Seattle grocery sales, sorted. Updated as each new flyer comes out.',
    summary:
      'The latest deals from Seattle’s Asian markets, seafood shops and co-ops in one place, with the standouts first. Search forgives typos and knows that scallions are green onions.',
    icon: '/apps/seattle-grocery-deals.svg',
    imageAlt:
      'The This week page on a deep blue background: a search box, store filters, a “Fresh off the press” note from a crow, and persimmons on sale at 99 Ranch.',
    accent: 'evening',
    platforms: [
      { name: 'Web', status: 'live', url: 'https://seattlegrocery.deals', label: 'seattlegrocery.deals' },
      {
        name: 'iPhone and iPad',
        status: 'beta',
        url: 'https://testflight.apple.com/join/NbQ9pXvw',
        store: 'testflight',
      },
    ],
  },
  {
    id: 'henwood',
    name: 'Henwood',
    tagline: 'Your pantry, your recipes, one friendly hen keeping track.',
    summary:
      'Keep track of what’s in your kitchen, save recipes from anywhere, and find out what you can cook with what you have. Just say what changed (“out of eggs, low on rice”), or ask Siri while your hands are full.',
    icon: '/apps/henwood.svg',
    imageAlt: 'A round brown hen above the word Henwood in a big serif, with a green Coming soon pill.',
    accent: 'sage',
    platforms: [{ name: 'iPhone, iPad and Mac', status: 'coming-soon', store: 'app-store' }],
  },
];
