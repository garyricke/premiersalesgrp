// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical production domain for Premier Sales Group.
export default defineConfig({
  site: 'https://premiersalesgrp.com',
  integrations: [
    sitemap({
      // Keep noindex utility pages out of the sitemap
      filter: (page) =>
        !page.endsWith('/thank-you/') && !page.endsWith('/status/'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
