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
  onClick,
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  ghost?: boolean;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  const className = `${ghost ? "btn ghost" : "btn primary"} ${disabled ? "disabled" : ""}`;
  if (href) {
    return (
      <Link
        href={href}
        className={`${className} link-btn`}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <button className={className} onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  );
}

export function TopBar({ showNav = true }: { showNav?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const navLinkClass = (href: string) => `nav-link ${isActive(href) ? "active" : ""}`;

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
              <Link href="/" className={navLinkClass("/")}>
                Step 1 - Landing
              </Link>
              <Link href="/quiz" className={navLinkClass("/quiz")}>
                Step 2 - Quiz
              </Link>
              <Link href="/profile" className={navLinkClass("/profile")}>
                Step 3 - Profile
              </Link>
              <Link href="/results" className={navLinkClass("/results")}>
                Step 4 - Results
              </Link>
            </nav>
          </>
        )}
        <span className="pill">Beta</span>
      </div>
    </header>
  );
}
