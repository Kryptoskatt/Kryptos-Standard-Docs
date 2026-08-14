# Kryptos Documentation

Source for the Kryptos developer documentation site.

**📖 Read the docs: [docs.kryptos.io](https://docs.kryptos.io)**

---

## What's in this repo

| Path | Contents |
| --- | --- |
| `docs/` | The Docusaurus site — all published documentation lives here |
| `types/` | TypeScript type definitions for API request and response shapes |

The site is the single source of truth. Start at
[docs.kryptos.io/docs/api/overview](https://docs.kryptos.io/docs/api/overview) for the base URL,
authentication, response envelopes and error codes.

## Quick reference

- **Base URL:** `https://api-v2.kryptos.io`
- **Authentication:** `Authorization: Bearer <access_token>`, or `x-api-key` for enterprise keys
- **API reference:** [docs.kryptos.io/docs/api/overview](https://docs.kryptos.io/docs/api/overview)
- **Kryptos Connect:** [docs.kryptos.io/docs/kryptos-connect/overview](https://docs.kryptos.io/docs/kryptos-connect/overview)
- **OAuth 2.0:** [docs.kryptos.io/docs/authentication/oauth](https://docs.kryptos.io/docs/authentication/oauth)
- **Migrating from `connect.kryptos.io/api`:** [migration guide](https://docs.kryptos.io/docs/api/migrating-from-connect-apis)

## Running the site locally

```bash
cd docs
npm install
npm start          # dev server with hot reload
npm run build      # production build — also validates every internal link
```

`onBrokenLinks` is set to `throw`, so `npm run build` fails on a dead internal link. Run it before
opening a pull request.

## Contributing

Documentation pages are hand-written Markdown under `docs/docs/`. When adding or renaming a page:

1. Give it a frontmatter `id:` — `docs/sidebars.js` references pages by id, not filename.
2. Add it to `docs/sidebars.js`.
3. Run `npm run build` to confirm no links broke.

## Support

- **Email:** [support@kryptos.io](mailto:support@kryptos.io)
- **Developer Portal:** [dashboard.kryptos.io](https://dashboard.kryptos.io)
- **Website:** [kryptos.io](https://kryptos.io)
