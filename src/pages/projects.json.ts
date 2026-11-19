import type { APIRoute } from 'astro';
import { labsByRecent } from '../lib/log';
import { projectHref } from '../data/projects';

/*
  The project list as JSON, built as a static file at kylepace.dev/projects.json.
  kylepace.net's home page reads it on each visit, so it lists the same experiments
  as the hub without a second copy to keep in sync. Only public fields go out. The list is in
  the same order as /labs/: the one worked on most recently first.
*/
export const GET: APIRoute = () => {
  const body = labsByRecent().map(({ slug, url, title, summary, status, accent, started }) => ({
    slug,
    title,
    summary,
    status,
    accent,
    started,
    href: projectHref({ slug, url }),
  }));
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
