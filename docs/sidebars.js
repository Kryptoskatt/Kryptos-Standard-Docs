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
        "kryptos-connect/css-theming",
        "kryptos-connect/backend",
        "kryptos-connect/examples",
        "kryptos-connect/demo-apps",
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
      label: "API Reference",
      collapsed: false,
      items: [
        "api/overview",
        "api/userinfo",
        {
          type: "category",
          label: "Portfolio",
          collapsed: false,
          items: ["api/holdings", "api/defi", "api/nfts"],
        },
        {
          type: "category",
          label: "Transactions",
          collapsed: false,
          items: [
            "api/transactions",
            "api/ledgers",
            "api/labels",
            "api/spam",
          ],
        },
        {
          type: "category",
          label: "Integrations",
          collapsed: false,
          items: ["api/integrations", "api/providers", "api/portfolios"],
        },
        {
          type: "category",
          label: "Reference Data",
          collapsed: false,
          items: ["api/assets", "api/contacts", "api/counterparties"],
        },
        "api/migrating-from-connect-apis",
      ],
    },
    {
      type: "category",
      label: "MCP Server",
      collapsed: false,
      items: ["mcp/mcp-overview"],
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
