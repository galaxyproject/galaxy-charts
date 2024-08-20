import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Galaxy Charts",
  description: "Documentation for Galaxy Charts",
  head: [
    [
        'link', {
            rel: 'stylesheet',
            href: 'https://unpkg.com/tailwindcss@2.0.4/dist/tailwind.min.css'
        }
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/content/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'What is Galaxy Charts?', link: '/content//what-is-charts' },
          { text: 'Installation', link: '/content/installation' },
          { text: 'Configuration', link: '/content/configuration' },
        ]
      },
      {
        text: 'Plugin XML Wrapper',
        items: [
            { text: 'Introduction', link: '/content//getting-started' },
            { text: 'Available Sections', link: '/content/getting-started' },
            { text: 'Available Inputs', link: '/content/input-elements' }
        ]
      },
      {
        text: 'Plugin Vue Wrapper',
        items: [
            { text: 'Introduction', link: '/content/getting-started' },
            { text: 'View Port', link: '/content/getting-started' },
            { text: 'Utilities', link: '/content/input-elements' }
        ]
      },
      {
        text: 'Deploy to Galaxy',
        items: [
            { text: 'Configure Datatype', link: '/content/getting-started' },
            { text: 'Integrate Plugin', link: '/content/input-elements' },
            { text: 'Create Pull Request', link: '/content/open-elements' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
