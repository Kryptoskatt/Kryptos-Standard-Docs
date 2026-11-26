import generatedApi from "./docs/api-reference/sidebar";

/**
 * Two separate sidebars:
 *  - docs: guides, organised by use case. No endpoint lists here.
 *  - apiReference: endpoints only. Generated from static/openapi/kryptos-public.json (npm run gen-api).
 */

const API_INFO_ID = "api-reference/kryptos-api";

/**
 * Hand-written resource pages. A page whose tag exists becomes that tag's landing page (click the
 * tag to read the overview, expand it for the endpoints), so nothing is listed twice. Pages with no
 * tag of their own are listed at the top of their group.
 */
const TAG_PAGES = {
  Integrations: "api/integrations",
  Providers: "api/providers",
  Portfolios: "api/portfolios",
  Transactions: "api/transactions",
  Ledgers: "api/ledgers",
  "Labels & Types": "api/labels",
  Spam: "api/spam",
  Contacts: "api/contacts",
  Counterparties: "api/counterparties",
  Holdings: "api/holdings",
  Assets: "api/assets",
  Users: "api/userinfo",
};
const GROUP_PAGES = {
  "Portfolio & balances": ["api/defi", "api/nfts"],
};
/** Every hand-written resource page; any not attached to a generated group is listed under "Other resources". */
const ALL_RESOURCE_PAGES = [
  ...new Set([...Object.values(TAG_PAGES), ...Object.values(GROUP_PAGES).flat()]),
];

/** The generated groups: info page removed (it is listed first instead), resource pages attached. */
const endpointGroups = (groups) =>
  groups
    .filter((item) => !(item.type === "doc" && item.id === API_INFO_ID))
    .map((group) => {
      if (group.type !== "category") return group;
      const tags = group.items
        .filter((item) => !(item.type === "doc" && item.id === API_INFO_ID))
        .map((tag) =>
          tag.type === "category" && TAG_PAGES[tag.label]
            ? { ...tag, link: { type: "doc", id: TAG_PAGES[tag.label] } }
            : tag
        );
      return { ...group, items: [...(GROUP_PAGES[group.label] ?? []), ...tags] };
    });

/** Resource pages for endpoints outside the reference (OAuth, Connect and API-key only). */
const otherResources = (groups) => {
  const attached = new Set();
  for (const group of groups) {
    for (const item of group.items ?? []) {
      if (typeof item === "string") attached.add(item);
      if (item.link?.id) attached.add(item.link.id);
    }
  }
  const rest = ALL_RESOURCE_PAGES.filter((id) => !attached.has(id));
  return rest.length
    ? [{ type: "category", label: "Other resources (OAuth, Connect, API keys)", collapsed: true, items: rest }]
    : [];
};

const apiGroups = endpointGroups(generatedApi);

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
      label: "Integrations API",
      collapsed: false,
      items: [
        "integrations-api/overview",
        "integrations-api/quickstart",
      ],
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
    { type: "doc", id: "authentication/oauth", label: "Sign in with Kryptos (OAuth)" },
    { type: "doc", id: "authentication/api-key", label: "API keys" },
    {
      type: "category",
      label: "AI Plugins",
      collapsed: false,
      items: ["mcp/chatgpt", "mcp/mcp-overview"],
    },
    {
      type: "category",
      label: "Webhooks",
      collapsed: false,
      items: ["webhooks/setup", "webhooks/events"],
    },
  ],

  apiReference: [
    {
      type: "category",
      label: "Overview",
      collapsed: false,
      items: [
        { type: "doc", id: API_INFO_ID, label: "Introduction" },
        "api/overview",
        "api/access-matrix",
        "reference/errors",
        "reference/types",
        "api/migrating-from-connect-apis",
      ],
    },
    ...apiGroups,
    ...otherResources(apiGroups),
  ],
};

export default sidebars;
