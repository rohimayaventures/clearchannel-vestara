"use client";

interface IntentBarProps {
  intent: string;
  variant: string | null;
  confidence: number;
  sentiment: string;
  isLoading: boolean;
}

export default function IntentBar({
  intent,
  confidence,
  sentiment,
  isLoading,
}: IntentBarProps) {
  const pillLabel = sentiment.toUpperCase();

  return (
    <div
      style={{
        width: "100%",
        background: "var(--s-intent-bg)",
        borderBottom: "0.5px solid var(--s-border)",
        padding: "10px 16px",
        flexShrink: 0,
        transition: "all 0.4s ease",
      }}
    >
      <div className="cc-intent-bar-inner">
        <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--s-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              DETECTED INTENT
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "2px",
                flexWrap: "wrap",
                gap: "0 0",
              }}
            >
              {isLoading && !intent ? (
                <div
                  className="skeleton"
                  style={{ width: "min(200px, 60%)", height: "24px", borderRadius: "4px" }}
                />
              ) : (
                <div className="cc-intent-name">
                  {intent || "—"}
                </div>
              )}
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  marginLeft: "12px",
                  background: "var(--s-pill-bg)",
                  color: "var(--s-pill-text)",
                  flexShrink: 0,
                  transition: "all 0.5s ease",
                }}
              >
                {pillLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="cc-intent-bar-right">
          <div
            style={{
              fontSize: "10px",
              color: "var(--s-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 700,
            }}
          >
            Confidence
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "min(100px, 100%)",
                height: "3px",
                background: "var(--s-border)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(1, Math.max(0, confidence)) * 100}%`,
                  background: "var(--s-accent)",
                  borderRadius: "2px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--s-accent-text)",
                transition: "color 0.5s ease",
              }}
            >
              {isLoading && !intent ? "—" : confidence.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
