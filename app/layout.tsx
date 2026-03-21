import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClearChannel — Conversational Design Lab | Vestara",
  description: "IVR, Chatbot, and Agent Assist channel simulator built with Claude API and OpenAI TTS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}