// Reads text files from Kyle's public repos and sites. It runs at build time (the
// principles) or on Cloudflare's servers (the connections page), so visitors'
// browsers never contact GitHub. On Cloudflare, responses are cached for an hour.

const HOUR = 3600;

/** A text file from a URL, or null if it can't be read. */
export async function readText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      // Cloudflare-only option; ignored when this runs during the build.
      cf: { cacheTtl: HOUR, cacheEverything: true },
    } as RequestInit);
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

/** A file from a public repo's main branch, or null if it can't be read. */
export const readRepoFile = (repo: string, path: string, branch = 'main') =>
  readText(`https://raw.githubusercontent.com/${repo}/${branch}/${path}`);

export const repoUrl = (repo: string) => `https://github.com/${repo}`;
