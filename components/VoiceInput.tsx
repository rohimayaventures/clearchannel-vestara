"use client";

import { useState, useRef, useEffect } from "react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isAnalyzing: boolean;
}

export default function VoiceInput({ onTranscript, isAnalyzing }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Direct DOM refs — updated at 60fps without going through React state
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (analyserCtxRef.current) analyserCtxRef.current.close();
    };
  }, []);

  const startVisualizer = (stream: MediaStream) => {
    const ctx = new AudioContext();
    analyserCtxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;           // 32 frequency bins
    analyser.smoothingTimeConstant = 0.65;
    analyserRef.current = analyser;
    ctx.createMediaStreamSource(stream).connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount); // 32 values

    const tick = () => {
      analyser.getByteFrequencyData(data);

      // Map 32 bins → 8 bands (4 bins averaged per band)
      let peak = 0;
      for (let i = 0; i < 8; i++) {
        const start = i * 4;
        const v = (data[start] + data[start + 1] + data[start + 2] + data[start + 3]) / (4 * 255);
        if (v > peak) peak = v;

        const bar = barRefs.current[i];
        if (bar) {
          bar.style.height = `${Math.max(3, v * 16)}px`;
          bar.style.opacity = String(0.35 + v * 0.65);
        }
      }

      // Amplitude-driven glow on the button
      if (buttonRef.current) {
        buttonRef.current.style.boxShadow = peak > 0.02
          ? `0 0 0 ${peak * 5}px rgba(220,38,38,${0.22 * peak}), 0 0 0 ${peak * 11}px rgba(220,38,38,${0.09 * peak})`
          : "none";
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  };

  const stopVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (analyserCtxRef.current) {
      analyserCtxRef.current.close();
      analyserCtxRef.current = null;
    }
    analyserRef.current = null;

    // Reset DOM-driven styles
    if (buttonRef.current) buttonRef.current.style.boxShadow = "none";
    barRefs.current.forEach((bar) => {
      if (bar) { bar.style.height = "3px"; bar.style.opacity = "0.35"; }
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        stopVisualizer();
        await transcribeAudio(blob);
      };

      mediaRecorder.start();
      startVisualizer(stream);
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Transcription failed");
      const data = await res.json();
      if (data.transcript) onTranscript(data.transcript);
    } catch (err) {
      console.error("Transcription error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const getLabel = () => {
    if (isProcessing) return "Transcribing...";
    if (isRecording) return "Stop recording";
    return "Speak an utterance";
  };

  return (
    <div style={{ marginTop: "6px" }}>
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isProcessing || isAnalyzing}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          width: "100%",
          background: isRecording ? "#DC2626" : "var(--s-surface-2)",
          color: isRecording ? "#fff" : "var(--s-text-2)",
          border: `1px solid ${isRecording ? "#DC2626" : "var(--s-border)"}`,
          borderRadius: "5px",
          padding: "10px 0",
          minHeight: "44px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: isProcessing || isAnalyzing ? "not-allowed" : "pointer",
          opacity: isProcessing || isAnalyzing ? 0.6 : 1,
          fontFamily: "var(--font-sans)",
          transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
        }}
      >
        {isRecording ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="1" y="1" width="8" height="8" rx="1" fill="#fff" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <rect x="3.5" y="1" width="4" height="6" rx="2"
              stroke="var(--s-text-muted)" strokeWidth="1.2" />
            <path d="M1.5 5.5a4 4 0 008 0"
              stroke="var(--s-text-muted)" strokeWidth="1.2"
              strokeLinecap="round" />
            <line x1="5.5" y1="9.5" x2="5.5" y2="8"
              stroke="var(--s-text-muted)" strokeWidth="1.2"
              strokeLinecap="round" />
          </svg>
        )}
        {getLabel()}
      </button>

      {/*
        Live frequency waveform — always in DOM so barRefs are always
        assigned before the RAF tick starts. Hidden via display:none
        when not recording. Updated directly via barRefs, not React state.
      */}
      <div
        style={{
          display: isRecording ? "flex" : "none",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "2px",
          height: "18px",
          marginTop: "5px",
          padding: "0 1px",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { barRefs.current[i] = el; }}
            style={{
              flex: 1,
              height: "3px",
              background: "#DC2626",
              borderRadius: "2px",
              opacity: 0.35,
            }}
          />
        ))}
      </div>
    </div>
  );
}
