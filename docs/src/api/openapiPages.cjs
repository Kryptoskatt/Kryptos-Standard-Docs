/**
 * Page generators for docusaurus-plugin-openapi-docs (`markdownGenerators` in docusaurus.config.js).
 * They run at `npm run gen-api`, so the API Reference keeps these pages when it is regenerated.
 *
 *  - createInfoPageMD: the API Reference landing page. The default shows a version badge, the raw
 *    spec description and one tab per security scheme; this one leads with what you need to make a
 *    first call (base URL, the two credentials and where each applies, a curl example).
 *  - createApiPageMD: the default endpoint page, minus the description line when the spec has none
 *    (the plugin then repeats the title there).
 */
const markdown = require("docusaurus-plugin-openapi-docs/lib/markdown");

const BASE_URL = "https://api-v2.kryptos.io/v1";
const CONNECT_URL = "https://connect-api.kryptos.io";

/** Header name of an apiKey security scheme, if the spec has it. */
function headerOf(securitySchemes, key, fallback) {
  const scheme = securitySchemes && securitySchemes[key];
  return scheme && scheme.in === "header" && scheme.name ? scheme.name : fallback;
}

function createInfoPageMD({ info, securitySchemes, downloadUrl }) {
  const title = (info && info.title) || "Kryptos API";
  const clientIdHeader = headerOf(securitySchemes, "clientId", "X-Client-Id");
  const clientSecretHeader = headerOf(securitySchemes, "clientSecret", "X-Client-Secret");

  return `import Heading from "@theme/Heading";

<Heading as={"h1"} className={"openapi__heading"} children={${JSON.stringify(title)}}></Heading>

<p className="kp-api-lead">
  Create a workspace for each of your customers, connect their wallets and exchanges, and read their
  transactions and holdings, all with one token.
</p>

<div className="kp-api-facts">
  <div className="kp-api-fact">
    <span className="kp-api-fact__label">Base URL</span>
    <code>{${JSON.stringify(BASE_URL)}}</code>
  </div>
  <div className="kp-api-fact">
    <span className="kp-api-fact__label">Authentication</span>
    <code>Authorization: Bearer &lt;workspace token&gt;</code>
  </div>
  <div className="kp-api-fact">
    <span className="kp-api-fact__label">Start here</span>
    <span>
      <a href="/docs/integrations-api/quickstart">Quickstart</a> ·{" "}
      <a href="/docs/integrations-api/overview">Overview</a>
    </span>
  </div>
</div>

## Authentication

<div className="kp-api-auth">

| Credential | Send it as | Use it for |
| --- | --- | --- |
| **Workspace token** | \`Authorization: Bearer <token>\` | Every endpoint in this reference except Workspace management. Lasts 24 hours. |
| **Client ID and secret** | \`${clientIdHeader}\` and \`${clientSecretHeader}\` headers | **Workspace management**: creating workspaces, issuing fresh tokens, limits and revocation, on \`${CONNECT_URL}\` |

</div>

Keep the client secret on your server. Workspace tokens are safe to cache for their 24 hours; get a
fresh one with \`POST /developer/workspaces/{workspace_id}/token\`.

## Your first call

\`\`\`bash
curl "${BASE_URL}/transactions?limit=50" \\
  -H "Authorization: Bearer $WORKSPACE_TOKEN"
\`\`\`

Response shapes, pagination and error codes are the same across endpoints: see the
[API Overview](/docs/api/overview) and [Error codes](/docs/reference/errors).

<p className="kp-api-download">
  <a href="${downloadUrl || "/openapi/kryptos-public.json"}" download>Download the OpenAPI spec</a> to
  generate a client or import it into Postman.
</p>
`;
}

function createApiPageMD(page) {
  const { title, api } = page;
  const repeatsTitle =
    api && typeof api.description === "string" && api.description.trim() === String(title).trim();
  return markdown.createApiPageMD(
    repeatsTitle ? { ...page, api: { ...api, description: undefined } } : page
  );
}

module.exports = { createInfoPageMD, createApiPageMD };
