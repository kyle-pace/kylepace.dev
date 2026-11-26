import type { Status } from 'kp-design/components/StatusBadge.astro';

/*
  Every experiment listed on the home page. Each one lives in its own repo and deploys
  its own Worker, mounted at kylepace.dev/<slug>/ (README: "Adding a project").
  Adding an entry here only lists it; the project's own route is what serves it.
*/
export interface Project {
  /** The path it lives at: kylepace.dev/<slug>/ */
  slug: string;
  title: string;
  /** One or two sentences: what it is and what you can do with it. Shown on /labs/. */
  summary: string;
  /** One short line for the home page preview. Falls back to the summary. */
  blurb?: string;
  status: Status;
  /** An accent name from tokens.css (violet, sky, tangerine, ...). */
  accent: string;
  /** Month it started, like "November 2026". */
  started: string;
  /** The GitHub repo, as owner/name. */
  repo: string;
  /**
   * Describes the card's screenshot (src/assets/projects/<slug>.png, made by
   * scripts/screenshot-projects.py) for anyone who can't see it.
   */
  imageAlt?: string;
  /**
   * Where it lives, when it has outgrown kylepace.dev/<slug>/ for its own domain (Findish,
   * findish.now) or moved into another project (World cuisine, findish.now/explore/). The
   * slug stays as its id for the ship log and activity.
   */
  url?: string;
}

/** A project's address: its own domain if it has one, else kylepace.dev/<slug>/. */
export const projectHref = (p: Pick<Project, 'slug' | 'url'>) => p.url ?? `https://kylepace.dev/${p.slug}/`;

export const projects: Project[] = [
  {
    slug: 'cooking-reference',
    title: 'Cooking reference',
    blurb: 'What goes with what, plus ratios, blends and sauces.',
    summary:
      'Cook without a recipe. Pick an ingredient to see what it’s cooked with across thousands of recipes, scale 33 classic ratios from bread dough to brine, or make 40 spice blends, pastes and sauces from around the world.',
    status: 'in-progress',
    accent: 'pink',
    started: 'November 2026',
    repo: 'kyle-pace/cooking-reference',
    imageAlt:
      'A ruled list of what goes with pork, from soy sauce and Shaoxing wine down, each with a pink bar showing how strong the pairing is.',
  },
  {
    slug: 'skill-tree',
    title: 'Career skill tree',
    blurb: 'My career drawn as an RPG skill tree.',
    summary:
      'A UX bootcamp, product management, an MBA and a spin-off, drawn as an RPG skill tree. Pick a track, inspect a skill, or replay the whole career year by year.',
    status: 'in-progress',
    accent: 'violet',
    started: 'November 2026',
    repo: 'kyle-pace/skill-tree',
    imageAlt:
      'Career tracks listed down the left like binder tabs, beside small skill trees drawn on blueprint graph paper and a panel of quests in progress.',
  },
  {
    slug: 'world-cuisine',
    // Since 2026-11-26 it is finDish's Explore section; kylepace.dev/world-cuisine/ forwards there.
    url: 'https://findish.now/explore/',
    title: 'World cuisine',
    blurb: 'The world’s cuisines and dishes on one globe.',
    summary:
      'Wikipedia’s 600-plus cuisines and their dishes on one globe. Search an ingredient to see where in the world it’s cooked with, follow a dish to where it’s from, and find recipe sites and cookbooks to start cooking. It now lives inside finDish, as its Explore section.',
    status: 'in-progress',
    accent: 'tangerine',
    started: 'November 2026',
    // The repo kept its first name when the experiment was renamed World cuisine.
    repo: 'kyle-pace/cuisine-explorer',
    imageAlt: 'A globe turned to Europe, Africa and the Middle East, countries colored by continent, beside a search box and a list of nearby cuisines.',
  },
  {
    slug: 'world-transit',
    title: 'World transit',
    blurb: 'Every transit route on Earth, on one globe, live.',
    summary:
      'Every bus, train, tram and ferry route with an open schedule, 675,000 of them in 158 countries, on one globe you can spin and zoom into a single street, with vehicles moving live in over 750 cities and regions.',
    status: 'in-progress',
    accent: 'sky',
    started: 'November 2026',
    repo: 'kyle-pace/world-transit',
    imageAlt:
      'A dark globe over the North Atlantic, with Europe thick with colored transit lines and more along the US East Coast, beside a green sign reading World transit with search and a legend.',
  },
  {
    slug: 'recipe-search',
    url: 'https://findish.now/',
    title: 'Findish',
    blurb: 'One search box for the recipe sites I trust.',
    summary:
      'One search box across The Woks of Life, Hot Thai Kitchen, Smitten Kitchen and the YouTube channels of the cooks I learn from, from a small index of my own. Search by dish, by what you have or by creator; every result opens on the creator’s site.',
    status: 'in-progress',
    accent: 'mint',
    started: 'November 2026',
    repo: 'kyle-pace/recipe-search',
    imageAlt:
      'The finDish logo over a search box holding “from The Woks of Life”, “ginger” and “tofu” as tags, above rows of dish photos and recipe names.',
  },
  {
    slug: 'live-earth',
    title: 'Live Earth',
    blurb: 'The whole planet, live, from five weather satellites.',
    summary:
      'The newest pictures from five weather satellites spaced around the equator, as big as your screen allows: the whole Earth from any of them, or one of 40 regions from Alaska to Australia. Leave it open on a spare screen, or play back the last 12 hours.',
    status: 'in-progress',
    accent: 'sunshine',
    started: 'November 2026',
    repo: 'kyle-pace/live-earth',
    imageAlt:
      'The whole Earth from over the Americas on a black screen, beside controls for picking a satellite, a view and a time-lapse.',
  },
];
