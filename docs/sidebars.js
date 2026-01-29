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
      label: "Authentication",
      collapsed: false,
      items: ["authentication/oauth", "authentication/api-key"],
    },
    {
      type: "category",
      label: "V1 Endpoints",
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
      label: "V0 Endpoints (Legacy)",
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

