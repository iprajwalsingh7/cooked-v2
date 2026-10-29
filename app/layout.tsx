import "@fontsource/bebas-neue/latin-400.css";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Cooked — Your digital life. Exposed.",
  description:
    "Personalized AI roasts for your Spotify taste, GitHub habits, and Reddit takes. Three ways in. No ego out.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
