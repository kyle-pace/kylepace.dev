/*
  Kyle's apps, shown on /apps/ in this order. To add one, copy an entry.
  Moved here from kylepace.net on November 8, 2026 (kylepace.net/apps/ redirects here).

  - platforms: each place the app runs. status is live, beta or coming-soon; add url when
    there's somewhere to go. store: 'app-store' shows Apple's official badge, which links
    once status is live and there's a url.
  - icon: a square image in public/apps/ (leave it out to show the app's initial).
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
  /** An accent name from kp-design's tokens.css. */
  accent: string;
  platforms: { name: string; status: AppStatus; url?: string; label?: string; store?: 'app-store' }[];
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
    accent: 'evening',
    platforms: [
      { name: 'Web', status: 'live', url: 'https://seattlegrocery.deals', label: 'seattlegrocery.deals' },
      { name: 'iPhone', status: 'coming-soon', store: 'app-store' },
    ],
  },
  {
    id: 'henwood',
    name: 'Henwood',
    tagline: 'Your pantry, your recipes, one friendly hen keeping track.',
    summary:
      'Keep track of what’s in your kitchen, save recipes from anywhere, and find out what you can cook with what you have. Just say what changed (“out of eggs, low on rice”), or ask Siri while your hands are full.',
    icon: '/apps/henwood.svg',
    accent: 'sage',
    platforms: [{ name: 'iPhone, iPad and Mac', status: 'coming-soon', store: 'app-store' }],
  },
];
