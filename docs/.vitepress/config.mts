import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/galaxy-charts/",
  title: "Galaxy Charts",
  description: "Documentation for Galaxy Charts",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Galaxy Charts?', link: '/content/introduction' },
          { text: 'Getting Started', link: '/content/installation' },
          { text: 'Connect to Galaxy', link: '/content/configuration' },
        ]
      },
      {
        text: 'XML Wrapper',
        items: [
            { text: 'Introduction', link: '/content/xml-introduction' },
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
