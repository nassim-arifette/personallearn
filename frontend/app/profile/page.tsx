"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GradientButton, GlassCard, TopBar } from "../components/ui";
import { createCourse, ProfileResponse } from "../lib/api";

type Theme = "dark" | "light";
type StoredProfile = { profile: ProfileResponse; score: number; durationSeconds: number };

export default function ProfilePage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [courseTitle, setCourseTitle] = useState("My Adaptive Course");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("personalLearnProfile");
    if (!raw) return;
    try {
      const parsed: StoredProfile = JSON.parse(raw);
      setProfile(parsed.profile);
    } catch {
      // ignore parse errors and fall back to defaults
    }
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleFile = (file: File) => {
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setUploadError("Only PDF files are supported.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleBrowse = () => fileInputRef.current?.click();

  const handleBrowseKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleBrowse();
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
    event.target.value = "";
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setUploadError("Please upload a PDF to continue.");
      return;
    }
    setUploadError(null);
    setIsSubmitting(true);
    const courseTitleSafe = courseTitle.trim() || "My Adaptive Course";
    const effectiveProfile: ProfileResponse =
      profile || { level: "Intermediate", units: 7, desc: "Balanced", efficiency: 0 };
    try {
      const formData = new FormData();
      formData.append("course_title", courseTitleSafe);
      formData.append("level", effectiveProfile.level);
      formData.append("units", String(effectiveProfile.units));
      formData.append("include_pdf", "true");
      formData.append("file", selectedFile);

      const response = await createCourse(formData);
      if (typeof window !== "undefined") {
        localStorage.setItem("personalLearnCourse", JSON.stringify(response.course));
        if (response.course_pdf_base64) {
          localStorage.setItem("personalLearnCoursePdf", response.course_pdf_base64);
        }
      }
      router.push("/results");
    } catch (err: any) {
      setUploadError(err.message || "Failed to generate course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const derivedTraits = [
    { title: profile?.desc || "Balanced", description: "Profile", icon: "🧭" },
    { title: `${profile?.units || 7} Units`, description: "Segmentation", icon: "📦" },
    { title: profile?.level || "Intermediate", description: "Complexity", icon: "⚖️" },
  ];

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
          <p className="eyebrow">Step 3 - Profile</p>
          <h2>Your Cognitive Profile</h2>
          <div className="profile-grid">
            {derivedTraits.map((trait) => (
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
            <div
              className={`upload-drop ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowse}
              onKeyDown={handleBrowseKeyDown}
              role="button"
              tabIndex={0}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={handleFileInputChange}
              />
              <div className="icon">PDF</div>
              <p className="muted">Drag and drop your PDF here or click to browse</p>
              <div className="upload-meta">
                {selectedFile ? (
                  <>
                    <span className="badge">Selected</span>
                    <span>{selectedFile.name}</span>
                  </>
                ) : (
                  <span className="muted small">No file selected yet</span>
                )}
              </div>
              {uploadError && (
                <p className="upload-error small" role="alert">
                  {uploadError}
                </p>
              )}
            </div>
            <div className="upload-form">
              <label htmlFor="courseTitle" className="muted small">
                Course Title
              </label>
              <input
                id="courseTitle"
                placeholder="My Adaptive Course"
                className="text-input"
                value={courseTitle}
                onChange={(event) => setCourseTitle(event.target.value)}
              />
              <GradientButton onClick={handleGenerate} disabled={isSubmitting}>
                {isSubmitting ? "Generating..." : "Generate Adapted Course"}
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
