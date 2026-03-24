import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const MAX_TEXT_LENGTH = 1000;

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("text" in body)) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const { text } = body as { text: unknown };

  if (typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "text must be a non-empty string" }, { status: 400 });
  }

  const cleaned = text
    .replace(/\[pause \d+ms\]/g, "")
    .replace(/\[await\]/g, "")
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length === 0) {
    return NextResponse.json({ error: "No speakable text after cleaning" }, { status: 400 });
  }

  if (cleaned.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `Text must be ${MAX_TEXT_LENGTH} characters or fewer after cleaning` },
      { status: 400 }
    );
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const mp3 = await client.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: cleaned,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "Speech generation failed" }, { status: 500 });
  }
}
