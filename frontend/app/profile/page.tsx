"use client";

import { useEffect, useRef, useState } from "react";
import { GradientButton, GlassCard, TopBar } from "../components/ui";
import { profileTraits } from "../lib/content";

type Theme = "dark" | "light";

export default function ProfilePage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [courseTitle, setCourseTitle] = useState("My Adaptive Course");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
              <GradientButton href="/results">Generate Adapted Course</GradientButton>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
