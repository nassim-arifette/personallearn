"use client";

import { useEffect, useState } from "react";
import { GradientButton, GlassCard, TopBar } from "../components/ui";
import { profileTraits } from "../lib/content";

type Theme = "dark" | "light";

export default function ProfilePage() {
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
        <GlassCard className="panel upload">
          <p className="eyebrow">Step 3 · Profile</p>
          <h2>Your Cognitive Profile</h2>
          <div className="profile-grid">
            {profileTraits.map((trait) => (
              <GlassCard key={trait.title} className="profile-card">
                <div className="icon">{trait.icon}</div>
                <div>
                  <p className="card-title">{trait.title}</p>
                  <p className="muted">{trait.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="upload-panel glass">
            <div className="upload-drop">
              <div className="icon">☁️</div>
              <p>Drag and drop your PDF here or click to browse</p>
            </div>
            <div className="upload-form">
              <label htmlFor="courseTitle" className="muted small">
                Course Title
              </label>
              <input
                id="courseTitle"
                placeholder="My Adaptive Course"
                className="text-input"
                readOnly
              />
              <GradientButton href="/results">Generate Adapted Course</GradientButton>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
