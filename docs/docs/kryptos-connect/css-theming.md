---
id: css-theming
title: Theming & Customization
---

Kryptos Connect exposes `--kc-*` CSS custom properties that control every visual aspect of the connect UI. Pass them via the `cssVars` option in `KryptosConnect.init`.

```tsx
KryptosConnect.init({
  clientId: "your-client-id",
  appName: "My App",
  cssVars: {
    "--kc-primary": "#6366f1",
    "--kc-primary-hover": "#4f46e5",
    "--kc-primary-text": "#ffffff",
  },
});
```

---

## Brand variables

The most commonly customized variables.

| Variable | Light | Dark | Description |
| --- | --- | --- | --- |
| `--kc-primary` | `#00c693` | `#00c693` | Primary accent — button fill, links, icons |
| `--kc-primary-hover` | `#007558` | `#42ffd0` | Hover / pressed state |
| `--kc-primary-light` | `#42ffd0` | `#42ffd0` | Light tint for selected states |
| `--kc-primary-text` | `#ffffff` | `#ffffff` | Text on primary-colored fills |
| `--kc-primary-rgb` | `0, 198, 147` | `0, 198, 147` | RGB triplet for `rgba()` tints |

---

## Background variables

| Variable | Light | Dark | Description |
| --- | --- | --- | --- |
| `--kc-bg-primary` | `#ffffff` | `#0a0a0a` | Modal and panel background |
| `--kc-bg-secondary` | `#f9fafb` | `#1a1a1d` | Subtle section backgrounds |
| `--kc-bg-tertiary` | `#e5e7eb` | `#030405` | Deepest background layer |
| `--kc-bg-hover` | `#f3f4f6` | `#2e2e2e` | Row / item hover background |

---

## Text variables

| Variable | Light | Dark | Description |
| --- | --- | --- | --- |
| `--kc-text-primary` | `#1f2937` | `#f6f6f8` | Main body text |
| `--kc-text-secondary` | `#4b5563` | `#e5e7eb` | Subdued / helper text |
| `--kc-text-tertiary` | `#9ca3af` | `#9ca3af` | Placeholder and disabled text |
| `--kc-text-inverse` | `#ffffff` | `#1f2937` | Text on inverted fills |

---

## Border variables

| Variable | Light | Dark | Description |
| --- | --- | --- | --- |
| `--kc-border` | `#e5e7eb` | `#334155` | Default dividers and outlines |
| `--kc-border-focus` | `#00c693` | `#42ffd0` | Ring color on focused inputs |

---

## Secondary variables

| Variable | Light | Dark | Description |
| --- | --- | --- | --- |
| `--kc-secondary` | `#4b5563` | `#4b5563` | Secondary button fill |
| `--kc-secondary-hover` | `#1f2937` | `#9ca3af` | Secondary button hover fill |

---

## Semantic / status variables

These control success, error, and warning states inside the connect UI.

| Variable | Default | Description |
| --- | --- | --- |
| `--kc-success` | `#22c55e` | Success indicator |
| `--kc-success-light` | `#86efac` | Success background tint |
| `--kc-success-dark` | `#15803d` | Success dark variant |
| `--kc-error` | `#ef4444` | Error / destructive |
| `--kc-error-light` | `#fca5a5` | Error background tint |
| `--kc-error-dark` | `#b91c1c` | Error dark variant |
| `--kc-warning` | `#f59e0b` | Warning |
| `--kc-warning-light` | `#fcd34d` | Warning background tint |
| `--kc-warning-dark` | `#d97706` | Warning dark variant |

---

## Shadow variables

| Variable | Light | Dark |
| --- | --- | --- |
| `--kc-shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` | `0 1px 2px 0 rgba(0,0,0,0.3)` |
| `--kc-shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | `0 4px 6px -1px rgba(0,0,0,0.3)` |
| `--kc-shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | `0 10px 15px -3px rgba(0,0,0,0.3)` |

---

## Full example

```tsx
KryptosConnect.init({
  clientId: "your-client-id",
  appName: "My App",
  theme: "light",
  cssVars: {
    // Brand
    "--kc-primary": "#6366f1",
    "--kc-primary-hover": "#4f46e5",
    "--kc-primary-light": "#e0e7ff",
    "--kc-primary-text": "#ffffff",
    "--kc-primary-rgb": "99, 102, 241",

    // Backgrounds
    "--kc-bg-primary": "#ffffff",
    "--kc-bg-secondary": "#f8fafc",
    "--kc-bg-hover": "#f1f5f9",

    // Text
    "--kc-text-primary": "#0f172a",
    "--kc-text-secondary": "#64748b",

    // Borders
    "--kc-border": "#e2e8f0",
    "--kc-border-focus": "#6366f1",
  },
});
```

## Per-button style override (web)

For one-off button styling on web, use the `style` or `className` prop — this does not affect the connect UI, only the trigger button:

```tsx
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  onConnectSuccess={handleSuccess}
  onConnectError={(err) => console.error(err)}
  style={{
    background: "linear-gradient(to right, #6366f1, #8b5cf6)",
    borderRadius: "10px",
  }}
>
  Connect Wallet
</KryptosConnectButton>
```

## Per-button style override (mobile)

Use the `style` prop on `KryptosConnectButton`. Setting `backgroundColor` here takes precedence over `--kc-primary` for that button only:

```tsx
<KryptosConnectButton
  generateLinkToken={generateLinkToken}
  onConnectSuccess={handleSuccess}
  onConnectError={(err) => console.error(err)}
  buttonLabel="Connect Coinbase"
  style={{ backgroundColor: "#0052FF", borderRadius: 10 }}
/>
```
