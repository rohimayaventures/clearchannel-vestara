"use client";

import { useReducer, useRef, useEffect, useCallback } from "react";

interface RealtimeSessionProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionEnd: (utterance: string) => void;
}

interface ConvTurn {
  role: "assistant" | "user";
  text: string;
}

type SessionStatus = "idle" | "connecting" | "connected" | "error";

interface State {
  status: SessionStatus;
  turns: ConvTurn[];
  userSpeaking: boolean;
  error: string | null;
}

type Action =
  | { type: "CONNECTING" }
  | { type: "CONNECTED" }
  | { type: "ERROR"; error: string }
  | { type: "RESET" }
  | { type: "USER_SPEAKING"; speaking: boolean }
  | { type: "ASSISTANT_TURN"; text: string }
  | { type: "USER_TURN"; text: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "CONNECTING":
      return { ...state, status: "connecting", error: null };
    case "CONNECTED":
      return { ...state, status: "connected" };
    case "ERROR":
      return { ...state, status: "error", error: action.error };
    case "RESET":
      return { status: "idle", turns: [], userSpeaking: false, error: null };
    case "USER_SPEAKING":
      return { ...state, userSpeaking: action.speaking };
    case "ASSISTANT_TURN":
      return { ...state, turns: [...state.turns, { role: "assistant", text: action.text }] };
    case "USER_TURN":
      return { ...state, turns: [...state.turns, { role: "user", text: action.text }] };
    default:
      return state;
  }
}

const INIT: State = { status: "idle", turns: [], userSpeaking: false, error: null };

/** Convert Float32 PCM samples to Int16 PCM */
function float32ToInt16(buffer: Float32Array): ArrayBuffer {
  const out = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out.buffer;
}

/** ArrayBuffer → base64 string */
function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

/** base64 → ArrayBuffer */
function fromBase64(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export default function RealtimeSession({ isOpen, onClose, onSessionEnd }: RealtimeSessionProps) {
  const [state, dispatch] = useReducer(reducer, INIT);

  const wsRef = useRef<WebSocket | null>(null);
  const captureCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<string[]>([]);
  const lastUserUtteranceRef = useRef<string>("");
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.turns]);

  const stopCapture = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (captureCtxRef.current) {
      captureCtxRef.current.close();
      captureCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const closeSession = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopCapture();
    if (playbackCtxRef.current) {
      playbackCtxRef.current.close();
      playbackCtxRef.current = null;
    }
    audioChunksRef.current = [];
  }, [stopCapture]);

  // Close session when panel is hidden
  useEffect(() => {
    if (!isOpen) {
      closeSession();
      dispatch({ type: "RESET" });
    }
  }, [isOpen, closeSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => closeSession();
  }, [closeSession]);

  const playAccumulatedAudio = useCallback(async () => {
    if (audioChunksRef.current.length === 0) return;

    // Combine all base64 chunks into one ArrayBuffer
    const combined = audioChunksRef.current.join("");
    audioChunksRef.current = [];
    const pcmBuffer = fromBase64(combined);

    try {
      const ctx = new AudioContext({ sampleRate: 24000 });
      playbackCtxRef.current = ctx;

      // PCM16 → Float32 for Web Audio API
      const int16 = new Int16Array(pcmBuffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / (int16[i] < 0 ? 0x8000 : 0x7fff);
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.copyToChannel(float32, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => {
        ctx.close();
        playbackCtxRef.current = null;
      };
      source.start(0);
    } catch (err) {
      console.error("Realtime playback error:", err);
    }
  }, []);

  const startCapture = useCallback(async (ws: WebSocket) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext({ sampleRate: 24000 });
      captureCtxRef.current = ctx;

      // ScriptProcessorNode: deprecated but most reliable cross-browser PCM tap
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(processor);
      processor.connect(ctx.destination);

      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN) return;
        const pcm = float32ToInt16(e.inputBuffer.getChannelData(0));
        ws.send(JSON.stringify({
          type: "input_audio_buffer.append",
          audio: toBase64(pcm),
        }));
      };
    } catch (err) {
      console.error("Microphone capture error:", err);
      dispatch({ type: "ERROR", error: "Microphone access denied" });
    }
  }, []);

  const startSession = useCallback(async () => {
    dispatch({ type: "CONNECTING" });

    try {
      const tokenRes = await fetch("/api/realtime-session", { method: "POST" });
      if (!tokenRes.ok) throw new Error("Failed to get session token");
      const { clientSecret } = await tokenRes.json();

      const ws = new WebSocket(
        "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
        [
          "realtime",
          `openai-insecure-api-key.${clientSecret}`,
          "openai-beta.realtime-v1",
        ]
      );
      wsRef.current = ws;

      ws.onopen = () => {
        dispatch({ type: "CONNECTED" });
        startCapture(ws);
        // Trigger Vestara's opening greeting
        ws.send(JSON.stringify({
          type: "response.create",
          response: {
            modalities: ["audio", "text"],
            instructions: "Greet the caller warmly and ask how you can help them today.",
          },
        }));
      };

      ws.onmessage = (event) => {
        let msg: Record<string, unknown>;
        try { msg = JSON.parse(event.data); } catch { return; }

        switch (msg.type) {
          case "input_audio_buffer.speech_started":
            dispatch({ type: "USER_SPEAKING", speaking: true });
            break;

          case "input_audio_buffer.speech_stopped":
            dispatch({ type: "USER_SPEAKING", speaking: false });
            break;

          case "conversation.item.input_audio_transcription.completed": {
            const text = (msg.transcript as string) ?? "";
            if (text.trim()) {
              dispatch({ type: "USER_TURN", text: text.trim() });
              lastUserUtteranceRef.current = text.trim();
            }
            break;
          }

          case "response.audio_transcript.done": {
            const text = (msg.transcript as string) ?? "";
            if (text.trim()) {
              dispatch({ type: "ASSISTANT_TURN", text: text.trim() });
            }
            break;
          }

          case "response.audio.delta": {
            const delta = msg.delta as string;
            if (delta) audioChunksRef.current.push(delta);
            break;
          }

          case "response.done":
            playAccumulatedAudio();
            break;

          case "error":
            console.error("Realtime API error:", msg);
            dispatch({ type: "ERROR", error: "Session error — see console" });
            break;
        }
      };

      ws.onerror = () => dispatch({ type: "ERROR", error: "WebSocket connection failed" });
      ws.onclose = () => {
        stopCapture();
        if (lastUserUtteranceRef.current) {
          onSessionEnd(lastUserUtteranceRef.current);
          lastUserUtteranceRef.current = "";
        }
      };
    } catch (err) {
      console.error("Session start error:", err);
      dispatch({ type: "ERROR", error: err instanceof Error ? err.message : "Unknown error" });
    }
  }, [startCapture, stopCapture, playAccumulatedAudio, onSessionEnd]);

  const handleEndSession = () => {
    closeSession();
    // Dispatch session end with last known utterance
    if (lastUserUtteranceRef.current) {
      onSessionEnd(lastUserUtteranceRef.current);
      lastUserUtteranceRef.current = "";
    }
    dispatch({ type: "RESET" });
    onClose();
  };

  if (!isOpen) return null;

  const isConnected = state.status === "connected";
  const isConnecting = state.status === "connecting";
  const isActive = isConnected || isConnecting;

  return (
    <div
      style={{
        borderBottom: "1px solid var(--s-border)",
        background: "var(--s-surface)",
        transition: "all 0.4s ease",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Live indicator dot */}
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: isConnected
                ? "#22C55E"
                : isConnecting
                ? "#F59E0B"
                : state.status === "error"
                ? "#EF4444"
                : "var(--s-border)",
              flexShrink: 0,
              boxShadow: isConnected
                ? "0 0 0 2px rgba(34,197,94,0.25)"
                : "none",
              transition: "background 0.3s ease, box-shadow 0.3s ease",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: isActive ? "var(--s-text)" : "var(--s-text-muted)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
              transition: "color 0.3s ease",
            }}
          >
            {isConnecting ? "Connecting…" : isConnected ? "Live Call" : state.status === "error" ? "Session Error" : "Live Call Demo"}
          </span>
          {state.userSpeaking && (
            <span
              style={{
                fontSize: "9px",
                fontWeight: 600,
                color: "#DC2626",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                animation: "ivr-pulse 0.9s ease-in-out infinite",
                fontFamily: "var(--font-sans)",
              }}
            >
              Speaking
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {!isActive && state.status !== "error" && (
            <button
              onClick={startSession}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                background: "var(--s-accent)",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="3" stroke="#ffffff" strokeWidth="1.2" />
                <path d="M3 2.5l2.5 1.5L3 5.5V2.5z" fill="#ffffff" />
              </svg>
              Start
            </button>
          )}
          {isActive && (
            <button
              onClick={handleEndSession}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                background: "#DC2626",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <rect x="1.5" y="1.5" width="5" height="5" rx="0.75" fill="#ffffff" />
              </svg>
              End Call
            </button>
          )}
          {state.status === "error" && (
            <button
              onClick={() => dispatch({ type: "RESET" })}
              style={{
                padding: "4px 10px",
                background: "var(--s-surface-2)",
                color: "var(--s-text-2)",
                border: "1px solid var(--s-border)",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              Dismiss
            </button>
          )}
          <button
            onClick={isActive ? handleEndSession : onClose}
            aria-label="Close"
            style={{
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--s-text-muted)",
              borderRadius: "3px",
              flexShrink: 0,
            }}
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Transcript — only rendered when session has turns */}
      {state.turns.length > 0 && (
        <div
          style={{
            maxHeight: "160px",
            overflowY: "auto",
            borderTop: "1px solid var(--s-border)",
            padding: "8px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          {state.turns.map((turn, i) => (
            <div key={i} style={{ display: "flex", gap: "7px", alignItems: "flex-start" }}>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  color: turn.role === "assistant" ? "var(--s-accent-text)" : "var(--s-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  flexShrink: 0,
                  paddingTop: "1px",
                  width: "52px",
                }}
              >
                {turn.role === "assistant" ? "Vestara" : "Caller"}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--s-text-2)",
                  lineHeight: 1.45,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {turn.text}
              </span>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      )}

      {/* Error message */}
      {state.error && (
        <div
          style={{
            padding: "6px 14px 8px",
            fontSize: "10.5px",
            color: "#991B1B",
            fontFamily: "var(--font-sans)",
          }}
        >
          {state.error}
        </div>
      )}
    </div>
  );
}
