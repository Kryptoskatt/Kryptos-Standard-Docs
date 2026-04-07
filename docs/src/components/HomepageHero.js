import React from "react";
import Link from "@docusaurus/Link";

export default function HomepageHero() {
  return (
    <div className="kp-hero">
      <div className="kp-hero__bg" />
      <div className="kp-hero__content">
        <div className="kp-hero__pill">
          <span className="kp-hero__pill-dot" />
          Kryptos Connect API
        </div>
        <h1 className="kp-hero__title">
          One API for all<br />crypto portfolio data
        </h1>
        <p className="kp-hero__subtitle">
          Connect to 5,000+ integrations across exchanges, wallets, and blockchains.
          Pull holdings, transactions, DeFi, NFTs, and tax data through one unified endpoint.
        </p>
        <div className="kp-hero__actions">
          <Link to="/docs/developer-portal" className="kp-btn kp-btn--primary">
            Get started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/docs/api/health" className="kp-btn kp-btn--ghost">
            API Reference
          </Link>
        </div>
      </div>
    </div>
  );
}
