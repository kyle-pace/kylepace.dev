// Ties the ship log (src/data/log.ts), what's next (src/data/next.ts) and each lab's last
// commit (src/data/activity.json) to the apps and labs they're about, and works out what was
// worked on most recently.
import { projects, type Project } from '../data/projects';
import { apps, type App } from '../data/apps';
import { log, type LogEntry } from '../data/log';
import { next } from '../data/next';
import activity from '../data/activity.json';

export interface Subject {
  /** The short name the log shows: the lab's slug, the app's id, or kylepace.dev. */
  label: string;
  title: string;
  href: string;
  accent?: string;
}

export function subjectFor(about: string): Subject {
  const lab = projects.find((p) => p.slug === about);
  if (lab) return { label: lab.slug, title: lab.title, href: `/${lab.slug}/`, accent: lab.accent };
  const app = apps.find((a) => a.id === about);
  if (app) return { label: app.id, title: app.name, href: `/apps/#${app.id}`, accent: app.accent };
  return { label: 'kylepace.dev', title: 'kylepace.dev', href: '/' };
}

export interface ResolvedEntry extends LogEntry {
  /** A stable anchor on /log/, like "2026-11-09-recipe-search-2". */
  id: string;
  label: string;
  href: string;
  accent?: string;
  title: string;
}

/** Every log entry, newest first, with its name, link and anchor filled in. */
export const entries: ResolvedEntry[] = (() => {
  const sorted = log
    .map((entry, i) => ({ entry, i }))
    .sort((a, b) => b.entry.date.localeCompare(a.entry.date) || a.i - b.i)
    .map(({ entry }) => entry);
  const seen = new Map<string, number>();
  return sorted.map((entry) => {
    const subject = subjectFor(entry.about);
    const base = `${entry.date}-${entry.about}`;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return {
      ...entry,
      id: n === 1 ? base : `${base}-${n}`,
      label: entry.label ?? subject.label,
      href: entry.href ?? subject.href,
      accent: subject.accent,
      title: subject.title,
    };
  });
})();

/** What's next, with the name and link of what each item is about. */
export const upNext = next.map((item) => ({ ...item, ...subjectFor(item.about) }));

export const latestEntryFor = (about: string) => entries.find((e) => e.about === about);
export const nextFor = (about: string) => next.filter((n) => n.about === about);

/**
 * When something was last worked on, in milliseconds: the newer of its last commit made by a
 * person (labs only, refreshed hourly) and its newest log entry (counted from the start of
 * that day in Seattle, so a commit later the same day still wins). 0 if neither exists.
 */
export function lastWorkedOn(about: string): number {
  const commit = (activity as Record<string, string>)[about];
  const entry = latestEntryFor(about);
  return Math.max(
    commit ? Date.parse(commit) : 0,
    entry ? Date.parse(`${entry.date}T00:00:00-08:00`) : 0,
  );
}

/** Sorts by most recently worked on. Ties, and things with no history, keep their order. */
export function byRecent<T>(items: T[], about: (item: T) => string): T[] {
  return items
    .map((item, i) => ({ item, i, t: lastWorkedOn(about(item)) }))
    .sort((a, b) => b.t - a.t || a.i - b.i)
    .map(({ item }) => item);
}

export const labsByRecent = (): Project[] => byRecent(projects, (p) => p.slug);
export const appsByRecent = (): App[] => byRecent(apps, (a) => a.id);

// Dates, shown in Seattle time so a late-night commit lands on the day it happened here.
const TZ = 'America/Los_Angeles';
const asDate = (d: string | number) => (typeof d === 'number' ? new Date(d) : new Date(`${d}T12:00:00-08:00`));

/** "nov 09", for the terminal on the home page. */
export const shortDate = (d: string | number) =>
  asDate(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', timeZone: TZ }).toLowerCase();

/** "November 9". */
export const longDate = (d: string | number) =>
  asDate(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: TZ });

/** "2026-11-09", for datetime attributes. */
export const isoDate = (d: string | number) =>
  asDate(d).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ });
