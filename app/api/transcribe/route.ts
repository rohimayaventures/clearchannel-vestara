import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB — Whisper's hard limit

const ALLOWED_MIME_TYPES = new Set([
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/flac",
  "audio/x-flac",
]);

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const audio = formData.get("audio");

  if (!audio || !(audio instanceof File)) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  if (audio.size === 0) {
    return NextResponse.json({ error: "Audio file is empty" }, { status: 400 });
  }

  if (audio.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "Audio file exceeds 25 MB limit" }, { status: 413 });
  }

  // Normalize MIME type — strip codec parameters for comparison
  const mimeBase = audio.type.split(";")[0].trim().toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(mimeBase) && !ALLOWED_MIME_TYPES.has(audio.type)) {
    return NextResponse.json(
      { error: `Unsupported audio format: ${audio.type}` },
      { status: 415 }
    );
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      language: "en",
    });

    return NextResponse.json({ transcript: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
