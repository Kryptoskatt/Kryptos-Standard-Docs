// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Kryptos Connect",
  tagline: "API Documentation",
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
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Kryptos Connect",
      logo: {
        alt: "Kryptos",
        src: "img/logo.png",
      },
      items: [
        {
          href: "https://github.com/Kryptoskatt/Kryptos-Standard-Docs",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `© ${new Date().getFullYear()} Kryptos`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "typescript", "python", "php", "go"],
    },
  },
};

export default config;
