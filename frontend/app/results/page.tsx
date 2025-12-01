"use client";

import { useEffect, useState } from "react";
import { GradientButton, GlassCard, TopBar } from "../components/ui";
import { courseUnits } from "../lib/content";

type Theme = "dark" | "light";

export default function ResultsPage() {
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
        <GlassCard className="panel">
          <p className="eyebrow">Step 4 - Course Blueprint</p>
          <h2>Introduction to Cognitive Science</h2>
          <p className="muted">
            A foundational course adapted for intermediate learners, focusing on attention,
            memory, and decision-making.
          </p>
          <div className="cta-row">
            <GradientButton>Download Full PDF Course</GradientButton>
            <GradientButton ghost href="/">
              Start New Session
            </GradientButton>
          </div>
        </GlassCard>

        <div className="unit-list">
          {courseUnits.map((unit) => (
            <GlassCard key={unit.title} className="unit-card">
              <div className="icon">📘</div>
              <div>
                <p className="card-title">{unit.title}</p>
                <p className="muted">{unit.description}</p>
                <div className="objective">
                  <span className="badge">Objective</span>
                  <span>{unit.objective}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </main>
    </div>
  );
}
