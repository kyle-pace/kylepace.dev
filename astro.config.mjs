// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// kylepace.dev: the hub for Kyle's experiments. This repo only serves the home page and
// the shared pages (privacy, 404). Each experiment is its own repo and Worker, mounted
// at kylepace.dev/<slug>/ by a Cloudflare route (see README: "Adding a project").
// Static by default; a route can opt into server rendering with `export const prerender = false`.
export default defineConfig({
  site: 'https://kylepace.dev',
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  session: false,
  adapter: cloudflare({ imageService: 'compile' }),
});
