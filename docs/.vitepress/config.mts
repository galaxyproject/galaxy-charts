import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  appearance: "dark",
  base: "/galaxy-charts/",
  title: "Galaxy Charts",
  description: "Documentation for Galaxy Charts",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/galaxy-charts.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'GitHub', link: 'https://github.com/galaxyproject/galaxy-charts'},
    ],
    sidebar: [
      {
        text: 'Opening',
        items: [
          { text: 'What is Galaxy Charts?', link: '/content/introduction' },
          { text: 'Getting Started', link: '/content/installation' },
          { text: 'Connect to Galaxy', link: '/content/configuration' },
        ]
      },
      {
        text: 'Framework',
        items: [
            { text: 'Introduction', link: '/content/xml-introduction' },
            { text: 'Understanding', link: '/content/xml-framework' },
            { text: 'Data Sources', link: '/content/xml-datasources' },
            { text: 'Sections', link: '/content/xml-sections' },
            { text: 'Inputs', link: '/content/xml-inputs' },
        ]
      },
      {
        text: 'Vue Component',
        items: [
            { text: 'Introduction', link: '/content/vue-introduction' },
            { text: 'Utilities', link: '/content/vue-utilities' }
        ]
      },
      {
        text: 'Deploy to Galaxy',
        items: [
            { text: 'Build and Publish', link: '/content/deploy-plugin' },
            { text: 'Submit Pull Request', link: '/content/deploy-request' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/galaxyproject/galaxy-charts' }
    ]
  }
})
