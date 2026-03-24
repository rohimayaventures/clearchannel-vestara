import { NextResponse } from "next/server";

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not set" }, { status: 500 });
  }

  const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview",
      voice: "alloy",
      instructions: `You are Vestara, an automated IVR phone assistant for Vanguard Investments.
Keep responses concise and natural — this is a voice channel, not a chat interface.
Greet the caller once, then listen and respond to their need.
Common intents: account balance, beneficiary changes, required minimum distributions,
fund transfers, estate settlement, bereavement support.
When the caller's need is clear, confirm it back and ask if there is anything else.
Maintain a calm, professional, empathetic tone at all times.`,
      turn_detection: { type: "server_vad" },
      input_audio_transcription: { model: "whisper-1" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ clientSecret: data.client_secret.value });
}
