"use client";

import { SAMPLE_UTTERANCES } from "@/lib/types";
import VoiceInput from "@/components/VoiceInput";

interface SidebarProps {
  utterance: string;
  onUtteranceChange: (value: string) => void;
  onAnalyze: () => void;
  onVoiceAnalyze: (text: string) => void;
  activeIndex: number;
  onSampleClick: (index: number, value: string) => void;
  intent: string;
  confidence: number;
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  isMobileDrawer?: boolean;
}

export default function Sidebar({
  utterance,
  onUtteranceChange,
  onAnalyze,
  onVoiceAnalyze,
  activeIndex,
  onSampleClick,
  intent,
  confidence,
  isLoading,
  isOpen,
  onToggle,
  isMobileDrawer = false,
}: SidebarProps) {
  const showContent = isMobileDrawer || isOpen;

  return (
    <div
      style={{
        width: isMobileDrawer ? "100%" : (isOpen ? "210px" : "36px"),
        flexShrink: 0,
        background: "var(--s-surface)",
        borderRight: "1px solid var(--s-border)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.4s ease",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Desktop collapse toggle — hidden on mobile via .cc-sidebar-toggle class */}
      <button
        onClick={onToggle}
        title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        className="cc-sidebar-toggle"
        style={{
          position: "absolute",
          top: "10px",
          right: "8px",
          width: "20px",
          height: "20px",
          background: "var(--s-surface-2)",
          border: "1px solid var(--s-border)",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          flexShrink: 0,
          padding: 0,
          transition: "all 0.4s ease",
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{
            transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.25s ease",
          }}
        >
          <path
            d="M6.5 2L3.5 5l3 3"
            stroke="var(--s-text-muted)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {showContent && (
        <>
          <div
            style={{
              padding: "14px 14px 10px",
              borderBottom: "1px solid var(--s-border)",
              paddingRight: "36px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--s-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                marginBottom: "7px",
              }}
            >
              Customer Utterance
            </div>
            <textarea
              value={utterance}
              onChange={(e) => onUtteranceChange(e.target.value)}
              style={{
                width: "100%",
                height: "64px",
                background: "var(--s-surface-2)",
                border: "1px solid var(--s-border)",
                borderRadius: "5px",
                padding: "8px 10px",
                fontSize: "12px",
                fontFamily: "var(--font-sans)",
                resize: "none",
                color: "var(--s-text)",
                outline: "none",
                transition: "all 0.4s ease",
              }}
            />
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              style={{
                display: "block",
                width: "100%",
                marginTop: "8px",
                background: "#1B2E4B",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "10px 0",
                minHeight: "44px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
                fontFamily: "var(--font-sans)",
              }}
            >
              {isLoading ? "Analyzing..." : "Analyze across all channels →"}
            </button>
            <VoiceInput
              onTranscript={onVoiceAnalyze}
              isAnalyzing={isLoading}
            />
          </div>

          <div
            style={{
              margin: "10px 14px 0",
              background: "var(--s-accent-light)",
              border: "1px solid var(--s-accent-border)",
              borderRadius: "5px",
              padding: "7px 10px",
              transition: "all 0.4s ease",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--s-accent-text)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Detected Intent
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color: "var(--s-text)",
                marginTop: "2px",
                wordBreak: "break-all",
                lineHeight: 1.3,
              }}
            >
              {intent || "—"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px 10px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "var(--s-text-muted)",
                flexShrink: 0,
              }}
            >
              Confidence
            </span>
            <div
              style={{
                flex: 1,
                height: "3px",
                background: "var(--s-border)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "var(--s-accent)",
                  borderRadius: "2px",
                  width: `${confidence * 100}%`,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--s-accent-text)",
                flexShrink: 0,
              }}
            >
              {confidence.toFixed(2)}
            </span>
          </div>

          <div
            style={{
              padding: "10px 14px",
              flex: 1,
              overflowY: "auto",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--s-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                marginBottom: "8px",
              }}
            >
              Sample Utterances
            </div>
            {SAMPLE_UTTERANCES.map((sample, index) => (
              <div
                key={index}
                onClick={() => onSampleClick(index, sample)}
                style={{
                  padding: "10px 9px",
                  minHeight: "44px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  lineHeight: 1.45,
                  cursor: "pointer",
                  marginBottom: "5px",
                  background:
                    index === activeIndex
                      ? "var(--s-accent-light)"
                      : "var(--s-surface-2)",
                  border:
                    index === activeIndex
                      ? "1px solid var(--s-accent-border)"
                      : "1px solid var(--s-border)",
                  color:
                    index === activeIndex
                      ? "var(--s-text)"
                      : "var(--s-text-2)",
                  fontWeight: index === activeIndex ? 500 : 400,
                  transition: "all 0.4s ease",
                }}
              >
                {sample}
              </div>
            ))}

            <div
              style={{
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px solid var(--s-border)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--s-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                  marginBottom: "6px",
                }}
              >
                Test your own scenario
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--s-text-2)",
                  lineHeight: 1.5,
                }}
              >
                Type any customer utterance above and click Analyze.
              </div>
            </div>
          </div>
        </>
      )}

      {!showContent && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "44px",
            gap: "16px",
          }}
        >
          <div
            style={{
              writingMode: "vertical-rl",
              fontSize: "9px",
              fontWeight: 700,
              color: "var(--s-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              transform: "rotate(180deg)",
            }}
          >
            Utterances
          </div>
        </div>
      )}
    </div>
  );
}
