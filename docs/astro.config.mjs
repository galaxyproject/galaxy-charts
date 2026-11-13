// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
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
    mdx(),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, autolinkConfig]],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
