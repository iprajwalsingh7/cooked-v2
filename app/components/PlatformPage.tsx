"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  Headphones,
  LockKeyhole,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { Footer, Header, HeatArt } from "./Brand";

export const platformInfo = {
  github: {
    name: "GitHub",
    icon: Github,
    kicker: "FOR THE SHIP-IT TOMORROWS",
    title: "Your code has",
    emphasis: "a backstory.",
    description:
      "The side projects. The abandoned forks. The README doing all the heavy lifting. Let’s talk about it.",
    button: "Roast my GitHub",
    placeholder: "Your GitHub username",
    hint: "Public repositories and profile only. No sign-in needed.",
    color: "lilac",
  },
  reddit: {
    name: "Reddit",
    icon: MessageCircle,
    kicker: "FOR THE COMMENT SECTION",
    title: "So many takes.",
    emphasis: "So little grass.",
    description:
      "Your karma has gone up. Your screen time has too. Let’s see what your corner of the internet says about you.",
    button: "Roast my Reddit",
    placeholder: "Your Reddit username",
    hint: "Public profile and recent activity only. No sign-in needed.",
    color: "orange",
  },
  spotify: {
    name: "Spotify",
    icon: Headphones,
    kicker: "FOR THE REPEAT OFFENDERS",
    title: "Great headphones.",
    emphasis: "Brave choices.",
    description:
      "You’ve got a soundtrack for every emotion. We’ve got some feelings about your soundtrack.",
    button: "Connect with Spotify",
    placeholder: "",
    hint: "We read your listening habits. We never change your playlists.",
    color: "green",
  },
};

export type Platform = keyof typeof platformInfo;

export default function PlatformPage({ platform }: { platform: Platform }) {
  const info = platformInfo[platform];
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const cleaned = username
      .trim()
      .replace(platform === "reddit" ? /^u\// : /^@/, "");
    if (!cleaned) return;
    setSubmitting(true);
    router.push(
      "/" + platform + "/roast?username=" + encodeURIComponent(cleaned),
    );
  }

  return (
    <>
      <Header />
      <main
        id="main-content"
        className={"platform-page shell theme-" + info.color}
      >
        <Link className="back-link" href="/#menu">
          <ArrowLeft size={15} /> Back to the menu
        </Link>
        <div className="platform-page-grid">
          <section className="platform-intro entrance">
            <span className="platform-pill">
              <info.icon size={16} /> {info.name} roast
            </span>
            <div className="eyebrow">{info.kicker}</div>
            <h1>
              {info.title}
              <br />
              <span className="serif-word">{info.emphasis}</span>
            </h1>
            <p className="platform-description">{info.description}</p>
            {error && (
              <div className="inline-error" role="alert">
                {error === "access_denied"
                  ? "Connection cancelled. You can try again when you’re ready."
                  : "We couldn’t connect your Spotify account. Please reconnect."}
              </div>
            )}
            {platform === "spotify" ? (
              <>
                <a href="/api/auth/login" className="button button-dark">
                  <Headphones size={18} /> {info.button}
                  <ArrowUpRight size={18} />
                </a>
                <details className="spotify-help">
                  <summary>Having trouble connecting?</summary>
                  <p>
                    Spotify limits development apps to approved accounts. Your
                    account needs to be on the app’s allowlist. GitHub roasting
                    is open to public usernames.
                  </p>
                  <Link href="/github">Try a GitHub roast ↗</Link>
                </details>
              </>
            ) : (
              <form className="username-form" onSubmit={submit}>
                <label htmlFor="username">{info.placeholder}</label>
                <div className="input-wrap">
                  <span>{platform === "github" ? "@" : "u/"}</span>
                  <input
                    id="username"
                    name="username"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder={platform === "github" ? "octocat" : "username"}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    maxLength={platform === "github" ? 39 : 22}
                    required
                    pattern={
                      platform === "github"
                        ? "@?[A-Za-z0-9][A-Za-z0-9-]*"
                        : "(u/)?[A-Za-z0-9_-]{3,20}"
                    }
                  />
                  <button
                    type="submit"
                    disabled={!username.trim() || submitting}
                    aria-label={info.button}
                  >
                    <ArrowUpRight size={24} />
                  </button>
                </div>
                <span className="form-caption">
                  {submitting
                    ? "Heating things up…"
                    : "Enter your username. Leave the ego at the door."}
                </span>
              </form>
            )}
            <p className="privacy-note">
              <LockKeyhole size={13} />
              {info.hint}
            </p>
          </section>
          <div className="platform-side-art">
            <HeatArt compact />
            <div className="side-art-caption">
              <span>ON TODAY’S MENU</span>
              <strong>
                {platform === "github"
                  ? "Technical debt.\nEmotional interest."
                  : platform === "reddit"
                    ? "Hot takes.\nCold reality."
                    : "Heavy rotation.\nLight judgment."}
              </strong>
              <span>PREPARED WITH QUESTIONABLE LOVE.</span>
            </div>
          </div>
        </div>
        <div className="platform-bottom">
          <span>
            Public profile details are processed by Gemini to create your roast.
          </span>
          <div>
            {Object.entries(platformInfo)
              .filter(([key]) => key !== platform)
              .map(([key, value]) => (
                <Link key={key} href={"/" + key}>
                  {value.name}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
