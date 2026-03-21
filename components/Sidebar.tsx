"use client";

import { SAMPLE_UTTERANCES } from "@/lib/types";
import VoiceInput from "@/components/VoiceInput";

interface SidebarProps {
  utterance: string;
  onUtteranceChange: (value: string) => void;
  onAnalyze: () => void;
  activeIndex: number;
  onSampleClick: (index: number, value: string) => void;
  intent: string;
  confidence: number;
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  utterance,
  onUtteranceChange,
  onAnalyze,
  activeIndex,
  onSampleClick,
  intent,
  confidence,
  isLoading,
  isOpen,
  onToggle,
}: SidebarProps) {
  const handleTranscript = (text: string) => {
    onUtteranceChange(text);
    setTimeout(() => onAnalyze(), 100);
  };

  return (
    <div
      style={{
        width: isOpen ? "210px" : "36px",
        flexShrink: 0,
        background: "#fff",
        borderRight: "1px solid var(--color-gray-border)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "width 0.25s ease",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <button
        onClick={onToggle}
        title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        style={{
          position: "absolute",
          top: "10px",
          right: "8px",
          width: "20px",
          height: "20px",
          background: "var(--color-gray-surface)",
          border: "1px solid var(--color-gray-border)",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          flexShrink: 0,
          padding: 0,
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
            stroke="var(--color-text-muted)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              padding: "14px 14px 10px",
              borderBottom: "1px solid var(--color-gray-border)",
              paddingRight: "36px",
            }}
          >
            <div
              style={{
                fontSize: "9.5px",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                marginBottom: "7px",
              }}
            >
              Investor Utterance
            </div>
            <textarea
              value={utterance}
              onChange={(e) => onUtteranceChange(e.target.value)}
              style={{
                width: "100%",
                height: "64px",
                background: "var(--color-gray-surface)",
                border: "1px solid var(--color-gray-border)",
                borderRadius: "5px",
                padding: "8px 10px",
                fontSize: "12px",
                fontFamily: "var(--font-sans)",
                resize: "none",
                color: "var(--color-text-primary)",
                outline: "none",
              }}
            />
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              style={{
                display: "block",
                width: "100%",
                marginTop: "8px",
                background: "var(--color-navy)",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "8px 0",
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
              onTranscript={handleTranscript}
              isAnalyzing={isLoading}
            />
          </div>

          <div
            style={{
              margin: "10px 14px 0",
              background: "var(--color-teal-light)",
              border: "1px solid var(--color-teal-border)",
              borderRadius: "5px",
              padding: "7px 10px",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: "var(--color-teal)",
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
                color: "var(--color-text-primary)",
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
                color: "var(--color-text-muted)",
                flexShrink: 0,
              }}
            >
              Confidence
            </span>
            <div
              style={{
                flex: 1,
                height: "3px",
                background: "var(--color-gray-border)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "var(--color-teal)",
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
                color: "var(--color-teal)",
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
                fontSize: "9.5px",
                fontWeight: 700,
                color: "var(--color-text-muted)",
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
                  padding: "7px 9px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  lineHeight: 1.45,
                  cursor: "pointer",
                  marginBottom: "5px",
                  background:
                    index === activeIndex
                      ? "var(--color-teal-light)"
                      : "var(--color-gray-surface)",
                  border:
                    index === activeIndex
                      ? "1px solid var(--color-teal-border)"
                      : "1px solid var(--color-gray-border)",
                  color:
                    index === activeIndex
                      ? "var(--color-text-primary)"
                      : "var(--color-text-secondary)",
                  fontWeight: index === activeIndex ? 500 : 400,
                }}
              >
                {sample}
              </div>
            ))}

            <div
              style={{
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px solid var(--color-gray-border)",
              }}
            >
              <div
                style={{
                  fontSize: "9.5px",
                  fontWeight: 700,
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                  marginBottom: "6px",
                }}
              >
                Test your own scenario
              </div>
              <div
                style={{
                  fontSize: "10.5px",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                Type any investor utterance above and click Analyze.
              </div>
            </div>
          </div>
        </>
      )}

      {!isOpen && (
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
              color: "var(--color-text-muted)",
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