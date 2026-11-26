// @ts-check
import { themes as prismThemes } from "prism-react-renderer";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

/**
 * The OpenAPI theme's code samples (postman-code-generators) import Node's `path`, which webpack 5
 * no longer polyfills for the browser.
 */
function nodePathFallback() {
  return {
    name: "node-path-fallback",
    configureWebpack() {
      return { resolve: { fallback: { path: require.resolve("path-browserify") } } };
    },
  };
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Kryptos",
  tagline: "One API for all crypto portfolio data",
  favicon: "img/favicon.png",

  url: "https://docs.kryptos.io",
  baseUrl: "/",

  organizationName: "kryptoskatt",
  projectName: "kryptos-docs",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  headTags: [
    {
      tagName: "meta",
      attributes: {
        name: "keywords",
        content:
          "kryptos, kryptos api, crypto api, cryptocurrency api, portfolio api, " +
          "crypto portfolio tracker, blockchain api, defi api, nft api, " +
          "crypto tax api, crypto transactions api, crypto holdings api, " +
          "exchange api, wallet api, web3 api, crypto data api, " +
          "crypto integration, crypto connect, oauth crypto, " +
          "bitcoin api, ethereum api, solana api, " +
          "crypto developer tools, fintech api, digital asset api, " +
          "crypto analytics api, portfolio management api, " +
          "multi-chain api, cross-chain api, unified crypto api",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "description",
        content:
          "Kryptos API documentation — connect to 5,000+ exchanges, wallets, and blockchains. " +
          "Access crypto holdings, transactions, DeFi positions, NFTs, and tax data through one unified API.",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:title",
        content: "Kryptos API Documentation",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:description",
        content:
          "One API for all crypto portfolio data. Connect 5,000+ integrations across exchanges, wallets, and blockchains.",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:title",
        content: "Kryptos API Documentation",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:description",
        content:
          "One API for all crypto portfolio data. Connect 5,000+ integrations across exchanges, wallets, and blockchains.",
      },
    },
  ],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  themes: [
    "docusaurus-theme-openapi-docs",
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: "/docs",
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        explicitSearchResultPath: true,
      },
    ],
  ],

  plugins: [
    [
      // Free, MIT-licensed: generates one page per endpoint into docs/api-reference.
      // Regenerate after updating the spec: npm run gen-api
      "docusaurus-plugin-openapi-docs",
      {
        id: "api",
        docsPluginId: "classic",
        config: {
          kryptos: {
            // Generated from the backend specs by
            // backend-v2/apps/swagger-service/scripts/export-public-spec.ts
            specPath: "static/openapi/kryptos-public.json",
            outputDir: "docs/api-reference",
            downloadUrl: "/openapi/kryptos-public.json",
            hideSendButton: false,
            showSchemas: false,
            sidebarOptions: {
              groupPathsBy: "tagGroup",
              categoryLinkSource: "tag",
              sidebarCollapsed: true,
            },
          },
        },
      },
    ],
    "docusaurus-plugin-sass",
    nodePathFallback,
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.js",
          docItemComponent: "@theme/ApiItem",
          // Generated tag pages replaced by the hand-written resource pages (TAG_PAGES in sidebars.js).
          exclude: [
            "api-reference/{assets,contacts,counterparties,holdings,integrations,labels-types,ledgers,portfolios,providers,spam,transactions,users}.tag.mdx",
          ],
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
        },
      },
    ],
  ],

  themeConfig: {
    image: "img/logo.png",
    metadata: [
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#10b981" },
      { name: "twitter:card", content: "summary" },
    ],
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Kryptos",
      logo: {
        alt: "Kryptos",
        src: "img/logo.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          label: "Guides",
          position: "left",
        },
        {
          type: "docSidebar",
          sidebarId: "apiReference",
          label: "API Reference",
          position: "left",
        },
        {
          to: "/docs/changelog",
          label: "Changelog",
          position: "left",
        },
        {
          href: "https://dashboard.kryptos.io/",
          label: "Developer Portal",
          position: "right",
        },
        {
          href: "https://github.com/Kryptoskatt/Kryptos-Standard-Docs",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Documentation",
          items: [
            { label: "Getting Started", to: "/docs/intro" },
            { label: "Authentication", to: "/docs/authentication/oauth" },
            { label: "API Reference", to: "/docs/api-reference/kryptos-api" },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "Developer Portal",
              href: "https://dashboard.kryptos.io/",
            },
            { label: "GitHub", href: "https://github.com/Kryptoskatt" },
            { label: "Changelog", to: "/docs/changelog" },
          ],
        },
        {
          title: "Support",
          items: [
            { label: "Email Support", href: "mailto:support@kryptos.io" },
            { label: "Website", href: "https://kryptos.io" },
          ],
        },
      ],
      copyright: `\u00A9 ${new Date().getFullYear()} Kryptos. All rights reserved.`,
    },
    // Code samples on the generated API pages, in this order (curl first).
    languageTabs: [
      { highlight: "bash", language: "curl", logoClass: "curl" },
      { highlight: "javascript", language: "nodejs", logoClass: "nodejs", variant: "axios" },
      { highlight: "python", language: "python", logoClass: "python", variant: "requests" },
      { highlight: "go", language: "go", logoClass: "go" },
      { highlight: "php", language: "php", logoClass: "php" },
      { highlight: "java", language: "java", logoClass: "java", variant: "unirest" },
    ],
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "bash",
        "json",
        "typescript",
        "python",
        "php",
        "go",
        "java",
      ],
    },
  },
};

export default config;
