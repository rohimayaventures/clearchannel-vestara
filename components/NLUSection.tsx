"use client";

import { AnalysisResult } from "@/lib/types";

interface NLUSectionProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

function ColLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "9px",
        fontWeight: 700,
        color: "var(--color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        paddingBottom: "5px",
        borderBottom: "1px solid var(--color-gray-border)",
        marginBottom: "5px",
      }}
    >
      {children}
    </div>
  );
}

function MonoItem({
  children,
  highlight,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        fontSize: "10.5px",
        fontFamily: "var(--font-mono)",
        background: highlight
          ? "var(--color-teal-light)"
          : "var(--color-gray-surface)",
        color: highlight ? "#0E6E8A" : "var(--color-text-secondary)",
        padding: "3px 6px",
        borderRadius: "3px",
        marginBottom: "4px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

function SkeletonRow({ width = "100%" }: { width?: string }) {
  return (
    <div
      className="skeleton"
      style={{
        height: "24px",
        background: "var(--color-gray-surface)",
        borderRadius: "3px",
        width,
        marginBottom: "4px",
      }}
    />
  );
}

export default function NLUSection({ result, isLoading }: NLUSectionProps) {
  return (
    <div
      id="nlu"
      style={{
        background: "#fff",
        border: "1px solid var(--color-gray-border)",
        borderRadius: "8px",
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: "9.5px",
          fontWeight: 700,
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "11px",
        }}
      >
        NLU Architecture
        {result && (
          <span
            style={{
              color: "var(--color-text-primary)",
              marginLeft: "6px",
            }}
          >
            — {result.intent.primary}
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gap: "10px",
        }}
      >
        {isLoading || !result ? (
          Array.from({ length: 4 }).map((_, col) => (
            <div key={col}>
              <SkeletonRow width="60%" />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow width="80%" />
            </div>
          ))
        ) : (
          <>
            <div>
              <ColLabel>Intent</ColLabel>
              {result.nlu.intents.map((i) => (
                <MonoItem key={i} highlight>
                  {i}
                </MonoItem>
              ))}
            </div>

            <div>
              <ColLabel>Entities</ColLabel>
              {result.nlu.entities.map((e) => (
                <MonoItem key={e}>{e}</MonoItem>
              ))}
            </div>

            <div>
              <ColLabel>Training Phrases</ColLabel>
              {result.nlu.training_phrases.map((p) => (
                <MonoItem key={p}>&quot;{p}&quot;</MonoItem>
              ))}
            </div>

            <div>
              <ColLabel>Confidence Threshold</ColLabel>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  marginTop: "4px",
                  marginBottom: "6px",
                }}
              >
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
                      background: "var(--color-navy)",
                      borderRadius: "2px",
                      width: `${result.nlu.confidence_threshold * 100}%`,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {result.nlu.confidence_threshold.toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  fontSize: "9.5px",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.4,
                }}
              >
                {result.nlu.threshold_note}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}