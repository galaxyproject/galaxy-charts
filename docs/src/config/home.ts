export interface HeroAction {
  text: string;
  href: string;
  variant?: 'brand' | 'alt';
}

export interface HeroConfig {
  /** Eyebrow text above the headline (e.g. "Galaxy Visualization"). */
  name?: string;
  text: string;
  tagline?: string;
  actions?: HeroAction[];
}

export interface Feature {
  title: string;
  details: string;
  /** Emoji or short string rendered as the icon. */
  icon?: string;
}

export const hero: HeroConfig = {
  name: 'Galaxy Visualization',
  text: 'Plugin Framework',
  tagline: 'Develop, Test and Deploy JavaScript Visualizations',
  actions: [
    { text: 'What is Galaxy Charts?', href: '/introduction', variant: 'brand' },
    { text: 'Examples', href: '/example-igv', variant: 'alt' },
  ],
};

export const features: Feature[] = [
  {
    title: 'Standalone',
    details:
      'Build your visualization in an independent, standalone environment with modern tools like Vite and Vue 3.',
    icon: '🖥️',
  },
  {
    title: 'Data Access',
    details: 'Connect to local or public Galaxy instances to test your visualization with real-world data.',
    icon: '🔗',
  },
  {
    title: 'Deployment',
    details: 'When your visualization is ready, deploy it to Galaxy for use by researchers worldwide.',
    icon: '🚀',
  },
];
