import type { SiteConfig, SocialLink } from "./types";

export const site: SiteConfig = {
    title: "Galaxy Charts",
    description: "Documentation for Galaxy Charts — develop, test and deploy JavaScript plugins for Galaxy.",
    logo: {
        src: "galaxy-charts-logo.svg",
        srcDark: "galaxy-charts-logo-white.svg",
        alt: "Galaxy Charts",
    },
};

export const social: SocialLink[] = [
    { label: "GitHub", href: "https://github.com/galaxyproject/galaxy-charts", icon: "github" },
];
