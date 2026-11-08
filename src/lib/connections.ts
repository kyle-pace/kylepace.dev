// Reads each project's list of approved outside hosts (.agents/allowed-hosts.txt)
// from GitHub at build time, for the /connections/ page.
//
// The file format comes from github.com/kyle-pace/principles: one host per line,
// with the comment lines right above it saying what it's for and when Kyle
// approved it, e.g.
//
//   # Cookbook cover images on cuisine pages. Approved by Kyle, 2026-11-08.
//   covers.openlibrary.org

import { readRepoFile, readText, repoUrl } from './github';

export interface Approval {
  host: string;
  /** What it's for, in Kyle's words, without the "Approved by" part. */
  purpose: string;
  /** YYYY-MM-DD, if the note has one. */
  approved?: string;
  /** Approved "for now", to revisit later. */
  provisional: boolean;
}

export interface Source {
  name: string;
  repo: string;
  url?: string;
  /** Where the list is published, for private repos (otherwise read from GitHub). */
  listUrl?: string;
}

export interface ProjectConnections extends Source {
  /** Where people can read the raw list (absent when the project has none). */
  listLink?: string;
  /** null when the list couldn't be read at build time. */
  approvals: Approval[] | null;
}

export function parseAllowedHosts(text: string): Approval[] {
  const approvals: Approval[] = [];
  let notes: string[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) {
      notes = []; // a blank line ends a comment block
      continue;
    }
    if (line.startsWith('#')) {
      notes.push(line.replace(/^#\s*/, ''));
      continue;
    }
    const host = line.replace(/#.*/, '').trim().toLowerCase();
    if (!host) continue;
    const note = notes.join(' ');
    const date = note.match(/\b(\d{4}-\d{2}-\d{2})\b/)?.[1];
    const purpose = note.replace(/\s*Approved by Kyle.*$/i, '').trim();
    approvals.push({
      host,
      purpose: purpose || 'No note given.',
      approved: date,
      provisional: /for now/i.test(note),
    });
    notes = [];
  }
  return approvals;
}

export async function getConnections(sources: Source[]): Promise<ProjectConnections[]> {
  return Promise.all(
    sources.map(async (s) => {
      const source = { ...s, listLink: s.listUrl ?? `${repoUrl(s.repo)}/blob/main/.agents/allowed-hosts.txt` };
      if (s.listUrl) {
        const text = await readText(s.listUrl);
        return { ...source, approvals: text === null ? null : parseAllowedHosts(text) };
      }
      const text = await readRepoFile(s.repo, '.agents/allowed-hosts.txt');
      // A missing file means nothing has been approved; GitHub answers 404 for both
      // a missing file and an unreachable repo, so check the repo's AGENTS.md too.
      if (text === null) {
        const reachable = (await readRepoFile(source.repo, 'AGENTS.md')) !== null;
        return { ...source, listLink: undefined, approvals: reachable ? [] : null };
      }
      return { ...source, approvals: parseAllowedHosts(text) };
    }),
  );
}
