import React, { useState, useEffect, useCallback } from "react";
import { useColorMode } from "@docusaurus/theme-common";

const steps = [
  {
    light: "/img/connect-demo/widget-landing.png",
    dark: "/img/connect-demo/widget-landing-dark.png",
    title: "Open Connect widget",
    desc: "Users sign in with email — fast, secure, no passwords.",
  },
  {
    light: "/img/connect-demo/select-integration.png",
    dark: "/img/connect-demo/select-integration-dark.png",
    title: "Browse integrations",
    desc: "Search across 5,000+ exchanges, wallets, and blockchains.",
  },
  {
    light: "/img/connect-demo/chain-selection.png",
    dark: "/img/connect-demo/chain-selection-dark.png",
    title: "Connect account",
    desc: "Paste a wallet address and auto-detect supported chains.",
  },
  {
    light: "/img/connect-demo/connection-success.png",
    dark: "/img/connect-demo/connection-success-dark.png",
    title: "Connection successful",
    desc: "Data syncs automatically — start pulling portfolio data via API.",
  },
];

export default function ConnectShowcase() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward

  const goTo = useCallback((idx) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="kp-showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left: step list */}
      <div className="kp-showcase__steps">
        {steps.map((step, i) => (
          <button
            key={i}
            className={`kp-showcase__step ${i === active ? "kp-showcase__step--active" : ""}`}
            onClick={() => goTo(i)}
          >
            <span className="kp-showcase__step-num">{i + 1}</span>
            <div>
              <div className="kp-showcase__step-title">{step.title}</div>
              <div className="kp-showcase__step-desc">{step.desc}</div>
            </div>
            {i === active && !paused && (
              <div className="kp-showcase__progress" key={active} />
            )}
          </button>
        ))}
      </div>

      {/* Right: phone mockup with transitioning images */}
      <div className="kp-showcase__preview">
        <div className="kp-showcase__phone">
          {steps.map((step, i) => (
            <img
              key={i}
              src={isDark ? step.dark : step.light}
              alt={step.title}
              className={`kp-showcase__img ${
                i === active
                  ? "kp-showcase__img--active"
                  : "kp-showcase__img--hidden"
              }`}
              style={{
                "--dir": direction,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
