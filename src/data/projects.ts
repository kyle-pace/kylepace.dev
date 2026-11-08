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

export const projects: Project[] = [];
