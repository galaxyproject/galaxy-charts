export interface HeroAction {
    text: string;
    href: string;
    variant?: "brand" | "alt";
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
    /** Gold accent line shown between the title and the description. */
    subtitle?: string;
    description: string;
    /** SVG path `d` attribute for the icon. Rendered inside a styled tile. */
    iconPath?: string;
}

export interface FeaturesHeader {
    title?: string;
    /** Optional italicized tail of the title (e.g. "everyone" in
        "Data intensive science for *everyone*"). */
    emphasis?: string;
    tagline?: string;
}

export const hero: HeroConfig = {
    name: "Galaxy Visualization",
    text: "Plugin Framework",
    tagline: "Develop, Test and Deploy JavaScript Visualizations",
    actions: [
        { text: "What is Galaxy Charts?", href: "/introduction", variant: "brand" },
        { text: "Examples", href: "/example-igv", variant: "alt" },
    ],
};

export const featuresHeader: FeaturesHeader = {
    // title: "...",
    // emphasis: "...",
    // tagline: "...",
};

// Heroicons-outline style SVG paths.
const ICON_MONITOR =
    "M9.75 17l-.5 3-1 1h7.5l-1-1-.5-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z";
const ICON_LINK =
    "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1";
const ICON_UPLOAD = "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12";

export const features: Feature[] = [
    {
        title: "Standalone",
        subtitle: "No Galaxy required for development",
        description:
            "Build your visualization in an independent, standalone environment with modern tools like Vite and Vue 3.",
        iconPath: ICON_MONITOR,
    },
    {
        title: "Data Access",
        subtitle: "Connect to any Galaxy instance",
        description: "Connect to local or public Galaxy instances to test your visualization with real-world data.",
        iconPath: ICON_LINK,
    },
    {
        title: "Deployment",
        subtitle: "One step to publish",
        description: "When your visualization is ready, deploy it to Galaxy for use by researchers worldwide.",
        iconPath: ICON_UPLOAD,
    },
];
