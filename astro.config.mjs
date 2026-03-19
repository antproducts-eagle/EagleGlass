import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), '');
const sanityProjectId = env.PUBLIC_SANITY_PROJECT_ID;
const hasSanity = sanityProjectId && sanityProjectId !== 'YOUR_PROJECT_ID';

const integrations = [react()];

// Only add Sanity Studio integration when configured
if (hasSanity) {
  const { default: sanity } = await import('@sanity/astro');
  integrations.push(
    sanity({
      projectId: sanityProjectId,
      dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
      useCdn: true,
      studioBasePath: '/studio',
    })
  );
}

export default defineConfig({
  adapter: vercel(),
  integrations,
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'nl', 'fr', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
