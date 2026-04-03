# CLEARCHANNEL BY VESTARA — CASE STUDY

*Reference document. Does not render on site. All visitor-facing content lives in caseStudies.ts.*
*Case study updated April 2026. Hannah Kraulik Pagade, Rohimaya Health AI.*
*Privacy note: this case study contains no references to Vanguard, Pagade Ventures, or any active interview process. All enterprise financial services framing is attributed to the fictional firm Vestara.*

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
| **Key outcome** | A live, working conversational design lab that demonstrates simultaneous multi-channel output, NLU architecture, and emotional state handling across IVR, Chatbot, and Agent Assist |
| **Stack** | Next.js · TypeScript · Tailwind CSS · Claude API · Vercel |

---

## SECTION 1 — THE PROOF POINT

When a person calls a financial services firm to say their spouse just died and they need to update their account, the first thing the system should not do is ask for an account number.

That sentence describes a real failure mode in enterprise conversational AI. The IVR and chatbot are often optimized for the median interaction: balance inquiry, fund transfer, password reset. The system is good at those. But a bereavement call is not the median interaction. A bereavement call is the moment when the design of the conversational system either respects the customer or it does not.

ClearChannel is built around that proof point. The bereavement utterance ("My husband just passed and I need to update my beneficiary") triggers a completely different behavior across all three channels. IVR leads with condolences, suppresses the account number prompt, and routes to a senior specialist. Chatbot adjusts tone and eliminates quick reply shortcuts that would feel dismissive. Agent Assist surfaces the bereavement protocol immediately: documentation required, escalation path, compliance flag for the sensitive handling classification.

That single utterance demonstrates more about conversational system design than a dozen standard test cases. It is the reason the tool lands in portfolio reviews.

---

## SECTION 2 — THE PROBLEM

### The gap most conversation designers do not address

Enterprise conversational AI is almost never deployed as a single channel.

A financial services firm of any scale runs all of the following simultaneously: an IVR system that answers phone calls, a chatbot that handles digital interactions on the website and app, and an Agent Assist tool that runs on the screen of every live representative who takes a call. These three channels share the same customers, the same intents, and the same compliance requirements. But they have different output constraints, different affordances, and different failure modes.

IVR is entirely audible. There are no buttons to tap. The customer is speaking and the system must respond in natural, spoken English with prosody notes and a clear routing decision. A chatbot response that works perfectly in text is often too long, too structured, or too dependent on visual formatting to work as an IVR script.

Chatbot can afford more context. It can use progressive disclosure, quick reply buttons, and handoff context. But it cannot do what Agent Assist does.

Agent Assist is not a customer-facing tool at all. It runs on the representative's screen in real time while the call is happening. It surfaces the suggested response the agent should read aloud, the compliance requirements relevant to this transaction, the policy references the agent would otherwise have to look up, and the escalation path if the interaction requires it. An agent with Agent Assist handles edge cases faster and with fewer errors. Without it, a junior representative taking a bereavement call might immediately ask for an account number from someone whose spouse just died.

Most conversation designers design for one channel. ClearChannel demonstrates what it means to design all three simultaneously, starting from the same utterance.

### Why the edge cases define the system

The eleven sample utterances in ClearChannel were not chosen to demonstrate what works. They were chosen to demonstrate what separates a well-designed conversational system from an adequate one.

A system that handles "What is my balance?" correctly has met the baseline. A system that handles "I think someone accessed my account without permission" correctly has demonstrated fraud detection and emotional state escalation. A system that handles "The market is down 8% and I'm thinking about moving everything to cash" correctly has demonstrated sentiment detection and a behavioral coaching guardrail that prevents a panic sell without being paternalistic about it.

Those edge cases are where the design quality lives.

---

## SECTION 3 — THE PROCESS

### The constraint set

**One utterance in. Three channel outputs out.**
The core product constraint was that every test utterance must render simultaneous outputs for all three channels, not in sequence, not in tabs, but in parallel. A hiring manager looking at this tool should immediately understand that the designer thinks about channels as a system, not as separate deployments.

**The NLU architecture card must render live.**
The intent taxonomy, entity schema, training phrases, and confidence threshold are not static documentation. They are generated by the same Claude API call that powers the channel outputs. The system is showing its reasoning, not just its response.

**Emotional state is a first-class input.**
The NLU classification system has override rules that fire before any other intent classification. Bereavement language immediately classifies as BENEFICIARY_UPDATE with distressed sentiment. Fraud language immediately escalates. Panic-selling language triggers a behavioral coaching guardrail. These overrides are not edge case handling. They are the point.

**The confidence threshold display is a deliberate product decision.**
Showing a confidence score alongside a threshold bar signals something specific to a hiring team: this designer knows what a confidence threshold is, why it matters, and how it would be tuned in a production NLU system. That detail separates a conversation designer from a conversation system designer.

### The Claude API prompt architecture

The single most important architectural decision in ClearChannel is that one Claude API call produces all four outputs simultaneously: IVR channel, Chatbot channel, Agent Assist channel, and NLU architecture breakdown.

The system prompt is structured as a conversation architect role with a strict JSON output contract. The contract specifies:
- IVR: spoken script with prosody annotations, extracted entities, routing decision, fallback path
- Chatbot: bot response, quick reply options, containment decision, handoff context
- Agent Assist: suggested agent script, auto-surfaced policy references, compliance flags, escalation path
- NLU: primary intent, confidence score, threshold, entity list, training phrase suggestions

The output is validated and rendered into four panels. If the JSON contract fails, the system retries with a structured repair prompt before surfacing an error state.

### The bereavement and compliance design decisions

**Bereavement protocol:**
IVR and chatbot both lead with condolences before any account-related action. The account verification prompt is suppressed. Agent Assist immediately surfaces the documentation checklist (death certificate, beneficiary form, estate information) and routes to a senior specialist. These are not tone adjustments. They are structural routing changes that fire based on a single classification trigger.

**Compliance flags:**
Financial services transactions above $50K require a compliance review. Transfers to international accounts require additional documentation. These flags surface in the Agent Assist panel automatically, based on extracted entities. An agent should never have to remember the compliance threshold. The system should surface it.

**The handoff context field:**
The Chatbot panel includes handoff context: what the customer said, what the bot said, the detected intent, and any entities captured before handoff. This exists because no customer should have to repeat themselves when moving from chatbot to phone to live agent. The handoff context travels with them.

### Design system: Vestara Institutional

The visual design is built around Vestara Institutional: deep navy (#0A1628), institutional gold (#B8860B), white (#FFFFFF), and a clean sans-serif type stack. The design signals enterprise financial services without referencing any real firm. The four-panel layout surfaces all information simultaneously without requiring the user to navigate between views.

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
- Cognitive accessibility (family member managing an account)
- Time pressure / urgent deadline

### Channel outputs per utterance
- IVR: spoken response script with prosody annotations, extracted entities, routing decision, fallback path
- Chatbot: bot response, quick reply options, containment decision, handoff context
- Agent Assist: suggested agent script, auto-surfaced policy references, compliance flags, escalation path

### NLU architecture card
- Primary intent with confidence score and threshold visualization
- Entity schema for the detected intent
- Training phrase suggestions
- Confidence threshold display (0.85 default, adjustable by intent category)

### Override rules rendered live
- Bereavement override: death/loss language fires BENEFICIARY_UPDATE with distressed sentiment, suppresses standard verification flow
- Fraud override: unauthorized access language fires immediate escalation protocol
- Panic-sell guardrail: market anxiety language fires behavioral coaching response, not a standard routing decision

### Infrastructure
- Next.js, TypeScript, Tailwind CSS
- Claude API (claude-sonnet-4) with structured JSON output contract
- Deployed on Vercel at clearchannel-vestara.vercel.app

---

## SECTION 5 — TECHNICAL ARCHITECTURE

| Component | Decision | Rationale |
|---|---|---|
| Simultaneous channel rendering | One Claude API call, one structured JSON contract, four panels rendered in parallel | Demonstrating that a single utterance is handled differently across three channels is the product thesis. Sequential API calls would have broken that visual argument. |
| JSON output contract | Strict typed schema for all four panels | Unstructured output requires parsing logic that breaks on edge cases. A typed contract with a retry/repair pass produces reliable rendering. |
| Override rules in system prompt | Bereavement, fraud, and panic-sell overrides fire before any other classification | Emotional state is the highest-priority classification in a financial services context. The override structure reflects that priority in the architecture. |
| Confidence threshold display | Confidence score + threshold bar rendered in NLU card | A confidence threshold is how a production NLU system determines when to escalate versus resolve. Showing it demonstrates system-level thinking. |
| Handoff context field | Captured in Chatbot panel, structured for agent consumption | Customer context should travel with the customer. The handoff context field demonstrates continuity architecture. |
| Design system | Vestara Institutional (navy, gold, white, enterprise type stack) | Built for a financial services context. Not derived from Meridian Oracle. Signals domain fluency. |
| Voice input | Web Speech API (browser-native, zero infrastructure cost) | Utterances can be spoken or typed. Voice input demonstrates that the designer understands IVR as an audible-first channel. |

---

## SECTION 6 — STATUS MATRIX

| Area | Status | Notes |
|---|---|---|
| All 11 sample utterances | Working | Each utterance renders all four panels correctly. |
| Bereavement override | Working | Correct routing, tone shift, and documentation checklist surface on this utterance. |
| Fraud override | Working | Escalation path and compliance flag surface correctly. |
| Panic-sell guardrail | Working | Behavioral coaching response surfaces without looping or repeating. |
| Confidence threshold display | Working | Score and threshold bar render correctly in NLU card. |
| Voice input | Working | Web Speech API functional in supported browsers. |
| Custom utterance input | Working | Any utterance can be typed or spoken, not just the 11 samples. |
| Mobile layout | Responsive | Four-panel layout collapses to single-column on mobile. All panels accessible via scroll. |
| Retry/repair on JSON failure | Working | Structured repair prompt fires on malformed output before error state surfaces. |
| Real NLU model integration | Not built | This is a demonstration tool. All NLU output is generated by Claude, not a production NLU engine like Dialogflow or LUIS. This is noted in the case study and honest summary. |

---

## SECTION 7 — PORTFOLIO COPY

### Proof point (short callout for site)
A person calling a financial services firm to report their spouse has died should not be asked for an account number first. That one utterance drives the entire architecture of this tool.

### Stats
- 11 sample utterances covering edge cases from fraud detection to bereavement
- 3 channels rendered simultaneously: IVR, Chatbot, Agent Assist
- 18 classified intents with priority override rules for emotional state detection

### Card summary
Type or speak any investor utterance and watch simultaneous IVR, Chatbot, and Agent Assist outputs generate in real time, with the full NLU architecture card showing intent taxonomy, entity schema, training phrases, and confidence threshold. Built as a conversational design lab for enterprise financial services.

### Project description
ClearChannel is a conversational design lab for Vestara, a fictional enterprise financial services firm. A user types or speaks an investor utterance and the tool generates simultaneous outputs for all three enterprise conversational channels: IVR (phone), Chatbot (digital), and Agent Assist (live representative support), plus a full NLU architecture breakdown. Built to demonstrate multi-channel conversational system design at enterprise scale.

### Problem statement
Enterprise conversational AI is never one channel. An investor who calls about a suspicious transaction may also be using the chatbot, and a live agent may be managing the same interaction. Most conversation designers optimize for one channel at a time. ClearChannel demonstrates what it means to design the full system: where IVR differs from chatbot in voice and structure, how handoff context travels between channels, when a compliance flag surfaces, and how an emotional state like bereavement changes every channel response simultaneously.

### Process steps
1. **The brief** — An enterprise conversational channels team needed a designer who understood IVR, chatbot, and agent assist as a system, not three separate deployments. I read that requirement as a product spec and built the tool that would make a hiring team say "she already understands our system." The 11 utterances were chosen deliberately: not generic queries, but the edge cases that define the quality of a conversational architecture.
2. **The architecture decision** — One Claude API call with a strict JSON output contract produces all four panel outputs simultaneously. The output contract enforces channel-specific formats: IVR gets prosody annotations, Agent Assist gets compliance flags, Chatbot gets handoff context. All four are validated before render. If the contract fails, a repair pass fires before surfacing an error state.
3. **The emotional state design** — Bereavement, fraud, and panic-selling are not edge cases in financial services. They are the interactions that define brand trust. Three override rules in the NLU system fire before any other classification. The bereavement override suppresses the account verification prompt, shifts tone across all channels, and routes to a senior specialist. That one design decision is worth more in a portfolio review than a hundred clean balance inquiry flows.

### Process steps interactive (sidebar anchors)
- The Brief and Constraint Set
- Multi-Channel Architecture
- Emotional State Override Design
- What Shipped

### Pivot story
The original design had the NLU architecture card as a separate page. The intent was to keep the primary view focused on the three channel outputs.

During a review pass, the value became clear: the NLU card is what separates this demo from every other utterance-to-response chatbot demo. Hiding it one click away meant most reviewers would miss the thing that demonstrates system-level thinking. The card was moved inline, rendering in the same view as the channel outputs.

**Lesson:** The most differentiating thing in a portfolio piece should be visible without a click. If a reviewer has to navigate to see your best work, most of them will not.

### What shipped (grouped, for ShippedGrid)
- **Sample coverage:** 11 utterances covering transfers, fraud, balance, retirement, bereavement, panic-selling, repeat caller, barge-in, vague distress, cognitive accessibility, time pressure.
- **Channel outputs:** IVR script with prosody annotations and routing. Chatbot response with quick replies and handoff context. Agent Assist with suggested script, policy references, and compliance flags.
- **NLU architecture:** Intent taxonomy, confidence score and threshold, entity schema, training phrase suggestions.
- **Override rules:** Bereavement protocol, fraud escalation, behavioral coaching guardrail, all rendered live.
- **Infrastructure:** Next.js, Claude API, Vercel.

### Stack highlighted
Claude API (structured JSON output contract), Next.js (multi-panel rendering), Web Speech API (voice input)

### Stack standard
TypeScript, Tailwind CSS, Vercel

### Impact quote
The bereavement utterance is the one that matters. If the system asks for an account number from someone whose spouse just died, the conversation design has failed at the moment it mattered most. ClearChannel is built to demonstrate that this failure is a design problem, and design can solve it.

### Honest summary

**Technical understanding:**
The Claude API prompt architecture for ClearChannel is the technical centerpiece. A single call with a typed JSON output contract produces four structured outputs simultaneously. Channel format differences are enforced in the system prompt: IVR gets prosody annotation fields, Agent Assist gets compliance flag arrays, Chatbot gets a handoff context object. The retry-on-failure pass uses a structured repair prompt rather than a generic retry. The confidence threshold rendering is not a static display. It is populated from the AI output alongside the intent classification, reflecting the confidence of the specific utterance, not a preset value.

**Product understanding:**
This project is built from a product brief. The brief was a job description for an enterprise conversational channels team that explicitly required NLU development, IVR design, chatbot design, and agent assist design as a single unified skillset. I read the job description as a product spec and built the artifact that demonstrated all four competencies simultaneously. The bereavement and compliance design decisions were not UI choices. They were product decisions: what an enterprise financial services system must do to handle edge cases correctly, and how to demonstrate that understanding in a portfolio tool without access to a real system.

**Design understanding:**
The Vestara Institutional design system is purpose-built for this context. Enterprise financial services requires a visual language that signals institutional credibility: deep navy, precise typography, restrained use of gold. The four-panel layout was the hardest design decision. Showing all four outputs simultaneously creates cognitive load. The alternative, showing them sequentially or in tabs, would have undermined the product thesis that these channels must be designed together. The layout was tested and the simultaneous view was the correct call. The mobile collapse to single-column with a sticky channel selector preserves accessibility without sacrificing the desktop design intent.

### What this demonstrates
- Multi-channel conversational system design at enterprise scale
- NLU architecture: intent taxonomy, entity schema, confidence threshold design
- Emotional state classification and override architecture
- Agent Assist design as a distinct discipline from customer-facing chatbot and IVR
- Claude API prompt engineering for structured, typed multi-output contracts
- Understanding of financial services compliance constraints in conversational contexts
- Ability to read a job spec as a product spec and build to it

---

## SECTION 8 — CITATIONS

[1] Rasa. "Conversation Design: Understanding Intent Classification and Confidence Thresholds." Rasa Documentation, 2024.

[2] Google Cloud. "Dialogflow CX: Intent Detection and Confidence Scores." cloud.google.com/dialogflow/cx/docs.

[3] Microsoft. "Azure LUIS: Active Learning and Utterance Review." docs.microsoft.com/azure/cognitive-services/luis.

[4] The Journal of the Experience Economy. "Emotional AI and Customer Experience: When Sentiment Detection Drives Routing Logic." 2023.

[5] IBM Research. "Agent Assist: Designing AI for Live Support Contexts." ibm.com/research, 2022.

[6] NICE. "2023 CX Transformation Benchmark Study: The State of Contact Center AI." nice.com/resources.

[7] Gartner. "Magic Quadrant for Conversational AI Platforms." gartner.com, 2024.

[8] Speech Technology Magazine. "IVR Design Principles: Voice-First Interaction in Financial Services." speechtechmag.com, 2023.