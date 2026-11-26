import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "Workspace management",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "api-reference/kryptos-api",
        },
        {
          type: "category",
          label: "Workspace management",
          link: {
            type: "doc",
            id: "api-reference/workspace-management",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/create-an-integrations-api-workspace",
              label: "Create an Integrations API workspace",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/issue-a-fresh-workspace-token",
              label: "Issue a fresh workspace token",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/update-a-grants-transaction-limit",
              label: "Update a grant's transaction limit",
              className: "api-method patch",
            },
            {
              type: "doc",
              id: "api-reference/list-your-active-grants",
              label: "List your active grants",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/revoke-a-grant",
              label: "Revoke a grant",
              className: "api-method post",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Integrations & syncs",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "api-reference/kryptos-api",
        },
        {
          type: "category",
          label: "Providers",
          link: {
            type: "doc",
            id: "api-reference/providers",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/list-providers",
              label: "List providers",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/get-provider-by-id",
              label: "Get provider by ID",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Integrations",
          link: {
            type: "doc",
            id: "api-reference/integrations",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/list-integrations",
              label: "List integrations",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/create-integration-auto-triggers-sync-for-api-integrations",
              label: "Create integration (auto-triggers sync for API integrations)",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/most-recent-sync-time-for-a-workspace",
              label: "Most recent sync time for a workspace",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/test-credentials-before-creating-an-integration-pre-create-flow",
              label: "Test credentials before creating an integration (pre-create flow)",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/delete-multiple-integrations-in-one-request",
              label: "Delete multiple integrations in one request",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/get-integration-by-id",
              label: "Get integration by ID",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/update-integration",
              label: "Update integration",
              className: "api-method patch",
            },
            {
              type: "doc",
              id: "api-reference/delete-integration-soft-delete-triggers-data-wipe-worker",
              label: "Delete integration (soft delete, triggers data wipe worker)",
              className: "api-method delete",
            },
            {
              type: "doc",
              id: "api-reference/test-credentials-for-existing-integration-post-create-flow",
              label: "Test credentials for existing integration (post-create flow)",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/trigger-incremental-sync-for-an-integration",
              label: "Trigger incremental sync for an integration",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/resync-an-integration-incremental-by-default-from-scratch-or-over-a-given-time-range-on-request",
              label: "Resync an integration (incremental by default; from scratch or over a given time range on request)",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Credentials",
          link: {
            type: "doc",
            id: "api-reference/credentials",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/validate-credentials-without-saving",
              label: "Validate credentials without saving",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/update-credentials-for-an-integration-validates-before-storing",
              label: "Update credentials for an integration (validates before storing)",
              className: "api-method put",
            },
            {
              type: "doc",
              id: "api-reference/detect-active-evm-chains-for-a-wallet-address",
              label: "Detect active EVM chains for a wallet address",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/check-credential-validity-expiry-status",
              label: "Check credential validity / expiry status",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Sync",
          link: {
            type: "doc",
            id: "api-reference/sync",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/list-sync-history",
              label: "List sync history",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/get-sync-job-status",
              label: "Get sync job status",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/cancel-a-running-sync",
              label: "Cancel a running sync",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "CSV",
          link: {
            type: "doc",
            id: "api-reference/csv",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/upload-one-or-more-csv-tsv-xlsx-files-or-zi-ps-storage-only-does-not-start-processing",
              label: "Upload one or more CSV/TSV/XLSX files or ZIPs (storage only — does NOT start processing)",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/get-a-signed-url-to-upload-one-csv-xls-xlsx-file-without-multipart",
              label: "Get a signed URL to upload one CSV/XLS/XLSX file without multipart",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/record-a-file-put-to-a-csv-upload-url-url-as-an-upload",
              label: "Record a file PUT to a /csv/upload-url URL as an upload",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/trigger-processing-of-already-uploaded-csv-files",
              label: "Trigger processing of already-uploaded CSV files",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/replay-a-past-csv-sync-destructive",
              label: "Replay a past CSV sync (destructive)",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/list-csv-upload-history",
              label: "List CSV upload history",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/get-upload-status",
              label: "Get upload status",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/delete-a-csv-upload",
              label: "Delete a CSV upload",
              className: "api-method delete",
            },
            {
              type: "doc",
              id: "api-reference/get-signed-url-to-download-parse-error-csv-404-if-no-errors",
              label: "Get signed URL to download parse-error CSV (404 if no errors)",
              className: "api-method get",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Transactions",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "api-reference/kryptos-api",
        },
        {
          type: "category",
          label: "Labels & Types",
          link: {
            type: "doc",
            id: "api-reference/labels-types",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/list-canonical-transaction-labels-with-type-tax-event",
              label: "List canonical transaction labels (with type + tax event)",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/list-transaction-types-with-their-labels",
              label: "List transaction types (with their labels)",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Transactions",
          link: {
            type: "doc",
            id: "api-reference/transactions",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/list-transactions-with-ledgers",
              label: "List transactions with ledgers",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/create-manual-transaction",
              label: "Create manual transaction",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/bulk-update-transactions",
              label: "Bulk update transactions",
              className: "api-method patch",
            },
            {
              type: "doc",
              id: "api-reference/bulk-delete-transactions",
              label: "Bulk delete transactions",
              className: "api-method delete",
            },
            {
              type: "doc",
              id: "api-reference/batch-write-transactions-import",
              label: "Batch write transactions (import)",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api-reference/get-transaction-with-ledgers",
              label: "Get transaction with ledgers",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/update-transaction-label-notes-tags-or-toggle-a-reconciliation-review-flag",
              label: "Update transaction label/notes/tags, or toggle a reconciliation review flag",
              className: "api-method patch",
            },
            {
              type: "doc",
              id: "api-reference/delete-transaction",
              label: "Delete transaction",
              className: "api-method delete",
            },
          ],
        },
        {
          type: "category",
          label: "Ledgers",
          link: {
            type: "doc",
            id: "api-reference/ledgers",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/get-transactions-ledger-entries",
              label: "Get transaction's ledger entries",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/bulk-update-ledger-entries-for-a-transaction",
              label: "Bulk update ledger entries for a transaction",
              className: "api-method patch",
            },
            {
              type: "doc",
              id: "api-reference/bulk-delete-ledger-entries-for-a-transaction",
              label: "Bulk delete ledger entries for a transaction",
              className: "api-method delete",
            },
            {
              type: "doc",
              id: "api-reference/update-a-single-ledger-entry",
              label: "Update a single ledger entry",
              className: "api-method patch",
            },
            {
              type: "doc",
              id: "api-reference/list-ledger-entries-across-all-transactions",
              label: "List ledger entries across all transactions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/get-ledger-entry-by-id",
              label: "Get ledger entry by ID",
              className: "api-method get",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Holdings & positions",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "api-reference/kryptos-api",
        },
        {
          type: "category",
          label: "Holdings",
          link: {
            type: "doc",
            id: "api-reference/holdings",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/workspace-wide-holdings-with-live-prices-by-default",
              label: "Workspace-wide holdings (with live prices by default)",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/single-asset-detail-workspace-wide-always-with-rates",
              label: "Single asset detail — workspace-wide (always with rates)",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Portfolio",
          link: {
            type: "doc",
            id: "api-reference/portfolio",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/de-fi-positions",
              label: "DeFi positions",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/workspace-wide-de-fi-overview-totals",
              label: "Workspace-wide DeFi overview totals",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/nft-holdings",
              label: "NFT holdings",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/nft-holdings-grouped-by-collection",
              label: "NFT holdings grouped by collection",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/single-nft-detail-workspace-wide",
              label: "Single NFT detail — workspace-wide",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/liability-positions",
              label: "Liability positions",
              className: "api-method get",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Workspace & reference data",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "api-reference/kryptos-api",
        },
        {
          type: "category",
          label: "Assets",
          link: {
            type: "doc",
            id: "api-reference/assets",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/search-the-global-asset-catalog",
              label: "Search the global asset catalog",
              className: "api-method get",
            },
          ],
        },
        {
          type: "category",
          label: "Tasks",
          link: {
            type: "doc",
            id: "api-reference/tasks",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api-reference/list-tasks-for-workspace",
              label: "List tasks for workspace",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/get-task-by-id",
              label: "Get task by ID",
              className: "api-method get",
            },
            {
              type: "doc",
              id: "api-reference/cancel-a-running-task",
              label: "Cancel a running task",
              className: "api-method post",
            },
          ],
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
