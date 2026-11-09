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
}

export const projects: Project[] = [
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
      'A stats card for a Director of Product, a row of career tracks, and branching skill trees for Hospitality, Project to Product and Design.',
  },
  {
    slug: 'world-cuisine',
    title: 'World cuisine',
    blurb: 'The world’s cuisines and dishes on one globe.',
    summary:
      'Wikipedia’s 600-plus cuisines and their dishes on one globe. Search an ingredient to see where in the world it’s cooked with, follow a dish to where it’s from, and find recipe sites and cookbooks to start cooking.',
    status: 'in-progress',
    accent: 'tangerine',
    started: 'November 2026',
    repo: 'kyle-pace/world-cuisine',
    imageAlt: 'A globe turned to East Asia and the Pacific, beside a search box and a list of nearby cuisines.',
  },
  {
    slug: 'transit',
    title: 'Washington transit, live',
    blurb: 'Every bus, train and ferry in Washington, live.',
    summary:
      'Every bus, train and ferry in Washington that reports where it is, on one zoomable map with every route and stop. Positions refresh every 15 seconds.',
    status: 'in-progress',
    accent: 'sky',
    started: 'November 2026',
    repo: 'kyle-pace/wa-transit-map',
    imageAlt: 'A dark map of the Puget Sound region, crisscrossed by colored transit routes and vehicle dots.',
  },
  {
    slug: 'recipe-search',
    title: 'Recipe search',
    blurb: 'One search box for the recipe sites I trust.',
    summary:
      'One search box across The Woks of Life, Hot Thai Kitchen and Smitten Kitchen, from a small index of my own. Search by dish, or add what you have and see what it makes; every result opens on the creator’s site.',
    status: 'in-progress',
    accent: 'mint',
    started: 'November 2026',
    repo: 'kyle-pace/recipe-search',
    imageAlt: 'A recipe search field above a grid of dish photos, each with its cooking time and the site it comes from.',
  },
];
