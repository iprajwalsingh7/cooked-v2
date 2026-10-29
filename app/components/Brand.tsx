import { ArrowUpRight, AudioLines, Flame } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="site-header shell">
      <Link href="/" className="wordmark" aria-label="Cooked home">
        <span className="brand-icon">
          <Flame size={20} fill="currentColor" />
        </span>
        COOKED<span className="brand-version">/ 02</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/#platforms">The lineup</Link>
        <Link href="/#how-it-works">How it works</Link>
      </nav>
      <Link href="/#roast-console" className="header-cta">
        Get roasted
        <ArrowUpRight size={15} />
      </Link>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer shell">
      <div className="footer-top">
        <Link href="/" className="wordmark">
          <span className="brand-icon">
            <Flame size={20} fill="currentColor" />
          </span>
          COOKED
        </Link>
        <p>Your digital footprint. Our material.</p>
        <a
          href="https://iprajwalsingh7.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by Prajwal ↗
        </a>
      </div>
      <div className="footer-word" aria-hidden="true">
        COOKED<span>®</span>
      </div>
      <div className="footer-bottom">
        <span>FOR ENTERTAINMENT. NOT A PERSONALITY TEST.</span>
        <span>HAVE A SENSE OF HUMOR. STAY A WHILE.</span>
      </div>
    </footer>
  );
}

export function SignalArt({ platform = "github" }: { platform?: string }) {
  return (
    <div className={"signal-art signal-" + platform} aria-hidden="true">
      <div className="signal-top">
        <span>COOKED / SIGNAL ANALYSIS</span>
        <AudioLines size={20} />
      </div>
      <div className="signal-title">
        {platform === "spotify"
          ? "TASTE"
          : platform === "reddit"
            ? "TAKES"
            : "CODE"}
        <span>UNDER REVIEW.</span>
      </div>
      <div className="signal-bars">
        {Array.from({ length: 24 }, (_, i) => (
          <i
            key={i}
            style={{
              height: 22 + ((i * 31 + 7) % 78) + "%",
              animationDelay: -i * 0.13 + "s",
            }}
          />
        ))}
      </div>
      <div className="signal-bottom">
        <span>INPUT: YOUR DIGITAL FOOTPRINT</span>
        <span>OUTPUT: EMOTIONAL DAMAGE ↗</span>
      </div>
    </div>
  );
}
