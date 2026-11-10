import type { APIRoute } from 'astro';
import { entries } from '../../lib/log';

/*
  The ship log as an RSS feed, built as a static file at kylepace.dev/log/feed.xml.
  One item per log line; notes become the item's description.
*/
const SITE = 'https://kylepace.dev';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Noon in Seattle on the entry's day, in RSS's date format.
const pubDate = (d: string) => new Date(`${d}T12:00:00-08:00`).toUTCString();

export const GET: APIRoute = () => {
  const items = entries
    .slice(0, 50)
    .map((e) => {
      const link = `${SITE}/log/#${e.id}`;
      const description = e.notes?.length ? e.notes.join('\n\n') : e.text;
      return `    <item>
      <title>${escape(`${e.title}: ${e.text}`)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate(e.date)}</pubDate>
      <category>${escape(e.title)}</category>
      <description>${escape(description)}</description>
    </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>kylepace.dev ship log</title>
    <link>${SITE}/log/</link>
    <atom:link href="${SITE}/log/feed.xml" rel="self" type="application/rss+xml" />
    <description>What Kyle Pace shipped lately across his apps and labs.</description>
    <language>en-us</language>
${entries[0] ? `    <lastBuildDate>${pubDate(entries[0].date)}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
