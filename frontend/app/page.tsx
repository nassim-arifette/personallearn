"use client";

import { useEffect, useState } from "react";
import { features } from "./lib/content";
import { GlassCard, GradientButton, TopBar } from "./components/ui";

type Theme = "dark" | "light";

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className="page-shell">
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      <div className="nebula nebula-c" />

      <TopBar />
      <div className="top-actions theme-toggle">
        <button className="toggle" onClick={toggleTheme}>
          {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
        </button>
      </div>

      <main className="content">
        <section className="hero-stack">
          <GlassCard className="hero-block">
            <div className="hero-inner">
              <p className="eyebrow">Adaptive AI Course Builder</p>
              <h1>
                Unlock Your <span className="accent">Learning Potential</span>
              </h1>
              <p className="lede">
                The adaptive AI platform that molds content to your unique cognitive rhythm.
                Start calibration to tailor every PDF into guided micro-units.
              </p>
              <div className="cta-row center">
                <GradientButton href="/quiz">Start Cognitive Calibration</GradientButton>
              </div>
            </div>
          </GlassCard>

          <div className="feature-row">
            {features.map((feature) => (
              <GlassCard key={feature.title} className="feature-card">
                <div className="icon">{feature.icon}</div>
                <div>
                  <p className="card-title">{feature.title}</p>
                  <p className="muted">{feature.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}



