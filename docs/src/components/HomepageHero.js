import React, { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import BrowserOnly from "@docusaurus/BrowserOnly";

const rotatingWords = [
  "crypto portfolio data",
  "DeFi positions",
  "NFT collections",
  "transaction history",
  "tax reports",
];

export default function HomepageHero() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % rotatingWords.length);
        setAnimating(false);
      }, 250);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="kp-hero-wrapper">
      <div className="kp-hero">
        <div className="kp-hero__bg">
          <BrowserOnly>
            {() => {
              const WormholeCanvas = require("./WormholeCanvas").default;
              return <WormholeCanvas />;
            }}
          </BrowserOnly>
        </div>
        <div className="kp-hero__content">
          <div className="kp-hero__pill">
            <span className="kp-hero__pill-dot" />
            Kryptos Connect API
          </div>
          <h1 className="kp-hero__title">
            One API for all<br />
            <span className="kp-hero__rotating-wrapper">
              <span
                className={`kp-hero__rotating-word ${animating ? "kp-hero__rotating-word--exit" : "kp-hero__rotating-word--enter"}`}
                key={index}
              >
                {rotatingWords[index]}
              </span>
            </span>
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
    </div>
  );
}
