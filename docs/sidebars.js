/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: ["intro", "developer-portal"],
    },
    {
      type: "category",
      label: "Kryptos Connect",
      collapsed: false,
      items: [
        "kryptos-connect/overview",
        "kryptos-connect/web-sdk",
        "kryptos-connect/mobile-sdk",
        "kryptos-connect/backend",
        "kryptos-connect/examples",
      ],
    },
    {
      type: "category",
      label: "Authentication",
      collapsed: false,
      items: ["authentication/oauth", "authentication/api-key"],
    },
    {
      type: "category",
      label: "Webhooks",
      collapsed: false,
      items: ["webhooks/setup", "webhooks/events"],
    },
    {
      type: "category",
      label: "Recipes",
      collapsed: false,
      items: ["recipes/post-transactions-apikey"],
    },
    {
      type: "category",
      label: "API Endpoints",
      collapsed: false,
      items: [
        "api/health",
        "api/userinfo",
        "api/holdings",
        "api/transactions",
        "api/defi-holdings",
        "api/nft-holdings",
        "api/profiling",
        "api/integrations",
      ],
    },
    {
      type: "category",
      label: "Public Endpoints",
      collapsed: false,
      items: ["public-endpoints/integrations"],
    },
    {
      type: "category",
      label: "Legacy (V0)",
      collapsed: true,
      items: [
        "api-legacy/wallets",
        "api-legacy/transactions",
        "api-legacy/nft-holdings",
        "api-legacy/defi-holdings",
      ],
    },
    {
      type: "category",
      label: "Reference",
      collapsed: false,
      items: ["reference/errors", "reference/types"],
    },
    "changelog",
  ],
};

export default sidebars;
