import type { NavConfig } from './types';

export const nav: NavConfig = {
  topLinks: [{ label: 'Home', href: '/' }],
  sections: [
    {
      title: 'Introduction',
      defaultOpen: true,
      items: [
        { label: 'What is Galaxy Charts?', href: '/introduction' },
        { label: 'Getting Started', href: '/installation' },
        { label: 'Connect to Galaxy', href: '/configuration' },
      ],
    },
    {
      title: 'Examples',
      items: [
        { label: 'IGV', href: '/example-igv' },
        { label: 'JupyterLite', href: '/example-jupyterlite' },
        { label: 'Kepler.gl', href: '/example-kepler' },
        { label: 'Niivue', href: '/example-niivue' },
        { label: 'Plotly', href: '/example-plotly' },
        { label: 'Vitessce', href: '/example-vitessce' },
        { label: 'All Visualizations', href: 'https://usegalaxy.org/visualizations', external: true },
      ],
    },
    {
      title: 'Framework',
      items: [
        { label: 'Introduction', href: '/xml-introduction' },
        { label: 'Understanding', href: '/xml-framework' },
        { label: 'Data Sources', href: '/xml-datasources' },
        { label: 'Sections', href: '/xml-sections' },
        { label: 'Inputs', href: '/xml-inputs' },
      ],
    },
    {
      title: 'Vue Component',
      items: [
        { label: 'Introduction', href: '/vue-introduction' },
        { label: 'Utilities', href: '/vue-utilities' },
      ],
    },
    {
      title: 'Deploy to Galaxy',
      items: [
        { label: 'Build and Publish', href: '/deploy-plugin' },
        { label: 'Submit Pull Request', href: '/deploy-request' },
      ],
    },
  ],
};
