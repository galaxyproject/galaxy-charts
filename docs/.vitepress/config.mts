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
          { text: 'Examples', link: '/content/examples' },
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
            { text: 'Component Usage', link: '/content/vue-component' },
            { text: 'Additional Utilities', link: '/content/vue-utilities' }
        ]
      },
      {
        text: 'Deploy to Galaxy',
        items: [
            { text: 'Configure Data Source', link: '/content/deploy-datasource' },
            { text: 'Build and Link Plugin', link: '/content/deploy-plugin' },
            { text: 'Create Pull Request', link: '/content/deploy-request' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
