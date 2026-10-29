"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Flame,
  Github,
  Headphones,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Footer, Header, HeatArt } from "./components/Brand";

const platforms = [
  {
    id: "spotify",
    name: "Spotify",
    description:
      "The guilty pleasures. The breakup playlist. That one artist you refuse to outgrow.",
    label: "FOR THE REPEAT OFFENDERS",
    icon: Headphones,
    color: "green",
    detail: "Connect your account",
    sample:
      "Your playlist has three moods: staring out of a rainy window, pretending you’re in a music video, and skipping the song you added to seem interesting.",
  },
  {
    id: "github",
    name: "GitHub",
    description:
      "Abandoned side projects and “final-final” commits. Your contribution graph has a story.",
    label: "FOR THE SHIP-IT TOMORROWS",
    icon: Github,
    color: "lilac",
    detail: "Just your username",
    sample:
      "Twelve repositories. Eleven README files that say “coming soon.” Your most consistent contribution is giving future-you more work.",
  },
  {
    id: "reddit",
    name: "Reddit",
    description:
      "Your hot takes, niche obsessions, and very impressive collection of imaginary points.",
    label: "FOR THE COMMENT SECTION",
    icon: MessageCircle,
    color: "orange",
    detail: "Just your username",
    sample:
      "You don’t browse Reddit. You clock in. Somewhere there’s a comment with two upvotes that you’re still checking like a stock portfolio.",
  },
];

export default function Home() {
  const [sample, setSample] = useState(1);
  const active = platforms[sample];

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="hero shell">
          <div className="hero-copy entrance">
            <div className="eyebrow">
              <span className="status-dot" /> YOUR INTERNET EGO ENDS HERE
            </div>
            <h1>
              A little less ego.
              <br />A lot more <span className="serif-word">heat.</span>
            </h1>
            <p>
              You are what you stream, ship, and post.
              <br className="desktop-break" /> Let AI connect the dots. And hurt
              your feelings. A little.
            </p>
            <div className="hero-actions">
              <Link href="#menu" className="button button-dark">
                Find your roast <ArrowUpRight size={18} />
              </Link>
              <Link href="#sample" className="text-link">
                Get a taste <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-proof">
              <span className="tiny-faces">
                <i>↗</i>
                <i>♪</i>
                <i>⌘</i>
              </span>
              <span>Three ways in. No ego out.</span>
            </div>
          </div>
          <HeatArt />
          <div className="hero-bottom">
            <span>PERSONALIZED ROASTS. QUESTIONABLE COMFORT.</span>
            <Link href="#menu">
              SCROLL TO SIMMER <ArrowDown size={14} />
            </Link>
          </div>
        </section>
        <div className="flavor-strip">
          <div className="shell">
            <span>100% personal</span>
            <Sparkles size={17} />
            <span>Zero sugarcoating</span>
            <Sparkles size={17} />
            <span>Made from your digital footprint</span>
            <Sparkles size={17} />
            <span>Best served with a sense of humor</span>
          </div>
        </div>
        <section id="menu" className="menu-section shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / PICK YOUR POISON</span>
              <h2>
                What’s on the <span className="serif-word">menu?</span>
              </h2>
            </div>
            <p>
              Different platforms. Same questionable you.{" "}
              <br />
              Choose where we start digging.
            </p>
          </div>
          <div className="platform-grid">
            {platforms.map((platform) => (
              <Link
                href={`/${platform.id}`}
                key={platform.id}
                className={`platform-card card-${platform.color}`}
              >
                <div className="card-top">
                  <span className="platform-icon">
                    <platform.icon size={25} />
                  </span>
                  <ArrowUpRight className="card-arrow" size={24} />
                </div>
                <div
                  className={`platform-art platform-art-${platform.id}`}
                  aria-hidden="true"
                >
                  {platform.id === "spotify" ? (
                    <div className="vinyl">
                      <span>c.</span>
                    </div>
                  ) : platform.id === "github" ? (
                    <div className="code-window">
                      <div>
                        <i />
                        <i />
                        <i />
                      </div>
                      <span>git commit -m</span>
                      <strong>
                        "it works
                        <br />
                        on my machine"
                      </strong>
                      <b>↵</b>
                    </div>
                  ) : (
                    <div className="comment-art">
                      <span>unpopular opinion:</span>
                      <strong>
                        you’re the
                        <br />
                        popular problem.
                      </strong>
                      <small>↑ 1 &nbsp; ↓ &nbsp;&nbsp; ↩ Reply</small>
                    </div>
                  )}
                </div>
                <div className="card-copy">
                  <span className="micro-label">{platform.label}</span>
                  <h3>{platform.name}</h3>
                  <p>{platform.description}</p>
                  <div className="card-foot">
                    <span>{platform.detail}</span>
                    <span className="circle-arrow">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <p className="menu-note">
            <Check size={14} /> GitHub and Reddit use public profiles. Spotify
            requires account access.
          </p>
        </section>
        <section id="sample" className="sample-section">
          <div className="shell sample-grid">
            <div className="sample-copy">
              <span className="eyebrow">A COMPLIMENT? IN THIS ECONOMY?</span>
              <h2>
                Lovingly crafted.
                <br />
                <span className="serif-word">Lightly devastating.</span>
              </h2>
              <p>
                No random insult generator. Your habits are the ingredients. AI
                just turns up the heat.
              </p>
              <div className="sample-tabs" aria-label="Example roasts">
                {platforms.map((platform, index) => (
                  <button
                    key={platform.id}
                    aria-pressed={sample === index}
                    aria-controls="sample-roast"
                    onClick={() => setSample(index)}
                    className={sample === index ? "active" : ""}
                  >
                    <platform.icon size={16} />
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>
            <div
              className="sample-verdict"
              id="sample-roast"
              aria-live="polite"
            >
              <div className="verdict-top">
                <span>
                  <Flame size={15} /> FRESH OFF THE GRILL
                </span>
                <span>EXAMPLE ROAST</span>
              </div>
              <blockquote key={active.id}>“{active.sample}”</blockquote>
              <div className="verdict-bottom">
                <span className={`sample-platform ${active.color}`}>
                  <active.icon size={16} />
                  {active.name} roast
                </span>
                <span>Well done. Literally. ↗</span>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="how-section shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / THE RECIPE</span>
              <h2>
                From profile to <span className="serif-word">humble pie.</span>
              </h2>
            </div>
            <p>
              Very little effort.{" "}
              <br />
              Very personal consequences.
            </p>
          </div>
          <div className="steps-grid">
            {[
              {
                number: "01",
                title: "Choose your arena.",
                text: "Music taste, code habits, or comment history. Everyone has a weak spot.",
              },
              {
                number: "02",
                title: "Give us the ingredients.",
                text: "Enter a public username, or connect your Spotify. We take it from there.",
              },
              {
                number: "03",
                title: "Take the heat.",
                text: "Get a roast made from your actual habits. Laugh, copy it, send it to the group chat.",
              },
            ].map((step) => (
              <div className="step" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="faq-section shell">
          <div>
            <span className="eyebrow">BEFORE YOU GET COOKED</span>
            <h2>
              A few burning{" "}
              <br />
              <span className="serif-word">questions.</span>
            </h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>
                Is this actually personalized?<span>+</span>
              </summary>
              <p>
                Yes. We use your public profile and activity, or the Spotify
                listening data you authorize, to generate your roast. The
                examples above are illustrative.
              </p>
            </details>
            <details>
              <summary>
                Can anyone connect Spotify?<span>+</span>
              </summary>
              <p>
                Spotify development apps require approved accounts. If yours is
                not on the allowlist, try a GitHub or Reddit roast instead.
              </p>
            </details>
            <details>
              <summary>
                What happens to my data?<span>+</span>
              </summary>
              <p>
                Profile details are sent to Gemini to write your roast. Cooked
                does not save roast history in a database. Spotify access stays
                in an HTTP-only session cookie. Hosting and AI providers apply
                their own data policies.
              </p>
            </details>
            <details>
              <summary>
                Is it supposed to be mean?<span>+</span>
              </summary>
              <p>
                It’s comedy about your online habits. If a roast misses the
                mark, leave it on the plate. Your internet profile is only a
                small part of you.
              </p>
            </details>
          </div>
        </section>
        <section className="closing-section shell">
          <div className="closing-inner">
            <span className="eyebrow">YOU’VE SCROLLED THIS FAR.</span>
            <h2>
              Still feeling <span className="serif-word">confident?</span>
            </h2>
            <Link href="#menu" className="button button-dark">
              Let’s change that <ArrowUpRight size={18} />
            </Link>
            <span className="closing-spark" aria-hidden="true">
              ✳
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
