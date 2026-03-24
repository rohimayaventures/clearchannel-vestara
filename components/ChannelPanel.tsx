"use client";

import { AnalysisResult } from "@/lib/types";
import IVRPlayer from "@/components/IVRPlayer";

interface ChannelPanelProps {
  channel: "ivr" | "chatbot" | "agent_assist";
  result: AnalysisResult | null;
  isLoading: boolean;
}

const CHANNEL_CONFIG = {
  ivr: {
    name: "IVR",
    desc: "Phone channel",
    icon: (
      <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
        <path
          d="M2 2a1 1 0 011-1h1.5a1 1 0 011 .75l.5 2a1 1 0 01-.28.97l-.72.72a7 7 0 003.56 3.56l.72-.72a1 1 0 01.97-.28l2 .5A1 1 0 0113 9.5V11a1 1 0 01-1 1A10 10 0 012 2z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
  chatbot: {
    name: "Chatbot",
    desc: "Digital channel",
    icon: (
      <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
        <path
          d="M1 2a1 1 0 011-1h9a1 1 0 011 1v6a1 1 0 01-1 1H4L1 11V2z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
  agent_assist: {
    name: "Agent Assist",
    desc: "Live agent support",
    icon: (
      <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
        <circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M1.5 11c0-2.2 2.2-4 5-4s5 1.8 5 4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "9px",
        fontWeight: 700,
        color: "var(--s-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.09em",
        marginBottom: "3px",
      }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ height: "1px", background: "var(--s-border)" }} />
  );
}

function SkeletonRow({ width = "100%" }: { width?: string }) {
  return (
    <div
      className="skeleton"
      style={{
        height: "12px",
        background: "var(--s-surface-2)",
        borderRadius: "3px",
        width,
      }}
    />
  );
}

function IVRBody({ data }: { data: AnalysisResult["ivr"] }) {
  return (
    <>
      <div>
        <FieldLabel>Spoken Response</FieldLabel>
        <div
          style={{
            fontSize: "10.5px",
            fontFamily: "var(--font-mono)",
            background: "var(--s-mono-tint)",
            padding: "6px 8px",
            borderRadius: "4px",
            lineHeight: 1.6,
            color: "var(--s-text)",
          }}
          dangerouslySetInnerHTML={{
            __html: data.spoken_response.replace(
              /\[([^\]]+)\]/g,
              '<span style="color:var(--s-prosody);font-style:italic;">[$1]</span>'
            ),
          }}
        />
      </div>
      <Divider />
      <div>
        <FieldLabel>Entities Extracted</FieldLabel>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {data.entities_found.map((e) => (
            <span
              key={e}
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "3px",
                fontFamily: "var(--font-mono)",
                background: "var(--s-accent-light)",
                color: "var(--s-accent-text)",
                border: "1px solid var(--s-accent-border)",
              }}
            >
              {e}
            </span>
          ))}
          {data.entities_missing.map((e) => (
            <span
              key={e}
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "3px",
                fontFamily: "var(--font-mono)",
                background: "var(--s-surface-2)",
                color: "var(--s-text-muted)",
                border: "1px solid var(--s-border)",
              }}
            >
              {e}: —
            </span>
          ))}
        </div>
      </div>
      <Divider />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5px",
        }}
      >
        {[
          { label: "Route", value: data.route },
          { label: "Fallback", value: data.fallback },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "var(--s-surface-2)",
              borderRadius: "4px",
              padding: "6px 8px",
            }}
          >
            <FieldLabel>{item.label}</FieldLabel>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--s-text)",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ChatbotBody({ data }: { data: AnalysisResult["chatbot"] }) {
  return (
    <>
      <div>
        <FieldLabel>Bot Response</FieldLabel>
        <div
          style={{
            fontSize: "11.5px",
            color: "var(--s-text)",
            lineHeight: 1.5,
          }}
        >
          {data.response}
        </div>
      </div>
      <div>
        <FieldLabel>Quick Replies</FieldLabel>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {data.quick_replies.map((qr) => (
            <span
              key={qr}
              style={{
                fontSize: "10px",
                border: "1px solid var(--s-border)",
                color: "var(--s-text-2)",
                borderRadius: "10px",
                padding: "2px 8px",
                background: "transparent",
              }}
            >
              {qr}
            </span>
          ))}
        </div>
      </div>
      <Divider />
      <div
        style={{
          background: "#FFFBEB",
          border: "1px solid #FDE68A",
          borderRadius: "4px",
          padding: "6px 9px",
        }}
      >
        <FieldLabel>Handoff Context</FieldLabel>
        <div
          style={{
            fontSize: "11px",
            color: "#78350F",
            lineHeight: 1.45,
          }}
        >
          {data.handoff_context}
        </div>
      </div>
    </>
  );
}

function AgentAssistBody({ data }: { data: AnalysisResult["agent_assist"] }) {
  return (
    <>
      <div
        style={{
          background: "#FFF7ED",
          border: "1px solid #FDBA74",
          borderRadius: "4px",
          padding: "7px 9px",
        }}
      >
        <FieldLabel>Suggested Script</FieldLabel>
        <div
          style={{
            fontSize: "11px",
            color: "#431407",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          {data.suggested_script}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "7px",
          background: "var(--s-surface-2)",
          borderRadius: "4px",
          padding: "6px 9px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--s-policy-dot)",
            marginTop: "3px",
            flexShrink: 0,
          }}
        />
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--s-text-2)",
              lineHeight: 1.4,
            }}
          >
            {data.policy_text}
          </div>
          <div
            style={{
              fontSize: "9.5px",
              color: "var(--s-text-muted)",
              marginTop: "2px",
            }}
          >
            {data.policy_ref}
          </div>
        </div>
      </div>
      {data.compliance_flag && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "3px",
            padding: "3px 7px",
            fontSize: "9.5px",
            fontWeight: 700,
            color: "#991B1B",
          }}
        >
          <svg width="8" height="8" viewBox="0 0 9 9" fill="none">
            <path
              d="M4.5 1v3.5M4.5 7v.3"
              stroke="#991B1B"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          {data.compliance_flag}
        </div>
      )}
    </>
  );
}

export default function ChannelPanel({
  channel,
  result,
  isLoading,
}: ChannelPanelProps) {
  const config = CHANNEL_CONFIG[channel];
  const data = result?.[channel];
  const badgeText = data?.status_badge ?? null;

  return (
    <div
      style={{
        background: "var(--s-surface)",
        border: "1px solid var(--s-border)",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          padding: "9px 12px",
          borderBottom: "1px solid var(--s-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "6px",
          background: "var(--s-surface-2)",
          transition: "all 0.4s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "4px",
              background: "var(--s-accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--s-accent-text)",
            }}
          >
            {config.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--s-text)",
              }}
            >
              {config.name}
            </div>
            <div
              style={{ fontSize: "10px", color: "var(--s-text-muted)" }}
            >
              {config.desc}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* IVR play button lives in the header as the primary audio action */}
          {channel === "ivr" && result?.ivr?.spoken_response && (
            <IVRPlayer text={result.ivr.spoken_response} />
          )}
          {!badgeText ? (
            <div
              className="skeleton"
              style={{
                width: "64px",
                height: "18px",
                background: "var(--s-surface-2)",
                borderRadius: "3px",
              }}
            />
          ) : (
            <span
              style={{
                fontSize: "9.5px",
                fontWeight: 600,
                padding: "2px 7px",
                borderRadius: "3px",
                background: "var(--s-accent-light)",
                color: "var(--s-accent-text)",
                whiteSpace: "nowrap",
              }}
            >
              {badgeText}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          padding: "11px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
          transition: "all 0.4s ease",
        }}
      >
        {!data ? (
          <>
            <SkeletonRow width="100%" />
            <SkeletonRow width="80%" />
            <SkeletonRow width="60%" />
          </>
        ) : channel === "ivr" ? (
          <IVRBody data={result!.ivr} />
        ) : channel === "chatbot" ? (
          <ChatbotBody data={result!.chatbot} />
        ) : (
          <AgentAssistBody data={result!.agent_assist} />
        )}
      </div>
    </div>
  );
}
