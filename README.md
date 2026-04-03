# ClearChannel — Conversational Design Lab

**Built by Hannah Kraulik Pagade**

A conversational UX design tool that simulates how a single investor 
utterance is handled across all three enterprise channels simultaneously: 
IVR, Chatbot, and Agent Assist. Built for Vestara, a fictional financial 
services firm.

---

## What it does

Paste or speak any investor utterance and watch the AI generate:

- **IVR** — the spoken response script with prosody annotations, 
  extracted entities, routing decision, and fallback path
- **Chatbot** — the digital response, quick reply options, containment 
  decision, and handoff context
- **Agent Assist** — the suggested script for a live agent, auto-surfaced 
  policy references, and compliance flags
- **NLU Architecture** — the full intent taxonomy, entity schema, 
  training phrases, and confidence threshold for the detected intent

Eleven pre-loaded investor scenarios cover transfers, fraud, balance 
inquiries, retirement planning, bereavement, market anxiety, and additional 
edge cases. Bereavement and panic-state utterances trigger emotional 
sensitivity protocols across all three channels.

---

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Anthropic Claude API (claude-sonnet-4-6)
- IVR audio playback implemented via /api/speak (OpenAI TTS).
- Vercel

---

## Getting started

Clone the repo and install dependencies:
```bash
git clone https://github.com/rohimayaventures/clearchannel-vestara.git
cd clearchannel-vestara
npm install
```

Create a `.env.local` file:
```bash
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_OPENAI_API_KEY=your_key_here
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Routes

| Route | Description |
|---|---|
| `/` | Main ClearChannel lab — utterance input and three channel outputs |
| — | Design Artifact page — planned, not yet built. |

---

## Design system

**Vestara Institutional** — clean institutional white, deep navy 
(#1B2E4B), teal accent (#0891B2). IBM Plex Sans and IBM Plex Mono. 
Designed to read as a production financial services internal tool.

---

## Portfolio context

ClearChannel demonstrates conversational UX systems thinking across 
all three channels that enterprise companies deploy: phone IVR, digital 
chatbot, and live agent assist. Built as a portfolio project targeting 
UX Strategist and Conversational AI roles in regulated industries.

---

## Author

Hannah Kraulik Pagade  
