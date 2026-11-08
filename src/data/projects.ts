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
  /** One or two sentences: what it is and what you can do with it. */
  summary: string;
  status: Status;
  /** An accent name from tokens.css (violet, sky, tangerine, ...). */
  accent: string;
  /** Month it started, like "November 2026". */
  started: string;
  /** The GitHub repo, as owner/name. */
  repo: string;
}

export const projects: Project[] = [
  {
    slug: 'skill-tree',
    title: 'Career skill tree',
    summary:
      'A UX bootcamp, product management, an MBA and a spin-off, drawn as an RPG skill tree. Pick a track, inspect a skill, or replay the whole career year by year.',
    status: 'in-progress',
    accent: 'violet',
    started: 'November 2026',
    repo: 'kyle-pace/skill-tree',
  },
  {
    slug: 'world-cuisine',
    title: 'World cuisine',
    summary:
      'Wikipedia’s 600-plus cuisines and their dishes on one globe. Search an ingredient to see where in the world it’s cooked with, follow a dish to where it’s from, and find recipe sites and cookbooks to start cooking.',
    status: 'in-progress',
    accent: 'tangerine',
    started: 'November 2026',
    repo: 'kyle-pace/world-cuisine',
  },
  {
    slug: 'transit',
    title: 'Washington transit, live',
    summary:
      'Every bus, train and ferry in Washington that reports where it is, on one zoomable map with every route and stop. Positions refresh every 15 seconds.',
    status: 'in-progress',
    accent: 'sky',
    started: 'November 2026',
    repo: 'kyle-pace/wa-transit-map',
  },
];
