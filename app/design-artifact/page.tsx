import { Fragment } from "react";
import {
  INTENTS,
  OVERRIDES,
  ENTITIES,
  SENTIMENT_STATES,
  CATEGORY_ORDER,
  type SentimentId,
} from "@/lib/designArtifactData";

function sentimentAccent(id: SentimentId): string {
  return SENTIMENT_STATES.find((s) => s.id === id)?.accent ?? "#0891B2";
}

function sectionHeader(text: string) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--color-teal)",
        marginBottom: "20px",
        marginTop: "48px",
      }}
    >
      {text}
    </h2>
  );
}

const channelMatrix = {
  ivr: [
    "Outputs a full spoken_response string with [pause Xms] and [await] prosody markers for telephony playback.",
    "Surfaces entities_found and entities_missing for capture state before routing.",
    "Includes route and fallback strings plus a short status_badge for the panel header.",
    "Channel-specific: word-count cap under barge-in override (under 40 words); bereavement path suppresses verification-first prompts.",
    "Produces audible-first copy — no reliance on buttons or visual layout in the script itself.",
  ],
  chatbot: [
    "Returns response body text, quick_replies array, and containment level (Contained | Escalate | Partial).",
    "Always includes handoff_context: a single sentence that travels to a live agent if the session escalates.",
    "Surfaces status_badge for at-a-glance state in the digital panel.",
    "Channel-specific: can use progressive disclosure and chip-style quick replies that would not map 1:1 to IVR.",
    "Handoff context is the continuity layer so the customer does not repeat themselves when moving to phone or agent.",
  ],
  agentAssist: [
    "Surfaces suggested_script as natural spoken English for the representative to read aloud.",
    "Includes policy_text, policy_ref, and auto_surfaced for compliance and lookup acceleration.",
    "compliance_flag is nullable — populated when policy thresholds (e.g. large transfers) or sensitive protocols apply.",
    "Channel-specific: not customer-facing; optimizes for rep screen density, escalation, and documentation checklists.",
    "status_badge aligns the assist surface with IVR and chatbot state for three-channel coherence.",
  ],
};

export default function DesignArtifactPage() {
  const intentsByCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: INTENTS.filter((i) => i.category === cat),
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-gray-bg)",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        color: "var(--color-text-primary)",
      }}
    >
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "40px 24px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "32px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "13px",
                color: "var(--color-teal)",
                marginBottom: "8px",
              }}
            >
              ClearChannel by Vestara
            </p>
            <h1
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "28px",
                fontWeight: 600,
                color: "var(--color-navy)",
                lineHeight: 1.25,
                marginBottom: "10px",
              }}
            >
              Conversation Design Artifact
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-text-muted)",
                maxWidth: "640px",
                lineHeight: 1.5,
              }}
            >
              Intent taxonomy, override rules, entity schema, channel routing, and
              sentiment architecture.
            </p>
          </div>
          <p
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              color: "var(--color-text-muted)",
              marginTop: "4px",
            }}
          >
            v1.0 — April 2026
          </p>
        </div>

        {sectionHeader("Section 1 — Intent taxonomy")}
        <div
          style={{
            border: "1px solid var(--color-gray-border)",
            borderRadius: "8px",
            overflow: "hidden",
            background: "var(--color-gray-surface)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ background: "var(--color-gray-bg)" }}>
                {["Intent", "Category", "Confidence threshold", "Sentiment state", "Description"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 14px",
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--color-text-secondary)",
                        borderBottom: "1px solid var(--color-gray-border)",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {intentsByCategory.map(({ category, items }) => (
                <Fragment key={category}>
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "8px 14px",
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--color-teal)",
                        background: "rgba(8, 145, 178, 0.06)",
                        borderTop: "1px solid var(--color-gray-border)",
                        borderBottom: "1px solid var(--color-gray-border)",
                      }}
                    >
                      {category}
                    </td>
                  </tr>
                  {items.map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        background: "#fff",
                        borderBottom: "1px solid var(--color-gray-border)",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 14px",
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "12px",
                          color: "var(--color-navy)",
                          verticalAlign: "top",
                        }}
                      >
                        {row.label}
                        <div
                          style={{
                            fontSize: "10px",
                            color: "var(--color-text-muted)",
                            marginTop: "4px",
                          }}
                        >
                          {row.id}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          verticalAlign: "top",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {row.category}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "12px",
                          verticalAlign: "top",
                        }}
                      >
                        {row.confidence}%
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          verticalAlign: "top",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: sentimentAccent(row.sentiment),
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "var(--font-mono), monospace",
                              fontSize: "12px",
                            }}
                          >
                            {row.sentiment}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          verticalAlign: "top",
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.45,
                        }}
                      >
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {sectionHeader("Section 2 — Override priority rules")}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "16px",
          }}
          className="design-artifact-override-grid"
        >
          {OVERRIDES.map((o) => {
            const accent = sentimentAccent(o.sentiment);
            return (
              <div
                key={o.priority}
                style={{
                  background: "#fff",
                  border: "1px solid var(--color-gray-border)",
                  borderLeft: `3px solid ${accent}`,
                  borderRadius: "8px",
                  padding: "18px 18px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#fff",
                      background: "var(--color-navy)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    P{o.priority}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontWeight: 600,
                      fontSize: "15px",
                      color: "var(--color-navy)",
                    }}
                  >
                    {o.name}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    fontStyle: "italic",
                    color: "var(--color-text-muted)",
                    marginBottom: "12px",
                    lineHeight: 1.45,
                  }}
                >
                  {o.trigger}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: accent,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "12px",
                    }}
                  >
                    {o.sentiment}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  Structural changes
                </p>
                <ul
                  style={{
                    margin: "0 0 16px 18px",
                    padding: 0,
                    color: "var(--color-text-secondary)",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  {o.structuralChanges.map((s) => (
                    <li key={s} style={{ marginBottom: "4px" }}>
                      {s}
                    </li>
                  ))}
                </ul>
                <p
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  Channel behavior
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {(
                    [
                      ["IVR", o.channelBehavior.ivr],
                      ["Chatbot", o.channelBehavior.chatbot],
                      ["Agent Assist", o.channelBehavior.agentAssist],
                    ] as const
                  ).map(([label, text]) => (
                    <div key={label}>
                      <div
                        style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--color-teal)",
                          marginBottom: "4px",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.45,
                        }}
                      >
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {sectionHeader("Section 3 — Entity schema")}
        <div
          style={{
            border: "1px solid var(--color-gray-border)",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "var(--color-gray-bg)" }}>
                {["Entity", "Type", "Required", "Used by", "Description"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--color-text-secondary)",
                      borderBottom: "1px solid var(--color-gray-border)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENTITIES.map((e) => (
                <tr key={e.name} style={{ borderBottom: "1px solid var(--color-gray-border)" }}>
                  <td
                    style={{
                      padding: "12px 14px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "12px",
                      verticalAlign: "top",
                    }}
                  >
                    {e.name}
                  </td>
                  <td style={{ padding: "12px 14px", verticalAlign: "top" }}>{e.type}</td>
                  <td
                    style={{
                      padding: "12px 14px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "14px",
                      verticalAlign: "top",
                    }}
                  >
                    {e.required ? "✓" : "—"}
                  </td>
                  <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {e.usedByIntents.map((id) => (
                        <span
                          key={id}
                          style={{
                            fontFamily: "var(--font-mono), monospace",
                            fontSize: "11px",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            background: "var(--color-teal-light)",
                            color: "var(--color-teal)",
                          }}
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      verticalAlign: "top",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.45,
                    }}
                  >
                    {e.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sectionHeader("Section 4 — Channel routing matrix")}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
          }}
          className="design-artifact-channel-grid"
        >
          {(
            [
              ["IVR", channelMatrix.ivr],
              ["Chatbot", channelMatrix.chatbot],
              ["Agent Assist", channelMatrix.agentAssist],
            ] as const
          ).map(([title, bullets]) => (
            <div
              key={title}
              style={{
                background: "#fff",
                border: "1px solid var(--color-gray-border)",
                borderRadius: "8px",
                padding: "18px 16px",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-teal)",
                  marginBottom: "14px",
                }}
              >
                {title}
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  color: "var(--color-text-secondary)",
                  fontSize: "13px",
                  lineHeight: 1.55,
                }}
              >
                {bullets.map((b) => (
                  <li key={b} style={{ marginBottom: "8px" }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {sectionHeader("Section 5 — Sentiment state map")}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {SENTIMENT_STATES.map((s) => (
            <div
              key={s.id}
              style={{
                flex: "1 1 180px",
                minWidth: "160px",
                maxWidth: "calc(33.333% - 11px)",
                border: "1px solid var(--color-gray-border)",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#fff",
              }}
              className="design-artifact-sentiment-card"
            >
              <div
                style={{
                  height: "48px",
                  background: s.topbar,
                }}
              />
              <div style={{ padding: "14px 14px 16px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--color-navy)",
                    marginBottom: "12px",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "10px",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.6,
                    marginBottom: "12px",
                  }}
                >
                  topbar {s.topbar}
                  <br />
                  accent {s.accent}
                  <br />
                  bg {s.bg}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {s.triggerCategories.map((c) => (
                    <span
                      key={c}
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "10px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        background: "var(--color-gray-surface)",
                        color: "var(--color-text-secondary)",
                        border: "1px solid var(--color-gray-border)",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .design-artifact-override-grid {
            grid-template-columns: 1fr !important;
          }
          .design-artifact-channel-grid {
            grid-template-columns: 1fr !important;
          }
          .design-artifact-sentiment-card {
            max-width: calc(50% - 8px) !important;
          }
        }
        @media (max-width: 520px) {
          .design-artifact-sentiment-card {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
