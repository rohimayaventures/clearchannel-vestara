"use client";

import { useState, useRef, useEffect } from "react";

interface IVRPlayerProps {
  text: string;
}

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

  const getLabel = () => {
    if (isLoading) return "Loading audio...";
    if (isPlaying) return "Playing IVR response...";
    return "Play IVR response";
  };

  const getBorderColor = () => {
    if (isPlaying) return "var(--s-accent)";
    return "var(--s-border)";
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading || isPlaying}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        width: "100%",
        marginTop: "8px",
        background: "var(--s-surface-2)",
        color: isPlaying ? "var(--s-accent-text)" : "var(--s-text-2)",
        border: `1px solid ${getBorderColor()}`,
        borderRadius: "5px",
        padding: "7px 0",
        fontSize: "12px",
        fontWeight: 600,
        cursor: isLoading || isPlaying ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.6 : 1,
        fontFamily: "var(--font-sans)",
        transition: "all 0.4s ease",
      }}
    >
      {isPlaying ? (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <rect x="1.5" y="1.5" width="3" height="8"
            rx="1" fill="var(--s-accent)" />
          <rect x="6.5" y="1.5" width="3" height="8"
            rx="1" fill="var(--s-accent)" />
        </svg>
      ) : isLoading ? (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="4"
            stroke="var(--s-text-muted)"
            strokeWidth="1.2"
            strokeDasharray="6 6"
            strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M2 2l7 3.5L2 9V2z"
            fill="var(--s-text-muted)" />
        </svg>
      )}
      {getLabel()}
    </button>
  );
}
