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
  variant: _variant,
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        transition: "all 0.4s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: "9px",
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
            {isLoading ? (
              <div
                className="skeleton"
                style={{
                  width: "200px",
                  height: "24px",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: "20px",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: "var(--s-text)",
                  lineHeight: 1.2,
                }}
              >
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
              }}
            >
              {pillLabel}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "4px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: "9px",
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
              width: "100px",
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
              color: "var(--s-accent)",
            }}
          >
            {isLoading ? "—" : confidence.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
