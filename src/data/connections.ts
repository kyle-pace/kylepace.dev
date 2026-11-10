import { projects } from './projects';

/*
  The repos whose approved outside hosts are listed on /connections/. Every
  experiment in projects.ts is included automatically; these are the sites and
  projects that aren't (yet) listed there. Only public repos work, since the list
  is read from GitHub when the site builds.
*/
const others = [
  { name: 'kylepace.dev', repo: 'kyle-pace/kylepace.dev', url: 'https://kylepace.dev/' },
  // Private repo, so kylepace.net publishes its own list.
  {
    name: 'kylepace.net',
    repo: 'kyle-pace/kylepace.net',
    url: 'https://kylepace.net/',
    listUrl: 'https://kylepace.net/allowed-hosts.txt',
  },
  // Private repo, so recipe search publishes its own list.
  {
    name: 'Recipe search',
    repo: 'kyle-pace/recipe-search',
    url: 'https://kylepace.dev/recipe-search/',
    listUrl: 'https://kylepace.dev/recipe-search/allowed-hosts.txt',
  },
];

export const connectionSources = [
  ...others,
  ...projects
    .filter((p) => !others.some((o) => o.repo === p.repo))
    .map((p) => ({ name: p.title, repo: p.repo, url: `https://kylepace.dev/${p.slug}/` })),
];
