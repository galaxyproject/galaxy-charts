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
      { text: 'Examples', link: '/content/examples' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'What is Galaxy Charts?', link: '/content/introduction' },
          { text: 'Installation', link: '/content/installation' },
          { text: 'Connect to Galaxy Instance', link: '/content/configuration' },
        ]
      },
      {
        text: 'Visualization XML Wrapper',
        items: [
            { text: 'Introduction', link: '/content/xml-introduction' },
            { text: 'Available Sections', link: '/content/xml-sections' },
            { text: 'Available Inputs', link: '/content/xml-inputs' }
        ]
      },
      {
        text: 'Visualization Vue Wrapper',
        items: [
            { text: 'Introduction', link: '/content/vue-introduction' },
            { text: 'View Port', link: '/content/vue-component' },
            { text: 'Utilities', link: '/content/vue-utilities' }
        ]
      },
      {
        text: 'Deploy to Galaxy',
        items: [
            { text: 'Configure Datatype', link: '/content/deploy-datatype' },
            { text: 'Integrate Plugin', link: '/content/deploy-plugin' },
            { text: 'Create Pull Request', link: '/content/deploy-request' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
