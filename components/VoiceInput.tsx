"use client";

import { useState, useRef } from "react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isAnalyzing: boolean;
}

export default function VoiceInput({ onTranscript, isAnalyzing }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        await transcribeAudio(blob);
      };

      mediaRecorder.start();
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

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Transcription failed");
      const data = await res.json();
      if (data.transcript) {
        onTranscript(data.transcript);
      }
    } catch (err) {
      console.error("Transcription error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getLabel = () => {
    if (isProcessing) return "Transcribing...";
    if (isRecording) return "Stop recording";
    return "Speak utterance";
  };

  const getBackground = () => {
    if (isRecording) return "#DC2626";
    return "var(--color-gray-surface)";
  };

  const getColor = () => {
    if (isRecording) return "#fff";
    return "var(--color-text-secondary)";
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing || isAnalyzing}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        width: "100%",
        marginTop: "6px",
        background: getBackground(),
        color: getColor(),
        border: `1px solid ${isRecording ? "#DC2626" : "var(--color-gray-border)"}`,
        borderRadius: "5px",
        padding: "7px 0",
        fontSize: "12px",
        fontWeight: 600,
        cursor: isProcessing || isAnalyzing ? "not-allowed" : "pointer",
        opacity: isProcessing || isAnalyzing ? 0.6 : 1,
        fontFamily: "var(--font-sans)",
        transition: "all 0.2s ease",
      }}
    >
      {isRecording ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <rect x="1" y="1" width="8" height="8" rx="1" fill="#fff" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <rect x="3.5" y="1" width="4" height="6" rx="2"
            stroke="var(--color-text-muted)" strokeWidth="1.2" />
          <path d="M1.5 5.5a4 4 0 008 0"
            stroke="var(--color-text-muted)" strokeWidth="1.2"
            strokeLinecap="round" />
          <line x1="5.5" y1="9.5" x2="5.5" y2="8"
            stroke="var(--color-text-muted)" strokeWidth="1.2"
            strokeLinecap="round" />
        </svg>
      )}
      {getLabel()}
    </button>
  );
}