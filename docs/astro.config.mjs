// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const autolinkConfig = {
  behavior: 'append',
  properties: {
    class: 'heading-anchor',
    ariaLabel: 'Link to this section',
  },
};

export default defineConfig({
  site: 'https://galaxyproject.github.io',
  base: '/galaxy-charts/',
  prefetch: {
    defaultStrategy: 'hover',
  },
  integrations: [
    vue(),
    mdx({
      rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, autolinkConfig]],
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, autolinkConfig]],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
