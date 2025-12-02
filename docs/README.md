# Kryptos API Documentation (Docusaurus)

This is the documentation site for Kryptos Connect API, built with [Docusaurus](https://docusaurus.io/).

## Quick Start

### Install Dependencies

```bash
cd docs
npm install
```

### Start Development Server

```bash
npm start
```

This will start the development server at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

The static files will be generated in the `build/` directory.

### Serve Production Build

```bash
npm run serve
```

## Project Structure

```
docs/
├── docs/                    # Documentation markdown files
│   ├── intro.md            # Introduction page
│   ├── base-url.md         # Base URL info
│   ├── authentication/     # Auth docs
│   │   ├── oauth.md
│   │   └── api-key.md
│   ├── api/                # V1 API endpoints
│   │   ├── health.md
│   │   ├── userinfo.md
│   │   ├── holdings.md
│   │   ├── transactions.md
│   │   ├── defi-holdings.md
│   │   ├── nft-holdings.md
│   │   └── profiling.md
│   ├── api-legacy/         # V0 Legacy endpoints
│   │   ├── wallets.md
│   │   ├── transactions.md
│   │   ├── nft-holdings.md
│   │   └── defi-holdings.md
│   └── reference/          # Reference docs
│       ├── errors.md
│       └── types.md
├── src/
│   └── css/
│       └── custom.css      # Custom styles
├── static/
│   └── img/                # Static images
│       └── logo.png
├── docusaurus.config.js    # Docusaurus configuration
├── sidebars.js             # Sidebar configuration
└── package.json            # Dependencies
```

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Customization

### Theme Colors

Edit `src/css/custom.css` to change the color scheme:

```css
:root {
  --ifm-color-primary: #10b981;
}
```

### Sidebar

Edit `sidebars.js` to modify the navigation structure.

### Configuration

Edit `docusaurus.config.js` for:
- Site title and tagline
- Navbar items
- Footer links
- Theme settings

## Features

- 🌙 Dark mode by default
- 📱 Mobile responsive
- 🔍 Full-text search (with Algolia)
- 📝 MDX support
- 🎨 Custom theming
- ⚡ Fast builds

---

**© 2024 Kryptos. All rights reserved.**


