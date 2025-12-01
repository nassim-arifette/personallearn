"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`glass ${className}`}>{children}</div>;
}

export function GradientButton({
  children,
  ghost = false,
  href,
}: {
  children: React.ReactNode;
  ghost?: boolean;
  href?: string;
}) {
  const className = ghost ? "btn ghost" : "btn primary";
  if (href) {
    return (
      <Link href={href} className={`${className} link-btn`}>
        {children}
      </Link>
    );
  }
  return <button className={className}>{children}</button>;
}

export function TopBar({ showNav = true }: { showNav?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="topbar glass">
      <div className="brand">
        <span className="brand-mark">
          <img src="/android-chrome-512x512.png" alt="PersonalLearn" className="brand-logo" />
        </span>
        <div>
          <p className="eyebrow">PersonalLearn</p>
        </div>
      </div>
      <div className="top-actions">
        {showNav && (
          <>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="primary-nav"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="menu-icon" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="menu-label">Menu</span>
            </button>
            <nav id="primary-nav" className={`nav-links ${menuOpen ? "open" : ""}`}>
              <Link href="/">Step 1 - Landing</Link>
              <Link href="/quiz">Step 2 - Quiz</Link>
              <Link href="/profile">Step 3 - Profile</Link>
              <Link href="/results">Step 4 - Results</Link>
            </nav>
          </>
        )}
        <span className="pill">Beta</span>
      </div>
    </header>
  );
}
