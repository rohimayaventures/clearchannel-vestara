/**
 * Static design artifact data for /design-artifact.
 * Intent order and definitions align with app/api/analyze/route.ts SYSTEM_PROMPT.
 */

export type IntentCategory =
  | "transaction"
  | "information"
  | "service"
  | "escalation"
  | "override";

export type SentimentId =
  | "neutral"
  | "concerned"
  | "distressed"
  | "urgent"
  | "confused";

export interface IntentTaxonomyItem {
  id: string;
  label: string;
  category: IntentCategory;
  /** NLU routing threshold (0–100). Prompt: 60–72 for bereavement/fraud/barge-in/repeat; ~70–98 for others per NLU QUALITY RULES. */
  confidence: number;
  /** Typical UI sentiment when this intent is primary (override rules may force different values). */
  sentiment: SentimentId;
  description: string;
}

export interface OverrideRule {
  priority: number;
  name: string;
  trigger: string;
  /** data-sentiment value when this override shapes the experience. */
  sentiment: SentimentId;
  structuralChanges: string[];
  channelBehavior: {
    ivr: string;
    chatbot: string;
    agentAssist: string;
  };
}

export interface EntitySchemaItem {
  name: string;
  type: "string" | "number" | "date" | "enum";
  required: boolean;
  usedByIntents: string[];
  description: string;
}

export interface SentimentStateSpec {
  id: SentimentId;
  label: string;
  topbar: string;
  accent: string;
  accentLight: string;
  bg: string;
  triggerCategories: string[];
}

/** Hex values copied from app/globals.css [data-sentiment="…"] blocks (lines 69–202). */
export const SENTIMENT_STATES: SentimentStateSpec[] = [
  {
    id: "neutral",
    label: "Neutral",
    topbar: "#1B2E4B",
    accent: "#0891B2",
    accentLight: "#EBF7FA",
    bg: "#F0F2F5",
    triggerCategories: ["transaction", "information", "service"],
  },
  {
    id: "concerned",
    label: "Concerned",
    topbar: "#2A1F0A",
    accent: "#D97706",
    accentLight: "#FEF3C7",
    bg: "#FDF7EE",
    triggerCategories: ["service"],
  },
  {
    id: "distressed",
    label: "Distressed",
    topbar: "#2D1F5E",
    accent: "#7C3AED",
    accentLight: "#EDE9FE",
    bg: "#F5F3FF",
    triggerCategories: ["override"],
  },
  {
    id: "urgent",
    label: "Urgent",
    topbar: "#3B0A0A",
    accent: "#DC2626",
    accentLight: "#FEE2E2",
    bg: "#FFF5F5",
    triggerCategories: ["override", "escalation"],
  },
  {
    id: "confused",
    label: "Confused",
    topbar: "#0F1E35",
    accent: "#3B82F6",
    accentLight: "#DBEAFE",
    bg: "#F0F6FF",
    triggerCategories: ["escalation", "service"],
  },
];

/**
 * 18 intents in prompt priority order (1–18). Categories are interpretive for documentation;
 * "override" marks intents that are directly tied to CRITICAL OVERRIDE RULES 1–3 when those fire.
 */
export const INTENTS: IntentTaxonomyItem[] = [
  {
    id: "beneficiary_update",
    label: "Beneficiary update",
    category: "override",
    confidence: 66,
    sentiment: "distressed",
    description:
      "Death, loss, beneficiary change, estate, inheritance — always escalate; never contain.",
  },
  {
    id: "unauthorized_transaction",
    label: "Unauthorized transaction",
    category: "override",
    confidence: 66,
    sentiment: "urgent",
    description:
      "Fraud, unauthorized activity, account compromise — escalate immediately with fraud protocol.",
  },
  {
    id: "repeat_caller_frustration",
    label: "Repeat caller frustration",
    category: "escalation",
    confidence: 66,
    sentiment: "urgent",
    description:
      "Multiple contacts unresolved — surface case history in Agent Assist; never ask caller to repeat the issue.",
  },
  {
    id: "barge_in_escalation",
    label: "Barge-in escalation",
    category: "override",
    confidence: 66,
    sentiment: "neutral",
    description:
      "Interruption / bypass language — IVR under 40 words, immediate transfer, no questions.",
  },
  {
    id: "cognitive_accessibility",
    label: "Cognitive accessibility",
    category: "service",
    confidence: 78,
    sentiment: "confused",
    description:
      "Plain language across channels; no acronyms or jargon; IVR uses longer pauses.",
  },
  {
    id: "vague_distress",
    label: "Vague distress",
    category: "escalation",
    confidence: 72,
    sentiment: "confused",
    description:
      "Broad distress without clear issue — one gentle clarifying question only; do not assume the problem.",
  },
  {
    id: "time_pressure",
    label: "Time pressure",
    category: "escalation",
    confidence: 76,
    sentiment: "urgent",
    description:
      "Deadlines, travel, urgency — acknowledge in the first sentence of every channel.",
  },
  {
    id: "required_minimum_distribution",
    label: "Required minimum distribution",
    category: "transaction",
    confidence: 82,
    sentiment: "neutral",
    description:
      "RMD / mandatory withdrawal — surface IRS age rules and tax implications; partial containment.",
  },
  {
    id: "rollover_request",
    label: "Rollover request",
    category: "transaction",
    confidence: 82,
    sentiment: "neutral",
    description:
      "Employer plan / 401(k) rollover — surface rollover rules and tax implications; partial containment.",
  },
  {
    id: "market_anxiety",
    label: "Market anxiety",
    category: "service",
    confidence: 72,
    sentiment: "concerned",
    description:
      "Panic / move-to-cash language — stabilize first; never suggest selling; long-term perspective.",
  },
  {
    id: "retirement_planning",
    label: "Retirement planning",
    category: "service",
    confidence: 85,
    sentiment: "neutral",
    description:
      "Retirement timing and income — partial containment; offer specialist for detailed planning.",
  },
  {
    id: "account_access",
    label: "Account access",
    category: "service",
    confidence: 92,
    sentiment: "neutral",
    description:
      "Login, password, lockout, 2FA — high containment; bot initiates identity verification.",
  },
  {
    id: "tax_document_request",
    label: "Tax document request",
    category: "information",
    confidence: 92,
    sentiment: "neutral",
    description:
      "1099, cost basis, tax forms — high containment; bot can surface document portal.",
  },
  {
    id: "balance_inquiry",
    label: "Balance inquiry",
    category: "information",
    confidence: 94,
    sentiment: "neutral",
    description:
      "Portfolio or account value — always contained; bot handles fully.",
  },
  {
    id: "fund_transfer",
    label: "Fund transfer",
    category: "transaction",
    confidence: 88,
    sentiment: "neutral",
    description:
      "Move money between accounts — classify only if no higher-priority intent matches; compliance above $50K.",
  },
  {
    id: "dividend_reinvestment",
    label: "Dividend reinvestment",
    category: "information",
    confidence: 90,
    sentiment: "neutral",
    description:
      "DRIP, dividend settings — high containment.",
  },
  {
    id: "beneficiary_designation_review",
    label: "Beneficiary designation review",
    category: "information",
    confidence: 85,
    sentiment: "neutral",
    description:
      "Check or update beneficiary without death context — partial containment.",
  },
  {
    id: "general_escalation",
    label: "General escalation",
    category: "escalation",
    confidence: 80,
    sentiment: "neutral",
    description:
      "Request for human, agent, or supervisor — always escalate.",
  },
];

/**
 * Priority 1–3 match CRITICAL OVERRIDE RULES 1–3 in route.ts.
 * Priority 4 is barge-in (Override 3 in code). Priority 3 here is MARKET_ANXIETY / panic guardrail:
 * implemented under EMOTIONAL SENSITIVITY RULES + intent 10, NOT as a fourth numbered CRITICAL OVERRIDE.
 */
export const OVERRIDES: OverrideRule[] = [
  {
    priority: 1,
    name: "Bereavement detection",
    trigger:
      "Death, loss, estate, funeral, widow/widower, inheritance, beneficiary, survivor language (Override 1 — forces BENEFICIARY_UPDATE, distressed).",
    sentiment: "distressed",
    structuralChanges: [
      "Suppress account-number / verification as first step",
      "Route to senior specialist with bereavement flag",
      "Documentation checklist surfaced in Agent Assist",
      "IVR opens with condolence and minimum 800ms pause",
    ],
    channelBehavior: {
      ivr:
        'Open with condolence and [pause 800ms]; slow pace; no verification first; route to senior specialist.',
      chatbot:
        "Lead with condolences only in first message; no transactional language; offer connection to specialist.",
      agentAssist:
        "BEREAVEMENT PROTOCOL ACTIVE; documentation list (death certificate, designation forms, marriage cert if applicable); enhanced IDV; fraud monitoring flag during estate transition.",
    },
  },
  {
    priority: 2,
    name: "Fraud / unauthorized access",
    trigger:
      "Unauthorized, fraud, hacked, suspicious transaction, identity theft language (Override 2 — forces UNAUTHORIZED_TRANSACTION, urgent).",
    sentiment: "urgent",
    structuralChanges: [
      "Immediate escalation — do not attempt containment",
      "Fraud protocol active on all channels",
      "Asset protection and identity-verification per policy",
    ],
    channelBehavior: {
      ivr: "Short, urgent routing to fraud / security queue; avoid unsafe credential collection.",
      chatbot: "Escalate; no containment; clear next steps toward secure verification or specialist.",
      agentAssist:
        "Fraud protocol scripts, timelines, compliance flags; surface policy refs and escalation path.",
    },
  },
  {
    priority: 3,
    name: "Market anxiety / panic sell",
    trigger:
      "Market down, move to cash, sell everything, panic language — intent MARKET_ANXIETY + MARKET_ANXIETY sensitivity block (not a numbered CRITICAL OVERRIDE in route.ts).",
    sentiment: "concerned",
    structuralChanges: [
      "Stabilize before any transaction",
      "Never suggest selling",
      "Behavioral coaching / long-term perspective",
      "Optional financial wellness specialist handoff",
    ],
    channelBehavior: {
      ivr: "Calm, stabilizing script; no trade execution language; offer specialist connection.",
      chatbot:
        "Validate concern without enabling panic liquidation; educational framing; specialist offer.",
      agentAssist:
        "Guardrails against recommending sale; policy text and wellness / advisor escalation path.",
    },
  },
  {
    priority: 4,
    name: "Barge-in",
    trigger:
      "STOP, transfer me now, skip this, bypass menu language (Override 3 in route.ts — BARGE_IN_ESCALATION).",
    sentiment: "neutral",
    structuralChanges: [
      "Interruption detection",
      "IVR cap 40 words",
      "Immediate transfer confirmation — no clarifying questions",
    ],
    channelBehavior: {
      ivr: "Under 40 words; transfer confirmation only; no questions.",
      chatbot: "Acknowledge bypass; fast path to live agent or callback.",
      agentAssist:
        "Note barge-in / frustration; minimal friction script for agent takeover.",
    },
  },
];

export const ENTITIES: EntitySchemaItem[] = [
  {
    name: "account_number",
    type: "string",
    required: false,
    usedByIntents: [
      "fund_transfer",
      "balance_inquiry",
      "unauthorized_transaction",
      "account_access",
      "beneficiary_designation_review",
    ],
    description: "Masked or last-four reference for routing and verification workflows.",
  },
  {
    name: "transfer_amount",
    type: "number",
    required: false,
    usedByIntents: [
      "fund_transfer",
      "rollover_request",
      "required_minimum_distribution",
      "unauthorized_transaction",
    ],
    description: "Dollar amount; triggers compliance review when above policy threshold (e.g. $50K).",
  },
  {
    name: "transfer_type",
    type: "enum",
    required: false,
    usedByIntents: ["fund_transfer", "rollover_request"],
    description: "ACH, wire, ACATS, in-kind, or internal move — from Vestara context block.",
  },
  {
    name: "account_type",
    type: "enum",
    required: false,
    usedByIntents: [
      "fund_transfer",
      "balance_inquiry",
      "tax_document_request",
      "rollover_request",
      "required_minimum_distribution",
    ],
    description: "IRA, Roth, brokerage, 401(k), 529, trust, joint, etc.",
  },
  {
    name: "date_requested",
    type: "date",
    required: false,
    usedByIntents: ["time_pressure", "tax_document_request", "required_minimum_distribution"],
    description: "Deadline, statement period, or RMD tax year as applicable.",
  },
  {
    name: "relationship_to_account",
    type: "string",
    required: false,
    usedByIntents: ["cognitive_accessibility", "beneficiary_update"],
    description: "POA, family helper, or survivor — drives plain-language or bereavement handling.",
  },
  {
    name: "unauthorized_amount",
    type: "number",
    required: false,
    usedByIntents: ["unauthorized_transaction"],
    description: "Reported fraudulent or disputed amount when stated by caller.",
  },
  {
    name: "beneficiary_name",
    type: "string",
    required: false,
    usedByIntents: ["beneficiary_update", "beneficiary_designation_review"],
    description: "Primary / contingent beneficiary identity for updates or review.",
  },
  {
    name: "concern_type",
    type: "enum",
    required: false,
    usedByIntents: ["vague_distress", "market_anxiety", "repeat_caller_frustration"],
    description: "High-level categorization for triage (market, service failure, unclear).",
  },
];

export const CATEGORY_ORDER: IntentCategory[] = [
  "override",
  "escalation",
  "transaction",
  "information",
  "service",
];
