# CLEARCHANNEL BY VESTARA — CASE STUDY

*Reference document. Does not render on site. All visitor-facing content lives in component copy and page files.*
*Case study updated April 2026. Hannah Kraulik Pagade, Rohimaya Health AI.*
*Privacy note: this case study contains no references to any named enterprise financial firm. All framing is attributed to the fictional firm Vestara. The system prompt uses generic enterprise financial services knowledge only. This product was built as a portfolio demonstration for enterprise conversational channels roles.*

---

## PROJECT METADATA

| Field | Value |
|---|---|
| **Product name** | ClearChannel by Vestara |
| **Status** | Live |
| **Primary URL** | clearchannel-vestara.vercel.app |
| **Repo** | github.com/rohimayaventures/clearchannel-vestara |
| **Tags** | CONVERSATION-DESIGN · NLU-ARCHITECTURE · ENTERPRISE-FINTECH · PORTFOLIO-ARTIFACT |
| **Role** | Conversation design, NLU architecture, product design, full-stack build |
| **Timeline** | March 2026 |
| **Key outcome** | A live conversational design lab demonstrating simultaneous multi-channel output, NLU architecture, sentiment-driven UI theming across five emotional states, OpenAI Realtime live call, and voice input via Whisper across IVR, Chatbot, and Agent Assist |
| **Stack** | Next.js 16 · React 19 · TypeScript · Tailwind CSS · Claude API (claude-sonnet-4-6) · OpenAI (Whisper · TTS · Realtime) · Vercel |

---

## SECTION 1 — THE PROOF POINT

When a person calls a financial services firm to say their spouse just died, the first thing the system should not do is ask for an account number.

That sentence describes a real failure mode in enterprise conversational AI. The IVR and chatbot are optimized for the median interaction: balance inquiry, fund transfer, password reset. The system is good at those. But a bereavement call is not the median interaction. A bereavement call is the moment when the design of the conversational system either respects the customer or it does not.

ClearChannel is built around that proof point. When the bereavement utterance is submitted, two things happen simultaneously. The NLU system classifies the intent as BENEFICIARY_UPDATE with distressed sentiment and fires the bereavement override, suppressing the account verification prompt and routing to a senior specialist. And the entire application's color system shifts to purple.

That second thing is not decoration. The `data-sentiment` attribute drives a semantic CSS token system that cascades through every surface in the interface: topbar, background, accents, borders, pills, prosody indicators. Distressed: purple (`#7C3AED`). Urgent: red (`#DC2626`). Concerned: amber (`#D97706`). Confused: blue (`#3B82F6`). Neutral: teal (`#0891B2`).

The UI does not just label sentiment. It inhabits it. That design decision demonstrates that emotional state handling was an architectural commitment across both the prompt logic and the visual system, not a feature layer added after the fact.

---

## SECTION 2 — THE PROBLEM

### Enterprise conversational AI is never one channel

A financial services firm of any scale runs all of the following simultaneously: an IVR system that answers phone calls, a chatbot that handles digital interactions, and an Agent Assist tool that runs on the screen of every live representative. These three channels share the same customers, the same intents, and the same compliance requirements. But they have different output constraints, different affordances, and different failure modes.

IVR is entirely audible. There are no buttons to tap. The customer is speaking and the system must respond in natural spoken English with prosody notes and a clear routing decision. A chatbot response that works in text is often too long, too structured, or too dependent on visual formatting to work as an IVR script.

Agent Assist is not customer-facing at all. It runs on the representative's screen in real time while the call is happening. It surfaces the suggested response the agent should read aloud, the compliance requirements relevant to this transaction, the policy references the agent would otherwise have to look up, and the escalation path. Without it, a junior representative taking a bereavement call might immediately ask for an account number from someone whose spouse just died.

Most conversation designers design for one channel. ClearChannel demonstrates what it means to design all three simultaneously, starting from the same utterance.

### Why the edge cases define the system

The eleven sample utterances were chosen to demonstrate what separates a well-designed conversational system from an adequate one. A system that handles balance inquiries correctly has met the baseline. A system that handles the bereavement call, the fraud call, and the panic-selling call correctly has demonstrated that it was designed with the full range of human experience in view.

---

## SECTION 3 — THE PROCESS

### The constraint set

**One utterance in. Three channel outputs out, simultaneously.**
Every test utterance renders IVR, Chatbot, and Agent Assist outputs in parallel. The layout reflects a deliberate hierarchy: IVR takes 44% of the panel width as the primary audible channel, Chatbot and Agent Assist stack on the right, and the NLU architecture card collapses below the channel outputs and expands on demand. This is not four equal panels. It is a reading order built on how a practitioner actually uses this information.

**Start empty. Let the user drive.**
The lab opens on an empty state, not a pre-seeded dashboard. A short invitation surfaces two paths: open the sample utterances in the sidebar or start a Live Call. Analysis only appears after the user acts. A busy first screen with fake pre-loaded results reads as a data dump and skips the product story. The empty state reframes ClearChannel as a tool the user drives, not a screenshot of a tool.

**Emotional state is an architectural commitment, not a feature.**
The sentiment theming system is the proof. The `[data-sentiment]` CSS token architecture drives every color surface from a single attribute on the root element, with smooth transitions across major surfaces. When the system classifies an utterance as distressed, the override fires in the prompt logic and the CSS attribute changes simultaneously. The environment echoes bereavement, urgency, and confusion at a glance. The design and the system are the same decision.

**The confidence threshold display is deliberate.**
Showing a confidence score alongside a threshold bar signals that this designer knows what a confidence threshold is, why it matters, and how it would be tuned in a production NLU system. That detail separates a conversation designer from a conversation system designer.

### The Claude API prompt architecture and SSE streaming

One Claude API call (claude-sonnet-4-6) with a structured JSON output contract produces all channel outputs simultaneously, streamed over SSE. The client accumulates the text stream and extracts complete JSON sections as braces close. The intent bar and channel panels fill progressively as each block arrives, rather than waiting for one full response.

This alignment between implementation and product argument matters. The thesis is one utterance, many channels at once. A single blocking response hides that structure. Streaming makes the parallel outputs visible and improves perceived performance in reviews and demos. The same reasoning surfaces across IVR, Chatbot, Agent Assist, and NLU, not as a sequential reveal, but as one response unfolding in real time.

The system prompt uses generic enterprise financial services knowledge only. No named external firm appears anywhere in the system prompt or codebase.

### The voice input architecture

Voice input uses MediaRecorder to capture audio in the browser. The audio blob is sent to `/api/transcribe`, which calls OpenAI Whisper for server-side speech-to-text. The transcript then passes through the same analysis pipeline as a typed utterance.

This is a different and more reliable architecture than Web Speech API. Web Speech API is browser-native and free but varies significantly across browsers and has limited support for non-English languages and financial terminology. The Whisper path produces a more accurate transcript across accents and domain-specific terms, and the server-side result can be logged and reviewed. The added latency is a real tradeoff. It is the right tradeoff for a context where accuracy matters more than speed.

IVR audio playback uses a separate path: `/api/speak` with OpenAI TTS, then `fetch` to a Blob URL, then `HTMLAudioElement.play()`. This pattern was chosen specifically for iOS Safari reliability. `AudioContext` and decoded buffer approaches break user-gesture chains across `await` on iOS. IVR failing on a phone undercuts the entire voice channel story. The Blob URL approach favors reliable tap-to-play over lower-level audio APIs. IVR is audible-first. Mobile playback is a product requirement, not a nice-to-have.

### The OpenAI Realtime "Live Call" feature

The Live Call feature uses the OpenAI Realtime API to enable a persistent, low-latency voice session. The user starts a Live Call, speaks naturally, and the system generates real-time transcripts and concurrent analysis. The Realtime session token is fetched via `/api/realtime-session` and the `RealtimeSession` component manages the WebSocket lifecycle.

This is a second, distinct input mode alongside typed and recorded utterances. Typed samples demonstrate NLU design through deliberate edge cases. Live Call demonstrates contact-center reality. Burying the feature wasted a genuine differentiator. It is now surfaced as the primary CTA on the empty-state hero alongside the sample utterance path. Two proofs run in one lab: designed utterances for edge cases, and live speech for "this is what a call feels like."

### Pivot stories

**Pivot A — Empty state instead of pre-seeded dashboard**
The lab originally opened with a pre-loaded analysis result to look immediately "live." During review, a busy first screen read as a data dump, especially on mobile, and it bypassed the product story. The decision was to start empty and put two paths in front of the user: open a sample, or start a Live Call. We chose clarity over looking live on load. The first screen is the brief.

**Pivot B — SSE streaming for progressive panel fill**
Analysis originally waited for one full JSON response before rendering. The thesis is one utterance, many channels simultaneously. A blocking response hides that structure. Moving to SSE with progressive section extraction makes the parallel outputs visible as they arrive. The implementation now matches the product argument.

**Pivot C — IVR audio and iOS Safari**
IVR audio originally used `AudioContext` and decoded buffers. On iOS Safari, user-gesture chains break across `await`, causing silent failures on tap-to-play. The pattern was changed to `fetch` to Blob URL to `HTMLAudioElement.play()` with cleanup on end and unmount. Reliable playback on a phone is not a mobile edge case for an IVR demo. It is the demo.

**Pivot D — Sentiment as full-environment signal**
The original design used a small badge to label sentiment state. The problem: if only a badge changes color, reviewers miss the point that emotional state changes routing, copy, and system behavior. Semantic CSS variables driven by `data-sentiment` now retint background, topbar, accents, panels, and prosody indicators with smooth transitions. The UI does not just label sentiment. It inhabits it.

**Pivot E — Welcome flow and mobile craft**
The original welcome experience could not be scrolled to completion on small screens, and several controls did not meet 44px touch targets. The welcome layer was rebuilt with backdrop scrolling (not a trapped centered card), `100dvh`, 44px touch targets throughout, tighter Realtime header behavior, and readable label sizes on small screens. Portfolio demos are shipped software. Onboarding and thumb-sized UI are part of the proof.

**Pivot F — Live Call as first-class story**
Live Call originally lived in an easy-to-miss location. Typed samples show NLU design. Live voice shows contact-center reality. Burying the Realtime feature wasted a differentiator. It was promoted to the empty-state hero as a primary CTA alongside sample utterances, with a stronger topbar control and a header layout that does not break on narrow widths.

---

## SECTION 4 — WHAT SHIPPED

### Sample utterances (11)
- IRA to brokerage fund transfer
- Unauthorized transaction / fraud detection
- Balance inquiry (baseline)
- Retirement planning conversation
- Bereavement / beneficiary update (death of spouse)
- Market anxiety / panic-selling scenario
- Repeat caller frustration
- Barge-in escalation (caller interrupting the system)
- Vague distress (caller does not know what they need)
- Cognitive accessibility (family member managing account)
- Time pressure / urgent deadline

### Channel outputs per utterance
- IVR: spoken response script with prosody annotations, extracted entities, routing decision, fallback path
- Chatbot: bot response, quick reply options, containment decision, handoff context
- Agent Assist: suggested agent script, auto-surfaced policy references, compliance flags, escalation path

### NLU architecture card
- Primary intent with confidence score and threshold visualization
- Entity schema for the detected intent
- Training phrase suggestions
- 18 classified intents with priority override rules
- Collapsible, horizontally scrollable four-column grid below channel panels

### Sentiment theming system (five states)
CSS token architecture. `[data-sentiment]` attribute cascades through all color surfaces simultaneously with transitions.

| State | Topbar | Accent | Trigger |
|---|---|---|---|
| neutral | `#1B2E4B` | `#0891B2` | Default, informational intents |
| concerned | `#2A1F0A` | `#D97706` | Market anxiety, volatility |
| distressed | `#2D1F5E` | `#7C3AED` | Bereavement, loss |
| urgent | `#3B0A0A` | `#DC2626` | Fraud, unauthorized access |
| confused | `#0F1E35` | `#3B82F6` | Vague distress, cognitive load |

### Override rules (fire before any other classification)
1. Bereavement: BENEFICIARY_UPDATE intent, distressed sentiment, verification suppressed, senior specialist routing, `data-sentiment="distressed"`
2. Fraud: immediate escalation protocol, `data-sentiment="urgent"`
3. Market anxiety / panic-sell: behavioral coaching guardrail, `data-sentiment="concerned"`
4. Barge-in: interruption detection, simplified re-prompt

### Voice and audio
- MediaRecorder captures audio in browser
- Audio blob sent to `/api/transcribe` (OpenAI Whisper, server-side)
- Transcript passed through standard analysis pipeline
- `/api/speak`: OpenAI TTS generates IVR audio, Blob URL + `HTMLAudioElement` for playback
- Pulse animation on IVR play button during active playback

### OpenAI Realtime Live Call
- Persistent low-latency voice session via OpenAI Realtime API
- Token fetched via `/api/realtime-session`
- `RealtimeSession` component manages WebSocket lifecycle
- Real-time transcript with concurrent multi-channel analysis
- Primary CTA on empty-state hero alongside sample utterance path

### SSE streaming with progressive fill
- Claude API response streams over SSE
- Client accumulates text and extracts complete JSON sections as braces close
- Intent bar and channel panels fill as each block arrives
- No blocking wait for full response

### Empty state and welcome flow
- Lab opens empty with invitation and two CTA paths: sample utterances or Live Call
- Welcome modal explains intent bar, three channel panels, sentiment shift, and NLU section
- Tuned for recruiter and non-technical reviewer context

### Mobile layout
- Hamburger button (44px touch target) on screens below 1024px
- Sidebar becomes fixed off-canvas drawer with 0.35s cubic-bezier transition
- Backdrop overlay with tap-to-close
- Channel panels stack vertically (IVR full-width, right panel below)
- NLU grid scrolls horizontally with right-edge fade mask
- `100dvh` for scroll containment, 44px touch targets throughout

### Design artifact page (`/design-artifact`)
- Static page documenting the full conversation architecture
- Intent taxonomy: all 18 intents with category, confidence threshold, and sentiment state
- Override priority rules: four override types with structural changes and channel behavior
- Entity schema: key entities with intent associations
- Channel routing matrix: IVR, Chatbot, Agent Assist behaviors per intent category
- Sentiment state map: five states with design token swatches from globals.css
- Data sourced from `lib/designArtifactData.ts`

### Infrastructure
- Next.js 16, React 19, TypeScript, Tailwind CSS
- Claude API (claude-sonnet-4-6), structured JSON output contract, SSE streaming
- OpenAI Whisper (`/api/transcribe`), TTS (`/api/speak`), Realtime (`/api/realtime-session`)
- Deployed on Vercel at clearchannel-vestara.vercel.app

---

## SECTION 5 — TECHNICAL ARCHITECTURE

| Component | Decision | Rationale |
|---|---|---|
| Claude model | claude-sonnet-4-6 | Current production model at build time. |
| Simultaneous channel rendering | One Claude API call, one JSON contract, SSE streaming, progressive panel fill | The product thesis is one utterance, three channels simultaneously. SSE makes that parallel structure visible as it arrives. |
| Layout hierarchy | IVR 44% / right panel 56% (Chatbot + Agent Assist stacked) / NLU collapsible below | Reflects practitioner reading order. Channels are primary. Architecture is the supporting evidence. |
| Sentiment theming | `[data-sentiment]` CSS token architecture, five states, smooth transitions | Emotional state handling is an architectural commitment. The CSS system and the prompt override logic change from the same trigger. |
| Voice input | MediaRecorder + OpenAI Whisper (`/api/transcribe`) | More reliable than Web Speech API across browsers, accents, and financial terminology. Server-side transcript enables logging and review. |
| IVR audio playback | `fetch` → Blob URL → `HTMLAudioElement.play()`, OpenAI TTS (`/api/speak`) | iOS Safari breaks `AudioContext` user-gesture chains across `await`. Blob URL pattern favors reliable tap-to-play on mobile. |
| OpenAI Realtime Live Call | `RealtimeSession` component, `/api/realtime-session` token, WebSocket | Persistent low-latency session for natural conversation. Second input mode alongside typed and Whisper-transcribed utterances. |
| JSON output contract | Structured typed schema, SSE streaming, client-side progressive parse | Client accumulates stream and extracts complete sections as braces close. No server-side repair pass. If parsing fails, panels may render partial or empty. No user-facing error state for this case yet. |
| Confidence threshold display | Score + threshold bar populated from AI output | Reflects confidence of the specific utterance. Demonstrates NLU system-level thinking. |
| Handoff context | Captured in Chatbot panel, structured for agent consumption | Customer context travels with the customer across channels. |
| Override rules | Four overrides in system prompt, all tied to `data-sentiment` and structural routing changes | Bereavement and fraud fire before any other classification. Priority ordering is explicit in the prompt. |
| Mobile layout | Off-canvas drawer, vertical panel stacking, horizontal NLU scroll with fade mask, `100dvh` | Standard mobile pattern for sidebar-heavy tools. 44px touch targets. Backdrop scrolling, not trapped modal. |
| Design artifact page | Static page, `lib/designArtifactData.ts` data layer, no API calls | Visual NLU documentation separated from runtime types. Updates to conversation architecture require updating one data file. |

---

## SECTION 6 — STATUS MATRIX

### What works

| Area | Status | Notes |
|---|---|---|
| All 11 sample utterances | Working | Each utterance renders all channel outputs and NLU card. |
| Sentiment theming system | Working | All five states fire and cascade correctly through CSS tokens. |
| Bereavement override | Working | Routing, tone shift, documentation checklist, distressed theme. |
| Fraud override | Working | Escalation path, compliance flag, urgent theme. |
| Market anxiety guardrail | Working | Behavioral coaching response, concerned theme. |
| Barge-in override | Working | Interruption detection, simplified re-prompt. |
| SSE streaming | Working | Progressive panel fill. Intent bar populates before full output. |
| Voice input via Whisper | Working | MediaRecorder + `/api/transcribe`. Transcript through standard pipeline. |
| IVR audio playback | Working | `/api/speak` + OpenAI TTS, Blob URL, HTMLAudioElement, pulse animation. |
| OpenAI Realtime Live Call | Working | RealtimeSession, WebSocket, real-time transcript, concurrent analysis. |
| Confidence threshold display | Working | Score and threshold bar from AI output. |
| Empty state and welcome flow | Working | Two CTA paths, welcome modal, mobile-scroll-safe. |
| Mobile hamburger drawer | Working | Off-canvas with transition, backdrop overlay, tap-to-close. |
| Mobile panel stacking | Working | IVR full-width, right panel below, NLU horizontal scroll with fade. |
| Custom utterance input | Working | Any typed or spoken utterance, not limited to 11 samples. |
| Design artifact page | Working | `/design-artifact` live with intent taxonomy, overrides, entities, routing matrix, sentiment map. |

### Known gaps

| Area | Status | Notes |
|---|---|---|
| JSON repair on parse failure | Not implemented | Client parses progressively with a final JSON.parse. No server-side repair pass. If output fails, panels may render partial or empty without a user-facing error state. |
| User-visible JSON error state | Not built | Partial panel render on failure has no explanation surfaced to the user. |
| Real NLU model integration | Not built | All NLU output is generated by Claude. Does not integrate with a production engine such as Dialogflow or LUIS. Honest in case study and architecture table. |

---

## SECTION 7 — PORTFOLIO COPY

### Proof point (short callout for site)
When the bereavement utterance fires, the system suppresses account verification, routes to a senior specialist, and the entire application turns purple. The UI does not just label sentiment. It inhabits it.

### Stats
- 11 sample utterances covering emotional edge cases from fraud to bereavement
- 3 channels rendered simultaneously via SSE streaming
- 5 sentiment states driving the full CSS token system in real time

### Card summary
Type or speak any investor utterance. Watch simultaneous IVR, Chatbot, and Agent Assist outputs stream live, the NLU architecture card populate, and the entire application's color system shift to reflect the detected emotional state. Built as a conversational design lab for enterprise financial services, with OpenAI Realtime for live call mode.

### Project description
ClearChannel is a conversational design lab for Vestara, a fictional enterprise financial services firm. A user types or speaks an investor utterance and the tool generates simultaneous outputs for IVR, Chatbot, and Agent Assist, plus a full NLU architecture breakdown, streamed via SSE. A semantic CSS sentiment theming system shifts the entire interface across five emotional states based on intent classification. OpenAI Realtime enables a persistent live call mode. A static design artifact page documents the full conversation architecture behind the demo.

### Problem statement
Enterprise conversational AI is never one channel. An investor who calls about a suspicious transaction may also be using the chatbot, and a live agent may be managing the same interaction. Most conversation designers optimize for one channel at a time. ClearChannel demonstrates what it means to design the full system: where IVR differs from chatbot in voice and structure, how handoff context travels across channels, when a compliance flag surfaces, and how an emotional state like bereavement changes every channel response and the entire visual environment simultaneously.

### Process steps
1. **The brief** — An enterprise conversational channels team needed a designer who understood IVR, chatbot, and agent assist as a system. I read that requirement as a product spec and built the tool that would make a hiring team say "she already understands our system." The 11 utterances were chosen deliberately: the edge cases that define the quality of a conversational architecture.
2. **The architecture** — One Claude API call (claude-sonnet-4-6) streams over SSE. The client extracts complete JSON sections progressively. Intent bar and panels fill as each block arrives. The streaming implementation matches the product argument: one utterance, three channels, unfolding simultaneously.
3. **The emotional state design** — Bereavement, fraud, and panic-selling are not edge cases in financial services. They are the interactions that define brand trust. The system prompt defines **three critical overrides** that fire before general intent classification: bereavement, fraud, and barge-in. Panic-selling and market anxiety are handled through the **MARKET_ANXIETY** intent plus **emotional sensitivity rules** (behavioral coaching, concerned sentiment)—the same product outcome as a fourth “override,” but not a fourth numbered block in the prompt. The `data-sentiment` architecture means these classifications do not just change the text in the panels. They change the color of everything on the screen.

### Process steps interactive (sidebar anchors)
- The Brief and Constraint Set
- SSE Streaming Architecture
- Sentiment Theming System
- Voice Input and OpenAI Realtime
- Pivot Stories
- What Shipped

### What shipped (grouped, for ShippedGrid)
- **Sample coverage:** 11 utterances: transfers, fraud, balance, retirement, bereavement, panic-selling, repeat caller, barge-in, vague distress, cognitive accessibility, time pressure.
- **Channel outputs:** IVR with prosody and routing. Chatbot with quick replies and handoff context. Agent Assist with suggested script, policy references, and compliance flags.
- **NLU architecture:** 18 intents, confidence score and threshold, entity schema, training phrase suggestions. Collapsible four-column grid.
- **Sentiment theming:** Five states (neutral, concerned, distressed, urgent, confused) driving full CSS token cascade via `data-sentiment`.
- **Override rules:** Bereavement, fraud escalation, behavioral coaching guardrail, barge-in. All tied to routing changes and sentiment state.
- **Voice and audio:** MediaRecorder + OpenAI Whisper. OpenAI TTS for IVR audio playback. OpenAI Realtime for Live Call mode.
- **SSE streaming:** Progressive panel fill. Intent bar populates before full output.
- **Design artifact page:** `/design-artifact` with full NLU documentation, intent taxonomy, entity schema, channel routing matrix, and sentiment state map.
- **Infrastructure:** Next.js 16, React 19, Claude API (claude-sonnet-4-6), OpenAI (Whisper, TTS, Realtime), Vercel.

### Stack highlighted
Claude API (claude-sonnet-4-6, SSE streaming), OpenAI (Whisper · TTS · Realtime), sentiment-driven CSS token system (`data-sentiment`)

### Stack standard
Next.js 16, React 19, TypeScript, Tailwind CSS, Vercel

### Impact quote
The bereavement utterance is the one that matters. The system suppresses the account verification prompt, routes to a senior specialist, and the entire application turns purple. That is not decoration. That is the proof that emotional state handling was designed in, not added on.

### Honest summary

**Technical understanding:**
The Claude API call (claude-sonnet-4-6) streams over SSE. The client accumulates the text stream and extracts complete JSON sections as braces close, allowing progressive panel fill without a blocking wait. There is no server-side JSON repair pass. The current implementation does a final `JSON.parse` on the accumulated stream, and partial or failed output has no user-facing error state. That is the honest current implementation and it is in the status matrix. Voice uses MediaRecorder in the browser and OpenAI Whisper server-side via `/api/transcribe`, not Web Speech API. IVR audio uses OpenAI TTS via `/api/speak` with a Blob URL and `HTMLAudioElement` specifically for iOS Safari reliability. OpenAI Realtime manages a persistent WebSocket session for Live Call mode, a distinct architecture from the standard transcribe-then-analyze path.

**Product understanding:**
This project is built from a product brief: an enterprise conversational channels team that needed a designer who understood IVR, chatbot, and agent assist as a unified system. I read that as a product spec and built the artifact that demonstrated all competencies simultaneously. The six pivot stories in Section 3 each represent a real product decision with a real tradeoff. The empty state, the SSE streaming, the IVR audio path, the sentiment token architecture, the welcome flow, and the Live Call promotion are all decisions that made the product more honest about what it claims to demonstrate.

**Design understanding:**
The CSS token architecture is the design centerpiece. Five named sentiment states, each driving a complete color system through a single `data-sentiment` attribute on the root. IBM Plex Sans for interface text, IBM Plex Mono for financial data and classification output. The panel layout hierarchy reflects how a practitioner reads this information: channels at 44%/56%, NLU collapsible below. Mobile is a drawer, not a collapsed state. The design artifact page at `/design-artifact` is a second design deliverable: visual NLU documentation that most conversation design portfolios do not produce.

### What this demonstrates
- Multi-channel conversational system design: IVR, Chatbot, and Agent Assist as a unified architecture
- Semantic CSS token architecture for emotional state-driven UI theming across five states
- NLU architecture: 18 intents, entity schema, confidence threshold, priority override rules
- Full voice pipeline: MediaRecorder, OpenAI Whisper, TTS audio playback, OpenAI Realtime Live Call
- SSE streaming with progressive UI fill aligned to the product thesis
- Reading a product requirement as a build spec and shipping to it
- Visual NLU documentation as a design deliverable (design artifact page)
- Honest status matrix: acknowledging what is and is not implemented

---

## SECTION 8 — CITATIONS

[1] Rasa. "Conversational AI: Intent Classification and Confidence Thresholds." Rasa Documentation, 2024. rasa.com/docs.

[2] Google Cloud. "Dialogflow CX: Intent Detection and Confidence Scores." cloud.google.com/dialogflow/cx/docs. Accessed 2026.

[3] Microsoft Azure. "Conversational Language Understanding: Utterances and Intents." docs.microsoft.com/azure/cognitive-services/language-service. Accessed 2026.

[4] Radford, Alec et al. "Robust Speech Recognition via Large-Scale Weak Supervision." OpenAI, arXiv:2212.04356, December 2022.

[5] OpenAI. "Realtime API Overview." platform.openai.com/docs/guides/realtime. Accessed 2026.

[6] NICE. "2023 CX Transformation Benchmark Study: The State of Contact Center AI." nice.com/resources, 2023.

[7] Nielsen Norman Group. "Emotional Design in Conversational Interfaces." nngroup.com/articles, 2022.

[8] IBM Institute for Business Value. "The Agent Advantage: How AI Assist Changes Live Support." ibm.com/thought-leadership/institute-business-value, 2023.