import Link from "next/link";

interface TopbarProps {
  onDrawerOpen?: () => void;
}

export default function Topbar({ onDrawerOpen }: TopbarProps) {
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

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {[
          { label: "NLU Architecture", href: "#nlu" },
          { label: "Design Artifact", href: "/design-artifact" },
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
