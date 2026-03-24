"use client";

import { useEffect, useRef } from "react";

interface AutoIVRPlayerProps {
  text: string | null;
  shouldPlay: boolean;
  onPlayComplete: () => void;
}

/**
 * Headless component — renders nothing.
 * When shouldPlay flips to true, fetches /api/speak and plays the
 * IVR response automatically. Cleans up AudioContext on unmount
 * or when a new play cycle cancels the previous one.
 */
export default function AutoIVRPlayer({
  text,
  shouldPlay,
  onPlayComplete,
}: AutoIVRPlayerProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  // Keep callback ref current so the effect closure is never stale
  const onPlayCompleteRef = useRef(onPlayComplete);
  useEffect(() => {
    onPlayCompleteRef.current = onPlayComplete;
  }, [onPlayComplete]);

  useEffect(() => {
    if (!shouldPlay || !text) return;

    let cancelled = false;

    const play = async () => {
      try {
        const res = await fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok || cancelled) return;

        const arrayBuffer = await res.arrayBuffer();
        if (cancelled) return;

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        if (cancelled) {
          audioContext.close();
          audioContextRef.current = null;
          return;
        }

        const source = audioContext.createBufferSource();
        sourceRef.current = source;
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        source.onended = () => {
          if (!cancelled) onPlayCompleteRef.current();
          audioContext.close();
          audioContextRef.current = null;
          sourceRef.current = null;
        };

        source.start(0);
      } catch (err) {
        console.error("Auto-play error:", err);
        if (!cancelled) onPlayCompleteRef.current();
      }
    };

    play();

    return () => {
      cancelled = true;
      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch { /* already ended */ }
        sourceRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [shouldPlay, text]);

  return null;
}
