import React, { useEffect, useRef, useState } from "react";
import Link from "@docusaurus/Link";
import { useColorMode } from "@docusaurus/theme-common";
import ConnectShowcase from "./ConnectShowcase";

function useOnScreen(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function AnimatedSection({ children, className = "" }) {
  const ref = useRef(null);
  const visible = useOnScreen(ref);
  return (
    <section ref={ref} className={`kp-section ${className} ${visible ? "kp-visible" : "kp-hidden"}`}>
      {children}
    </section>
  );
}

const icon = (paths) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

/** One card per use case; each opens its guide. */
const useCaseCards = [
  {
    icon: icon(<><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /></>),
    title: "White-label backend",
    desc: "Kryptos as your product's backend: your customers' wallets, transactions, balances and tax, under your brand. Or just the data, with Integrations only.",
    to: "/docs/integrations-api/overview",
  },
  {
    icon: icon(<><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><path d="M8 21h8M12 17v4" /></>),
    title: "Kryptos Connect",
    desc: "Drop-in widget for Web & Mobile: users share their Kryptos data with your app.",
    to: "/docs/kryptos-connect/overview",
  },
  {
    icon: icon(<><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>),
    title: "Sign in with Kryptos",
    desc: "OAuth 2.0 with PKCE for apps that act inside a user's Kryptos account.",
    to: "/docs/authentication/oauth",
  },
  {
    icon: icon(<><circle cx="8" cy="15" r="4" /><path d="M10.8 12.2L19 4M16 7l2 2M14 9l2 2" /></>),
    title: "API keys",
    desc: "Automate one of your own workspaces, server to server. One key, one workspace.",
    to: "/docs/authentication/api-key",
  },
];

const apiCards = [
  {
    method: "GET",
    color: "green",
    title: "Holdings",
    desc: "Crypto assets across wallets with real-time balances and valuations.",
    to: "/docs/api/holdings",
  },
  {
    method: "GET",
    color: "green",
    title: "Transactions",
    desc: "Complete transaction records with filtering and categorization.",
    to: "/docs/api/transactions",
  },
  {
    method: "GET",
    color: "green",
    title: "DeFi Positions",
    desc: "Lending, staking, farming, and derivatives across protocols.",
    to: "/docs/api/defi",
  },
  {
    method: "GET",
    color: "green",
    title: "NFT Collections",
    desc: "Metadata, floor prices, and sales history for NFTs.",
    to: "/docs/api/nfts",
  },
  {
    method: "GET",
    color: "green",
    title: "Ledgers",
    desc: "Per-leg transaction detail for reconciliation and accounting.",
    to: "/docs/api/ledgers",
  },
  {
    method: "GET",
    color: "green",
    title: "Integrations",
    desc: "Supported exchanges, wallets, and blockchain networks.",
    to: "/docs/api/integrations",
  },
];

const resourceCards = [
  { title: "Error Codes", desc: "HTTP status codes, error types, and troubleshooting.", to: "/docs/reference/errors" },
  { title: "TypeScript Types", desc: "Full type definitions for requests and responses.", to: "/docs/reference/types" },
  { title: "Webhooks", desc: "Real-time event notifications for data updates.", to: "/docs/webhooks/setup" },
  { title: "Changelog", desc: "API updates, new features, and deprecations.", to: "/docs/changelog" },
];

function StartCard({ icon, title, desc, to }) {
  return (
    <Link to={to} className="kp-card kp-card--start">
      <div className="kp-card__icon">{icon}</div>
      <div>
        <div className="kp-card__title">{title}</div>
        <div className="kp-card__desc">{desc}</div>
      </div>
      <svg className="kp-card__arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
  );
}

function APICard({ method, color, title, desc, to }) {
  return (
    <Link to={to} className="kp-card kp-card--api">
      <div className="kp-card__head">
        <span className={`kp-method kp-method--${color}`}>{method}</span>
        <span className="kp-card__title">{title}</span>
      </div>
      <div className="kp-card__desc">{desc}</div>
      <span className="kp-card__link">
        View docs
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </Link>
  );
}

function ResourceCard({ title, desc, to }) {
  return (
    <Link to={to} className="kp-card kp-card--resource">
      <div className="kp-card__title">{title}</div>
      <div className="kp-card__desc">{desc}</div>
    </Link>
  );
}

export default function HomepageCards() {
  return (
    <div className="kp-home">
      {/* Guides by use case */}
      <AnimatedSection>
        <h2 className="kp-section__title">Guides by use case</h2>
        <p className="kp-section__subtitle">Pick what you're building. Most use cases start with the <Link to="/docs/developer-portal">Developer Portal</Link>.</p>
        <div className="kp-grid kp-grid--start kp-grid--usecases">
          {useCaseCards.map((c) => <StartCard key={c.title} {...c} />)}
        </div>
      </AnimatedSection>

      {/* Connect Demo */}
      <AnimatedSection>
        <h2 className="kp-section__title">How Kryptos Connect works</h2>
        <p className="kp-section__subtitle">Users link their wallets and exchanges in four simple steps — no backend complexity.</p>
        <ConnectShowcase />
      </AnimatedSection>


      {/* API Endpoints */}
      <AnimatedSection>
        <h2 className="kp-section__title">API endpoints</h2>
        <p className="kp-section__subtitle">Explore the full API surface for crypto portfolio data.</p>
        <div className="kp-grid kp-grid--api">
          {apiCards.map((c) => <APICard key={c.title} {...c} />)}
        </div>
      </AnimatedSection>


      {/* Resources */}
      <AnimatedSection>
        <h2 className="kp-section__title">Resources</h2>
        <div className="kp-grid kp-grid--resources">
          {resourceCards.map((c) => <ResourceCard key={c.title} {...c} />)}
        </div>
      </AnimatedSection>
    </div>
  );
}
