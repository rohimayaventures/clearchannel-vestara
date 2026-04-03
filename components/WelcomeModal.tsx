"use client";

import { useState, useEffect, useRef } from "react";

const LS_KEY = "cc_welcome_seen_v2";

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(LS_KEY)) return;
    const show = requestAnimationFrame(() => {
      setVisible(true);
      requestAnimationFrame(() => setFadeIn(true));
    });
    return () => cancelAnimationFrame(show);
  }, []);

  useEffect(() => {
    if (!builderOpen) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setBuilderOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [builderOpen]);

  const dismiss = () => {
    setFadeIn(false);
    setTimeout(() => {
      localStorage.setItem(LS_KEY, "1");
      setVisible(false);
    }, 300);
  };

  if (!visible) return null;

  const sections = [
    {
      label: "Intent Bar",
      desc: "The detected intent, confidence score, and emotional sentiment — updated in real time as results stream in.",
    },
    {
      label: "IVR · Chatbot · Agent Assist",
      desc: "Three panels showing how the same utterance is handled across phone (IVR), digital chat, and live agent support. Agent Assist is not customer-facing — it shows the suggested script and policy guidance surfaced to the representative in real time.",
    },
    {
      label: "Sentiment Color Shift",
      desc: "The entire UI changes color based on the caller\u2019s emotional state — neutral, concerned, urgent, distressed, or confused.",
    },
    {
      label: "NLU Architecture",
      desc: "A collapsible section at the bottom showing the full intent taxonomy, entity extraction, training phrases, and confidence threshold.",
    },
  ];

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "min(520px, 100%)",
          margin: "auto",
          flexShrink: 0,
          padding: "32px 28px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          transform: fadeIn ? "translateY(0)" : "translateY(12px)",
          opacity: fadeIn ? 1 : 0,
          transition: "transform 0.35s ease, opacity 0.35s ease",
        }}
      >
        {/* Product name + tagline */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "22px",
                height: "22px",
                background: "#0891B2",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7h8M7 3v8"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="7" cy="7" r="5.5" stroke="#fff" strokeWidth="1.2" opacity="0.5" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#1B2E4B",
                fontFamily: "var(--font-sans)",
              }}
            >
              ClearChannel
            </span>
          </div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#8A94A0",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: "var(--font-sans)",
            }}
          >
            Enterprise Conversational AI · NLU Routing Intelligence
          </div>
        </div>

        {/* Hero text */}
        <div
          style={{
            fontSize: "19px",
            fontWeight: 700,
            lineHeight: 1.35,
            color: "#1B2E4B",
            fontFamily: "var(--font-sans)",
          }}
        >
          The first 3 seconds of a customer call determine whether they feel
          heard — or hang up.
        </div>

        {/* Subheading */}
        <div
          style={{
            fontSize: "13px",
            lineHeight: 1.6,
            color: "#3D4F63",
            fontFamily: "var(--font-sans)",
          }}
        >
          ClearChannel is an enterprise NLU routing simulator built on
          contact center architecture. Type any customer scenario and watch
          AI classify intent, score confidence, and generate
          channel-specific responses — simultaneously, in real time.
        </div>

        {/* What you'll see */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#8A94A0",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "8px",
              fontFamily: "var(--font-sans)",
            }}
          >
            What you&apos;ll see
          </div>
          {sections.map((item) => (
            <div
              key={item.label}
              className="cc-welcome-row"
              style={{
                padding: "6px 0",
                borderTop: "1px solid #F0F2F5",
                fontFamily: "var(--font-sans)",
              }}
            >
              <div
                className="cc-welcome-label"
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#1B2E4B",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  lineHeight: 1.5,
                  color: "#3D4F63",
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* How-to */}
        <div
          style={{
            fontSize: "12px",
            lineHeight: 1.5,
            color: "#3D4F63",
            background: "#F0F2F5",
            borderRadius: "6px",
            padding: "10px 14px",
            fontFamily: "var(--font-sans)",
          }}
        >
          Choose a sample scenario or type your own, then tap Analyze.
          Results stream in across all three channels at once.
        </div>

        {/* Footer row: builder note + dismiss */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginTop: "2px",
            flexWrap: "wrap",
          }}
        >
          <div ref={popoverRef}>
            <button
              onClick={() => setBuilderOpen((o) => !o)}
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#8A94A0",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "10px 4px",
                fontFamily: "var(--font-sans)",
                textDecoration: "underline",
                textDecorationColor: "rgba(138,148,160,0.4)",
                textUnderlineOffset: "2px",
              }}
            >
              Built by Hannah Kraulik Pagade
            </button>

            {builderOpen && (
              <div
                style={{
                  marginTop: "8px",
                  background: "#F8F9FA",
                  border: "1px solid #E2E5EA",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  maxWidth: "340px",
                  fontSize: "11.5px",
                  lineHeight: 1.55,
                  color: "#3D4F63",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Built by Hannah Kraulik Pagade — clinical AI builder and
                conversational systems designer with 15 years in healthcare
                operations. Every analysis is a live Claude API call. This is
                a working prototype, not a mockup.
                <div style={{ marginTop: "8px" }}>
                  <a
                    href="https://www.linkedin.com/in/hannahkraulik"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 600,
                      color: "#0891B2",
                      textDecoration: "none",
                    }}
                  >
                    LinkedIn →
                  </a>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={dismiss}
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
              background: "#1B2E4B",
              border: "none",
              borderRadius: "6px",
              padding: "12px 24px",
              minHeight: "44px",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              flexShrink: 0,
            }}
          >
            Start exploring
          </button>
        </div>
      </div>
    </div>
  );
}
