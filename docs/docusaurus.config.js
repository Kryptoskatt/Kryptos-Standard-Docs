// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Kryptos Connect API",
  tagline: "Comprehensive API for cryptocurrency portfolio data",
  favicon: "img/favicon.png",

  url: "https://docs.kryptos.io",
  baseUrl: "/",

  organizationName: "kryptoskatt",
  projectName: "kryptos-docs",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          editUrl:
            "https://github.com/kryptoskatt/Kryptos-Standard-Docs/edit/main/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/kryptos-social-card.png",
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "Kryptos Connect",
        logo: {
          alt: "Kryptos Logo",
          src: "img/logo.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docs",
            position: "left",
            label: "Documentation",
          },
          {
            href: "https://github.com/Kryptoskatt/Kryptos-Standard-Docs",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              { label: "Getting Started", to: "/" },
              { label: "Authentication", to: "/authentication/oauth" },
              { label: "API Reference", to: "/api/health" },
            ],
          },
          {
            title: "Resources",
            items: [
              { label: "TypeScript Types", to: "/reference/types" },
              { label: "Error Codes", to: "/reference/errors" },
            ],
          },
          {
            title: "More",
            items: [
              { label: "Kryptos.io", href: "https://kryptos.io" },
              { label: "GitHub", href: "https://github.com/Kryptoskatt/Kryptos-Standard-Docs" },
              { label: "Support", href: "mailto:support@kryptos.io" },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Kryptos. All rights reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["bash", "json", "typescript", "python"],
      },
      algolia: undefined,
    }),
};

export default config;
