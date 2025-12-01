"use client";

import { useEffect, useState } from "react";
import { GradientButton, GlassCard, TopBar } from "../components/ui";
import { quizOptions } from "../lib/content";

type Theme = "dark" | "light";

export default function QuizPage() {
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
        <GlassCard className="quiz-panel">
          <div className="quiz-header">
            <span className="muted small">Step 2 · Question 1 of 3</span>
            <div className="progress">
              <span className="progress-fill" />
            </div>
          </div>
          <h2 className="quiz-question">Sequence: 2, 4, 8, 16... Next?</h2>
          <div className="quiz-options">
            {quizOptions.map((option) => (
              <button
                key={option}
                className={`option ${option === "32" ? "selected" : ""}`}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          <GradientButton href="/profile">Continue to Profile</GradientButton>
        </GlassCard>
      </main>
    </div>
  );
}
