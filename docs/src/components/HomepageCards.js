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

const startCards = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
      </svg>
    ),
    title: "Quickstart",
    desc: "Create your account, set up a workspace, and make your first API call.",
    to: "/docs/developer-portal",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    title: "Authentication",
    desc: "Set up OAuth 2.0 or API key auth to access user portfolio data securely.",
    to: "/docs/authentication/oauth",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: "Kryptos Connect",
    desc: "Drop-in widget for Web & Mobile that handles the complete auth flow.",
    to: "/docs/kryptos-connect",
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
    method: "POST",
    color: "blue",
    title: "Transactions",
    desc: "Complete transaction records with filtering and categorization.",
    to: "/docs/api/transactions",
  },
  {
    method: "GET",
    color: "green",
    title: "DeFi Positions",
    desc: "Lending, staking, farming, and derivatives across protocols.",
    to: "/docs/api/defi-holdings",
  },
  {
    method: "GET",
    color: "green",
    title: "NFT Collections",
    desc: "Metadata, floor prices, and sales history for NFTs.",
    to: "/docs/api/nft-holdings",
  },
  {
    method: "GET",
    color: "green",
    title: "User Profiling",
    desc: "Risk classification and portfolio composition analytics.",
    to: "/docs/api/profiling",
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
      {/* Stats */}
      <div className="kp-stats">
        {[
          ["5,000+", "Integrations"],
          ["200+", "Exchanges"],
          ["100+", "Blockchains"],
        ].map(([value, label]) => (
          <div key={label} className="kp-stats__item">
            <span className="kp-stats__value">{value}</span>
            <span className="kp-stats__label">{label}</span>
          </div>
        ))}
      </div>

      {/* Connect Demo */}
      <AnimatedSection>
        <h2 className="kp-section__title">How Kryptos Connect works</h2>
        <p className="kp-section__subtitle">Users link their wallets and exchanges in four simple steps — no backend complexity.</p>
        <ConnectShowcase />
      </AnimatedSection>

      {/* Getting Started */}
      <AnimatedSection>
        <h2 className="kp-section__title">Start building</h2>
        <p className="kp-section__subtitle">Everything you need to integrate Kryptos into your application.</p>
        <div className="kp-grid kp-grid--start">
          {startCards.map((c) => <StartCard key={c.title} {...c} />)}
        </div>
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
