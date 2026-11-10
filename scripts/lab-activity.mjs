// Finds when each lab was last worked on, so the one I touched most recently sits first on
// the home page and /labs/. Writes src/data/activity.json: { "<slug>": "<ISO time>" }.
//
// "Worked on" means the newest commit in the lab's repo that a person made. Robots
// (github-actions[bot]: data refreshes, crawls, principles syncs) and fleet-wide chores
// (kp-design updates that touch every repo at once) don't count.
//
// Runs hourly in .github/workflows/lab-activity.yml, which commits the file when it changes;
// that push redeploys the site. Run it by hand with: node scripts/lab-activity.mjs
// (GITHUB_TOKEN is optional for public repos; private ones need a token that can read them.
// If a repo can't be read, its last known time is kept.)
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const outFile = new URL('src/data/activity.json', root);

// projects.ts is TypeScript; Node 22.18+ runs it directly by stripping the types.
const { projects } = await import(new URL('src/data/projects.ts', root).href);

const IGNORE_MESSAGES = /^(Sync principles|Update kp-design|Use kp-design|Merge |Redeploy)/;

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'kylepace.dev lab-activity',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function lastWorkedOn(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=50`, { headers });
  if (!res.ok) throw new Error(`${repo}: HTTP ${res.status}`);
  const commits = await res.json();
  const human = commits.find(
    (c) =>
      !(c.commit.author?.email ?? '').includes('[bot]') &&
      !(c.author?.type === 'Bot') &&
      !IGNORE_MESSAGES.test(c.commit.message),
  );
  return human?.commit.committer?.date ?? null;
}

let previous = {};
try {
  previous = JSON.parse(await readFile(outFile, 'utf8'));
} catch {}

const activity = {};
for (const p of projects) {
  try {
    activity[p.slug] = (await lastWorkedOn(p.repo)) ?? previous[p.slug] ?? null;
  } catch (err) {
    console.warn(`Kept the last known time for ${p.slug}: ${err.message}`);
    activity[p.slug] = previous[p.slug] ?? null;
  }
  if (!activity[p.slug]) delete activity[p.slug];
}

await writeFile(outFile, JSON.stringify(activity, null, 2) + '\n');
console.log(activity);
