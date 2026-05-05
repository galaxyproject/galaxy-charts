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
    /** Site logo. `src` is the light-mode variant; `srcDark` (optional) is the
     *  dark-mode variant and the variant forced on always-dark surfaces (the
     *  landing-page brand chip). When `srcDark` is omitted, `src` is used in
     *  both themes.
     */
    logo: { src: string; srcDark?: string; alt: string };
    /** Path (or absolute URL) to the favicon. */
    favicon?: string;
}
