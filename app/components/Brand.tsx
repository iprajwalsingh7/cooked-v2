import { Flame } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="site-header shell">
      <Link href="/" className="wordmark" aria-label="Cooked home">
        <Flame size={25} fill="currentColor" /> cooked<span>®</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/#menu">The menu</Link>
        <Link href="/#how-it-works">How it works</Link>
      </nav>
      <Link href="/#menu" className="header-cta">
        Get cooked <span>↗</span>
      </Link>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer shell">
      <Link href="/" className="wordmark">
        <Flame size={22} fill="currentColor" /> cooked<span>®</span>
      </Link>
      <p>A little self-awareness. Served extra hot.</p>
      <a
        href="https://iprajwalsingh7.dev"
        target="_blank"
        rel="noopener noreferrer"
      >
        Made by Prajwal ↗
      </a>
    </footer>
  );
}

export function HeatArt({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`heat-art ${compact ? "heat-art-compact" : ""}`}
      aria-hidden="true"
    >
      <div className="orb-halo" />
      <div className="orb-orbit orbit-one" />
      <div className="orb-orbit orbit-two" />
      <div className="heat-orb">
        <div className="orb-sheen" />
        <Flame className="orb-flame" fill="currentColor" strokeWidth={0.6} />
      </div>
      <div className="orb-shadow" />
      <span className="art-coordinate">EST. 2025 / NO FILTER</span>
      <div className="floating-tag tag-top">
        <span className="status-dot" /> Ego detected.
      </div>
      <div className="floating-tag tag-bottom">
        <Flame size={15} /> Handle with humility.
      </div>
    </div>
  );
}
