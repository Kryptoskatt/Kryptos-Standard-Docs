import React from "react";
import Layout from "@theme/Layout";
import HomepageHero from "../components/HomepageHero";
import HomepageCards from "../components/HomepageCards";

export default function Home() {
  return (
    <Layout title="Kryptos API Documentation" description="Developer documentation for the Kryptos Connect API">
      <main className="kp-main">
        <HomepageHero />
        <HomepageCards />
      </main>
    </Layout>
  );
}
