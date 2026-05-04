export interface NavItem {
    label: string;
    href: string;
    external?: boolean;
}

export interface NavSection {
    title: string;
    items: NavItem[];
    /** If true, section starts expanded regardless of current path. */
    defaultOpen?: boolean;
}

export interface NavConfig {
    sections: NavSection[];
}

export interface SocialLink {
    label: string;
    href: string;
    /** Built-in icon name. Extend SocialLinks.astro to add more. */
    icon: "github" | "youtube" | "mastodon" | "linkedin" | "twitter" | "discord";
}

export interface SiteConfig {
    title: string;
    description: string;
    /** Path (or absolute URL) to the site logo (used by HomeLayout / future chrome). */
    logo: { src: string; alt: string };
    /** Path (or absolute URL) to the favicon. */
    favicon?: string;
    /** Short brand label shown next to the sidebar logo. */
    brand?: string;
    /** CSS color for the brand label. Falls back to `text-galaxy-gold`. */
    brandColor?: string;
}
