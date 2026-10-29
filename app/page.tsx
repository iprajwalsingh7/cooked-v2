"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Check,
  Flame,
  Github,
  Headphones,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Footer, Header } from "./components/Brand";

const platforms = [
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    tag: "FOR THE SERIAL SIDE-PROJECT STARTER",
    title: "ALL FORK.\nNO FINISH.",
    description:
      "The abandoned repos. The tutorial clones. The README doing all the work.",
    color: "violet",
    metric: "COMMITMENT ISSUES",
    example:
      "Twelve repos. Eleven say “coming soon.” Your most consistent contribution is giving future-you more work.",
    placeholder: "Your GitHub username",
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: Headphones,
    tag: "FOR THE EMOTIONALLY CURATED",
    title: "GOOD AUDIO.\nBAD DECISIONS.",
    description:
      "The breakup playlist. The guilty pleasures. The artist you made your entire personality.",
    color: "lime",
    metric: "SKIP-WORTHY BEHAVIOR",
    example:
      "You call it an eclectic taste. We call it three breakup playlists in a trench coat pretending to be a personality.",
    placeholder: "Connect your listening history",
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: MessageCircle,
    tag: "FOR THE CHRONICALLY ONLINE",
    title: "BIG KARMA.\nSMALL WORLD.",
    description:
      "Your hot takes, niche obsessions, and collection of very imaginary internet points.",
    color: "coral",
    metric: "TERMINALLY IN THE COMMENTS",
    example:
      "You don’t browse Reddit. You clock in. Somewhere there’s a comment with two upvotes you’re checking like a stock portfolio.",
    placeholder: "Your Reddit username",
  },
];

export default function Home() {
  const [source, setSource] = useState(0);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const active = platforms[source];

  function submit(event: FormEvent) {
    event.preventDefault();
    if (active.id === "spotify") {
      router.push("/spotify");
      return;
    }
    const clean = username
      .trim()
      .replace(active.id === "reddit" ? /^u\// : /^@/, "");
    if (clean)
      router.push(
        "/" + active.id + "/roast?username=" + encodeURIComponent(clean),
      );
  }

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="hero shell">
          <div className="hero-copy entrance">
            <div className="eyebrow">
              <span className="status-dot" /> AI-POWERED. EGO-DESTROYING.
            </div>
            <h1>
              YOUR DIGITAL
              <br />
              LIFE.<span className="headline-accent"> EXPOSED.</span>
            </h1>
            <p>
              Your playlists have patterns. Your repos have secrets.
              <br className="desktop-break" /> Your comment history has… a lot
              to answer for.
            </p>
            <div className="hero-actions">
              <Link href="#roast-console" className="button button-dark">
                COOK ME
                <Flame size={18} />
              </Link>
              <Link href="#platforms" className="text-link">
                Explore the lineup
                <ArrowDown size={16} />
              </Link>
            </div>
            <div className="hero-proof">
              <span>
                <Check size={13} />
                Actually personal
              </span>
              <span>
                <Check size={13} />
                Zero sugarcoating
              </span>
            </div>
          </div>
          <div
            id="roast-console"
            className={"roast-console accent-" + active.color}
          >
            <div className="console-header">
              <span>
                <span className="status-dot" /> THE ROAST CONSOLE
              </span>
              <span>VOL. 02</span>
            </div>
            <div className="console-body">
              <div className="console-label">01 / CHOOSE YOUR SOURCE</div>
              <div className="source-switch" aria-label="Roast platform">
                {platforms.map((platform, index) => (
                  <button
                    key={platform.id}
                    aria-pressed={source === index}
                    onClick={() => {
                      setSource(index);
                      setUsername("");
                    }}
                    className={source === index ? "selected" : ""}
                  >
                    <platform.icon size={18} />
                    {platform.name}
                  </button>
                ))}
              </div>
              <div className="console-example" key={active.id}>
                <div className="example-tag">
                  <Sparkles size={12} /> EXAMPLE TRANSMISSION
                </div>
                <p>“{active.example}”</p>
                <div className="example-bottom">
                  <span>NO EGO WAS HARMED. YET.</span>
                  <AudioLines size={22} />
                </div>
              </div>
              <form onSubmit={submit} className="console-form">
                <label htmlFor="roast-username">
                  02 /{" "}
                  {active.id === "spotify"
                    ? "CONNECT YOUR ACCOUNT"
                    : "IDENTIFY THE SUSPECT"}
                </label>
                {active.id !== "spotify" && (
                  <div className="console-input">
                    <span>{active.id === "reddit" ? "u/" : "@"}</span>
                    <input
                      id="roast-username"
                      aria-label={active.placeholder}
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="username"
                      autoCapitalize="none"
                      autoComplete="off"
                      spellCheck={false}
                      required
                      maxLength={active.id === "github" ? 39 : 22}
                      pattern={
                        active.id === "github"
                          ? "@?[A-Za-z0-9][A-Za-z0-9-]*"
                          : "(u/)?[A-Za-z0-9_-]{3,20}"
                      }
                    />
                  </div>
                )}
                <button
                  className="console-submit"
                  type="submit"
                  disabled={active.id !== "spotify" && !username.trim()}
                >
                  {active.id === "spotify"
                    ? "CONNECT SPOTIFY"
                    : "GENERATE MY ROAST"}
                  <ArrowUpRight size={18} />
                </button>
              </form>
              <div className="console-footnote">
                <ShieldCheck size={12} />
                {active.id === "spotify"
                  ? "Spotify access is limited to approved accounts."
                  : "Public profile only. No sign-in. No hiding."}
              </div>
            </div>
            <div className="console-footer">
              <span>POWERED BY GEMINI</span>
              <span>BRUTALLY PERSONAL ↗</span>
            </div>
          </div>
          <div className="hero-bottom">
            <span>SCROLL FOR MORE QUESTIONABLE DECISIONS</span>
            <span>SPOTIFY / GITHUB / REDDIT</span>
          </div>
        </section>
        <div className="ticker" aria-hidden="true">
          <div>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                YOUR DATA. OUR PUNCHLINE.
                <Sparkles size={20} /> NO FILTER. NO MERCY.
                <Flame size={20} />
              </span>
            ))}
          </div>
        </div>
        <section id="platforms" className="lineup-section shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / THE LINEUP</span>
              <h2>
                THREE PLATFORMS.
                <br />
                <span>NOWHERE TO HIDE.</span>
              </h2>
            </div>
            <p>
              Pick a side of your internet personality.{" "}
              <br />
              We’ll find something to talk about.
            </p>
          </div>
          <div className="lineup-grid">
            {platforms.map((platform, index) => (
              <Link
                href={"/" + platform.id}
                key={platform.id}
                className={"lineup-card lineup-" + platform.color}
              >
                <div className="lineup-top">
                  <span className="platform-icon">
                    <platform.icon size={25} />
                  </span>
                  <span>0{index + 1}</span>
                </div>
                <div
                  className={"lineup-graphic graphic-" + platform.id}
                  aria-hidden="true"
                >
                  {platform.id === "github" ? (
                    <>
                      <span className="terminal-command">$ git status</span>
                      <strong>
                        nothing to
                        <br />
                        commit.
                      </strong>
                      <small>much to discuss.</small>
                      <span className="terminal-cursor">▌</span>
                    </>
                  ) : platform.id === "spotify" ? (
                    <div className="equalizer">
                      {Array.from({ length: 13 }, (_, i) => (
                        <i
                          key={i}
                          style={{
                            height: 25 + ((i * 23) % 75) + "%",
                            animationDelay: -i * 0.14 + "s",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="karma-arrows">
                        ↑<span>404</span>↓
                      </div>
                      <small>GRASS NOT FOUND</small>
                    </>
                  )}
                </div>
                <div className="lineup-content">
                  <span className="micro-label">
                    {platform.name.toUpperCase()} ROAST
                  </span>
                  <h3>
                    {platform.title.split("\n").map((line, i) => (
                      <span key={i}>{line}</span>
                    ))}
                  </h3>
                  <p>{platform.description}</p>
                  <div className="lineup-bottom">
                    <span>
                      {platform.id === "spotify"
                        ? "CONNECT ACCOUNT"
                        : "ENTER USERNAME"}
                    </span>
                    <ArrowUpRight size={23} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="manifesto-section">
          <div className="shell manifesto-grid">
            <div>
              <span className="eyebrow">
                A PERSONAL ATTACK. WITH PERSONAL DATA.
              </span>
              <h2>
                WE BRING
                <br />
                THE <span>RECEIPTS.</span>
              </h2>
            </div>
            <div className="manifesto-copy">
              <p>
                A random insult? Too easy.
                <br />A roast about your seventeenth unfinished side project?{" "}
                <strong>Now we’re talking.</strong>
              </p>
              <p>
                Cooked reads the patterns in your public profile or authorized
                listening history. Gemini connects the dots. Your ego handles
                the rest.
              </p>
              <div className="manifesto-tags">
                <span>
                  <Check size={13} />
                  Grounded in your habits
                </span>
                <span>
                  <Check size={13} />
                  Freshly generated
                </span>
                <span>
                  <Check size={13} />
                  Ready for the group chat
                </span>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="how-section shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / THE PROCESS</span>
              <h2>
                LOW EFFORT.
                <br />
                <span>HIGHLY PERSONAL.</span>
              </h2>
            </div>
            <Link href="#roast-console" className="text-link">
              Let’s get into it
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="steps-grid">
            {[
              {
                n: "01",
                title: "PICK A PLATFORM",
                text: "Your code, your music, or your takes. Everyone has a weak spot.",
              },
              {
                n: "02",
                title: "DROP YOUR HANDLE",
                text: "Use a public username, or connect your Spotify. That’s your part done.",
              },
              {
                n: "03",
                title: "TAKE IT PERSONALLY",
                text: "Read the verdict. Copy it. Send it to the group chat. Pretend you’re fine.",
              },
            ].map((step) => (
              <div className="step" key={step.n}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="faq-section shell">
          <div>
            <span className="eyebrow">03 / BEFORE THE DAMAGE</span>
            <h2>
              GOOD{" "}
              <br />
              <span>QUESTIONS.</span>
            </h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>
                Is this actually about me?<span>+</span>
              </summary>
              <p>
                Yes. We use public profile details or the Spotify listening data
                you authorize. The console preview is an illustrative example;
                your generated roast uses your own data.
              </p>
            </details>
            <details>
              <summary>
                Do I need to log in?<span>+</span>
              </summary>
              <p>
                No login for GitHub or Reddit. Just a public username. Spotify
                needs you to authorize access, and development apps are limited
                to approved accounts.
              </p>
            </details>
            <details>
              <summary>
                What happens to my data?<span>+</span>
              </summary>
              <p>
                A limited profile summary is sent to Gemini. Cooked does not
                save roast history in a database. Spotify access stays in an
                HTTP-only cookie. Hosting and AI providers apply their own data
                policies.
              </p>
            </details>
            <details>
              <summary>
                What if the roast is wrong?<span>+</span>
              </summary>
              <p>
                It’s a joke about a small slice of your online habits, not a
                verdict on you. AI can miss the mark. Take the funny parts and
                leave the rest.
              </p>
            </details>
          </div>
        </section>
        <section className="closing-section shell">
          <div className="closing-inner">
            <span className="eyebrow">YOU KNOW YOU’RE CURIOUS.</span>
            <h2>
              GO ON.
              <br />
              MAKE IT <span>PERSONAL.</span>
            </h2>
            <Link href="#roast-console" className="button button-dark">
              I CAN TAKE IT
              <ArrowUpRight size={19} />
            </Link>
            <Flame
              className="closing-flame"
              size={230}
              strokeWidth={1.2}
              aria-hidden="true"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
