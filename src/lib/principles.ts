// The development principles, pulled from github.com/kyle-pace/principles when the
// site builds (through src/lib/github.ts), so visitors never contact GitHub.
//
// If GitHub can't be reached, it falls back to the copy synced into this repo's
// AGENTS.md (the principles workflow keeps it current, and each sync commit triggers
// a rebuild, so the page stays up to date either way).

import { readFileSync } from 'node:fs';
import { marked } from 'marked';
import { readRepoFile, repoUrl } from './github';

export const REPO_URL = repoUrl('kyle-pace/principles');

function readSyncedCopy(): string | null {
  try {
    const agents = readFileSync(new URL('../../AGENTS.md', import.meta.url), 'utf8');
    const start = agents.indexOf('-->', agents.indexOf('<!-- BEGIN principles'));
    const end = agents.indexOf('<!-- END principles -->');
    return start !== -1 && end > start ? agents.slice(start + 3, end) : null;
  } catch {
    return null;
  }
}

/**
 * The principles as HTML, ready for the page. Drops the top heading and the opening
 * paragraph (the page has its own), and turns each `###` section into an `h3` with an
 * id so sections can be linked.
 */
export async function getPrinciples(): Promise<{ html: string; fromGitHub: boolean }> {
  const fromGitHub = await readRepoFile('kyle-pace/principles', 'principles.md');
  const markdown = fromGitHub ?? readSyncedCopy() ?? '';

  const body = markdown
    .replace(/^\s*## Development principles\s*\n+/, '')
    .replace(/^[^#\n][^\n]*\n+/, ''); // the "These apply to every project..." intro

  const renderer = new marked.Renderer();
  renderer.heading = ({ tokens, depth }) => {
    const text = marked.Parser.parseInline(tokens);
    const plain = text.replace(/<[^>]+>/g, '');
    const id = plain
      .toLowerCase()
      .replace(/&[a-z#0-9]+;/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };

  return { html: await marked.parse(body, { renderer }), fromGitHub: fromGitHub !== null };
}
