"use client";

import { useState, useRef, useEffect } from "react";

interface IVRPlayerProps {
  text: string;
}

/**
 * Compact play button for the IVR panel header.
 * Three states: idle (filled accent), loading (dimmed spinner),
 * playing (pause icon + gentle pulse animation).
 */
export default function IVRPlayer({ text }: IVRPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch { /* already stopped */ }
        sourceRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const handlePlay = async () => {
    if (isLoading || isPlaying) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Speech failed");

      const arrayBuffer = await res.arrayBuffer();
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      sourceRef.current = source;
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      setIsLoading(false);
      setIsPlaying(true);

      source.onended = () => {
        setIsPlaying(false);
        audioContext.close();
        audioContextRef.current = null;
        sourceRef.current = null;
      };

      source.start(0);
    } catch (err) {
      console.error("Playback error:", err);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading || isPlaying}
      className={isPlaying ? "ivr-playing" : ""}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 9px",
        background: "var(--s-accent)",
        color: "#ffffff",
        border: "none",
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        cursor: isLoading || isPlaying ? "not-allowed" : "pointer",
        flexShrink: 0,
        fontFamily: "var(--font-sans)",
        transition: "background 0.4s ease, opacity 0.2s ease",
        opacity: isLoading ? 0.65 : 1,
      }}
    >
      {isPlaying ? (
        /* Pause bars */
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <rect x="1" y="1" width="2.5" height="7" rx="0.75" fill="#ffffff" />
          <rect x="5.5" y="1" width="2.5" height="7" rx="0.75" fill="#ffffff" />
        </svg>
      ) : isLoading ? (
        /* Spinning ring */
        <svg
          width="9" height="9" viewBox="0 0 9 9" fill="none"
          style={{ animation: "ivr-pulse 0.8s ease-in-out infinite" }}
        >
          <circle cx="4.5" cy="4.5" r="3.5"
            stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
          <path d="M4.5 1A3.5 3.5 0 018 4.5"
            stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ) : (
        /* Play triangle */
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 1.5l6 3-6 3V1.5z" fill="#ffffff" />
        </svg>
      )}
      {isPlaying ? "Playing" : isLoading ? "Loading" : "Play IVR"}
    </button>
  );
}
