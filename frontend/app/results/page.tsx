"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GradientButton, GlassCard, TopBar } from "../components/ui";
import { courseUnits } from "../lib/content";

type CourseUnit = {
  title: string;
  content?: string;
  description?: string;
  objectives?: string[];
  objective?: string;
  icon?: string;
};

type CoursePayload = {
  title: string;
  description?: string;
  units: CourseUnit[];
};

type Theme = "dark" | "light";

export default function ResultsPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [course, setCourse] = useState<CoursePayload | null>(null);
  const [coursePdfBase64, setCoursePdfBase64] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedCourse = localStorage.getItem("personalLearnCourse");
    const savedPdf = localStorage.getItem("personalLearnCoursePdf");
    if (savedPdf) setCoursePdfBase64(savedPdf);
    if (savedCourse) {
      try {
        setCourse(JSON.parse(savedCourse));
        return;
      } catch {
        // fall back to defaults below
      }
    }
    setCourse({
      title: "Introduction to Cognitive Science",
      description:
        "A foundational course adapted for intermediate learners, focusing on attention, memory, and decision-making.",
      units: courseUnits.map((unit) => ({
        title: unit.title,
        description: unit.description,
        objectives: [unit.objective],
        objective: unit.objective,
      })),
    });
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleDownload = () => {
    if (!coursePdfBase64 || !course) return;
    const byteChars = atob(coursePdfBase64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i += 1) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(course.title || "course").replace(/\s+/g, "_")}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("personalLearnProfile");
      localStorage.removeItem("personalLearnCourse");
      localStorage.removeItem("personalLearnCoursePdf");
    }
    router.push("/");
  };

  if (!course) {
    return (
      <div className="page-shell">
        <main className="content">
          <GlassCard className="panel">Loading course...</GlassCard>
        </main>
      </div>
    );
  }

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
          <h2>{course.title}</h2>
          <p className="muted">{course.description}</p>
          <div className="cta-row">
            <GradientButton onClick={handleDownload} disabled={!coursePdfBase64}>
              {coursePdfBase64 ? "Download Full PDF Course" : "PDF will appear after generation"}
            </GradientButton>
            <GradientButton ghost onClick={handleReset}>
              Start New Session
            </GradientButton>
          </div>
        </GlassCard>

        <div className="unit-list">
          {course.units.map((unit) => (
            <GlassCard key={unit.title} className="unit-card">
              <div className="icon">{unit.icon || "📘"}</div>
              <div>
                <p className="card-title">{unit.title}</p>
                <p className="muted">{unit.description || unit.content?.slice(0, 260)}</p>
                {(unit.objective || unit.objectives?.length) && (
                  <div className="objective">
                    <span className="badge">Objective</span>
                    <span>{unit.objective || unit.objectives?.[0]}</span>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </main>
    </div>
  );
}
