import Link from "next/link";

export default function Topbar() {
  return (
    <nav
      style={{
        background: "var(--color-navy)",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
        <div
          style={{
            width: "26px",
            height: "26px",
            background: "var(--color-teal)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7h8M7 3v8"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle
              cx="7"
              cy="7"
              r="5.5"
              stroke="#fff"
              strokeWidth="1.2"
              opacity="0.5"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Vestara
        </span>
        <div
          style={{
            width: "1px",
            height: "14px",
            background: "rgba(255,255,255,0.2)",
            margin: "0 2px",
          }}
        />
        <span
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          ClearChannel — Conversational Design Lab
        </span>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
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
              color: "rgba(255,255,255,0.5)",
              background: "rgba(255,255,255,0.08)",
              padding: "3px 9px",
              borderRadius: "3px",
              textDecoration: "none",
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}