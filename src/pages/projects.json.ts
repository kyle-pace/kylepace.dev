import type { APIRoute } from 'astro';
import { labsByRecent } from '../lib/log';

/*
  The project list as JSON, built as a static file at kylepace.dev/projects.json.
  kylepace.net reads it when it builds, so its home page lists the same experiments
  as the hub without a second copy to keep in sync. Only public fields go out. The list is in
  the same order as /labs/: the one worked on most recently first.
*/
export const GET: APIRoute = () => {
  const body = labsByRecent().map(({ slug, title, summary, status, accent, started }) => ({
    slug,
    title,
    summary,
    status,
    accent,
    started,
    href: `https://kylepace.dev/${slug}/`,
  }));
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
