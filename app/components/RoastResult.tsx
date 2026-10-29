"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Flame,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import { Footer, Header } from "./Brand";
import { FormattedRoast } from "./FormattedRoast";
import { Platform, platformInfo } from "./PlatformPage";

export default function RoastResult({ platform }: { platform: Platform }) {
  const info = platformInfo[platform];
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const pending = useRef<{ key: string; promise: Promise<string> } | null>(
    null,
  );

  useEffect(() => {
    let current = true;
    setLoading(true);
    setError("");
    setCopyStatus("");
    setCopied(false);
    if (platform !== "spotify" && !username) {
      setError("We need a username before we can turn up the heat.");
      setLoading(false);
      return;
    }
    const key = platform + ":" + username + ":" + attempt;
    if (!pending.current || pending.current.key !== key) {
      const request =
        platform === "spotify"
          ? {
              cache: "no-store" as RequestCache,
              credentials: "include" as RequestCredentials,
            }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username }),
            };
      const promise = fetch("/api/" + platform + "/roast", request).then(
        async (response) => {
          const data = await response.json().catch(() => ({}));
          if (!response.ok)
            throw new Error(
              data.error || "The kitchen is unavailable. Please try again.",
            );
          if (typeof data.roast !== "string" || !data.roast.trim())
            throw new Error("This roast came out empty. Let’s try again.");
          return data.roast as string;
        },
      );
      pending.current = { key, promise };
    }
    pending.current.promise
      .then((text) => {
        if (current) setRoast(text);
      })
      .catch((err) => {
        if (current)
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.",
          );
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => {
      current = false;
    };
  }, [platform, username, attempt]);

  async function copyRoast() {
    try {
      await navigator.clipboard.writeText(roast.replace(/\*\*/g, ""));
      setCopied(true);
      setCopyStatus("Copied. The group chat is going to love this.");
    } catch {
      setCopyStatus(
        "Couldn’t copy automatically. You can select and copy the text above.",
      );
    }
  }

  return (
    <>
      <Header />
      <main id="main-content" className="result-page shell">
        <Link className="back-link" href={"/" + platform}>
          <ArrowLeft size={15} /> Back to {info.name}
        </Link>
        <div className="result-inner">
          <div className="result-heading">
            <div>
              <span className="eyebrow">
                {loading
                  ? "THE HEAT IS ON"
                  : error
                    ? "A SMALL KITCHEN INCIDENT"
                    : "FRESH OFF THE GRILL"}
              </span>
              <h1>
                {loading ? (
                  <>
                    Let it <span className="serif-word">cook.</span>
                  </>
                ) : error ? (
                  <>
                    Not quite <span className="serif-word">done.</span>
                  </>
                ) : (
                  <>
                    You’ve been <span className="serif-word">cooked.</span>
                  </>
                )}
              </h1>
            </div>
            <span className="result-badge">
              <info.icon size={15} />
              {username ? "@" + username : info.name}
            </span>
          </div>
          {loading ? (
            <div className="result-state" role="status" aria-live="polite">
              <div className="heat-loader">
                <Flame size={35} />
              </div>
              <h2>Questionable choices. Quality ingredients.</h2>
              <p>
                Reading your{" "}
                {platform === "github"
                  ? "public profile and repositories"
                  : platform === "reddit"
                    ? "public posts and comments"
                    : "listening habits"}{" "}
                and putting together something painfully personal.
              </p>
            </div>
          ) : error ? (
            <div className="result-state" role="alert">
              <div className="error-icon">
                <TriangleAlert size={26} />
              </div>
              <h2>The roast needs a minute.</h2>
              <p>{error}</p>
              <div className="result-actions justify-center">
                <button
                  className="button button-dark"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  <RefreshCw size={15} />
                  Try again
                </button>
                <Link href={"/" + platform} className="button button-outline">
                  {platform === "spotify"
                    ? "Reconnect Spotify"
                    : "Change username"}
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <article className="roast-panel entrance">
                <div className="roast-meta">
                  <span>THE {info.name.toUpperCase()} VERDICT</span>
                  <span>NO SUGAR ADDED.</span>
                </div>
                <div className="roast-text">
                  <FormattedRoast text={roast} />
                </div>
                <div className="roast-stamp">
                  <span>
                    <Flame size={14} /> cooked. with love.
                  </span>
                  <span>TAKE THE JOKE. LEAVE THE EGO.</span>
                </div>
              </article>
              <div className="result-actions">
                <button className="button button-dark" onClick={copyRoast}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied" : "Copy roast"}
                </button>
                <button
                  className="button button-outline"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  <RefreshCw size={15} />
                  Another serving
                </button>
                <Link className="text-link" href="/#menu">
                  Try another platform
                  <ArrowUpRight size={15} />
                </Link>
              </div>
              <p role="status" className="copy-status">
                {copyStatus}
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
