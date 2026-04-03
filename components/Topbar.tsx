import Link from "next/link";

interface TopbarProps {
  onDrawerOpen?: () => void;
  realtimeActive?: boolean;
  onRealtimeToggle?: () => void;
}

export default function Topbar({ onDrawerOpen, realtimeActive, onRealtimeToggle }: TopbarProps) {
  return (
    <nav
      style={{
        background: "var(--s-topbar)",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        flexShrink: 0,
        transition: "all 0.4s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
        <div
          style={{
            width: "26px",
            height: "26px",
            background: "var(--s-logo)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "#ffffff",
            transition: "background 0.5s ease",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7h8M7 3v8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle
              cx="7"
              cy="7"
              r="5.5"
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.5"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--s-topbar-text)",
          }}
        >
          Vestara
        </span>
        <div className="cc-topbar-subtitle">
          <div
            style={{
              width: "1px",
              height: "14px",
              background: "var(--s-topbar-muted)",
              margin: "0 2px",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              color: "var(--s-topbar-muted)",
            }}
          >
            ClearChannel — Conversational Design Lab
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div className="cc-topbar-navlinks">
          {[
            { label: "NLU Architecture", href: "#nlu" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--s-topbar-muted)",
                background: "rgba(255,255,255,0.08)",
                padding: "3px 9px",
                borderRadius: "3px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                transition: "all 0.4s ease",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Live Call toggle — always visible */}
        <button
          onClick={onRealtimeToggle}
          title="Speak a live investor scenario and watch ClearChannel respond in real time"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            minHeight: "44px",
            background: realtimeActive ? "#DC2626" : "rgba(34,197,94,0.15)",
            border: `1px solid ${realtimeActive ? "#DC2626" : "rgba(34,197,94,0.5)"}`,
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: realtimeActive ? "#ffffff" : "#22C55E",
            fontFamily: "var(--font-sans)",
            flexShrink: 0,
            boxShadow: realtimeActive ? "none" : "0 0 12px rgba(34,197,94,0.3)",
            transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          {realtimeActive ? (
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <rect x="1.5" y="1.5" width="6" height="6" rx="1" fill="#ffffff" />
            </svg>
          ) : (
            <>
              <span className="cc-topbar-pulse" />
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <rect x="3" y="0.5" width="3" height="4.5" rx="1.5" stroke="#22C55E" strokeWidth="1.1" />
                <path d="M1.5 4.5a3 3 0 006 0" stroke="#22C55E" strokeWidth="1.1" strokeLinecap="round" />
                <line x1="4.5" y1="7.5" x2="4.5" y2="6.5" stroke="#22C55E" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
            </>
          )}
          {realtimeActive ? "End Call" : "Live Call"}
        </button>

        {/* Hamburger — visible on mobile only via .cc-hamburger class */}
        <button
          className="cc-hamburger"
          onClick={onDrawerOpen}
          aria-label="Open navigation"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4h12M2 8h12M2 12h12"
              stroke="var(--s-accent-text)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
