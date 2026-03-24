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
 * IVR response automatically. Uses HTML Audio + Blob URL instead
 * of AudioContext to preserve the iOS Safari user-gesture token.
 */
export default function AutoIVRPlayer({
  text,
  shouldPlay,
  onPlayComplete,
}: AutoIVRPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const onPlayCompleteRef = useRef(onPlayComplete);
  useEffect(() => {
    onPlayCompleteRef.current = onPlayComplete;
  }, [onPlayComplete]);

  useEffect(() => {
    if (!shouldPlay || !text) return;

    let cancelled = false;

    const cleanup = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };

    const play = async () => {
      try {
        const res = await fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok || cancelled) return;

        const blob = await res.blob();
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          if (!cancelled) onPlayCompleteRef.current();
          cleanup();
        };

        await audio.play();
      } catch (err) {
        console.error("Auto-play error:", err);
        if (!cancelled) onPlayCompleteRef.current();
        cleanup();
      }
    };

    play();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [shouldPlay, text]);

  return null;
}
