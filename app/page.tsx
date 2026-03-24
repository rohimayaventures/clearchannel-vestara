"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import ChannelPanel from "@/components/ChannelPanel";
import NLUSection from "@/components/NLUSection";
import IntentBar from "@/components/IntentBar";
import AutoIVRPlayer from "@/components/AutoIVRPlayer";
import RealtimeSession from "@/components/RealtimeSession";
import WelcomeModal from "@/components/WelcomeModal";
import { AnalysisResult, SAMPLE_UTTERANCES } from "@/lib/types";
import { SEED_RESULT } from "@/lib/seedResult";

const SECTION_KEYS = ["intent", "ivr", "chatbot", "agent_assist", "nlu"] as const;

function extractCompleteSections(text: string): Partial<AnalysisResult> {
  const out: Record<string, unknown> = {};

  for (const key of SECTION_KEYS) {
    const tag = `"${key}"`;
    const keyIdx = text.indexOf(tag);
    if (keyIdx === -1) continue;

    const colonIdx = text.indexOf(":", keyIdx + tag.length);
    if (colonIdx === -1) continue;

    let braceStart = -1;
    for (let i = colonIdx + 1; i < text.length; i++) {
      const ch = text[i];
      if (ch === " " || ch === "\n" || ch === "\r" || ch === "\t") continue;
      if (ch === "{") {
        braceStart = i;
        break;
      }
      break;
    }
    if (braceStart === -1) continue;

    let depth = 0;
    let inStr = false;
    let esc = false;
    let braceEnd = -1;

    for (let i = braceStart; i < text.length; i++) {
      const ch = text[i];
      if (esc) { esc = false; continue; }
      if (ch === "\\" && inStr) { esc = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) { braceEnd = i; break; }
      }
    }
    if (braceEnd === -1) continue;

    try {
      out[key] = JSON.parse(text.substring(braceStart, braceEnd + 1));
    } catch {
      /* section not yet valid */
    }
  }

  return out as Partial<AnalysisResult>;
}

export default function Home() {
  const [utterance, setUtterance] = useState<string>(SAMPLE_UTTERANCES[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(SEED_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [realtimeOpen, setRealtimeOpen] = useState(false);
  const [nluExpanded, setNluExpanded] = useState(false);
  const voiceTriggered = useRef(false);

  const sentiment = result?.intent.sentiment ?? "neutral";

  // Fire auto-play 400ms after a voice-triggered analysis completes.
  // The delay mirrors the natural IVR processing beat between
  // speech recognition and the system's first spoken response.
  useEffect(() => {
    if (!result || isLoading || !voiceTriggered.current) return;
    voiceTriggered.current = false;
    const timer = setTimeout(() => setShouldAutoPlay(true), 400);
    return () => clearTimeout(timer);
  }, [result, isLoading]);

  const analyze = useCallback(async (text: string) => {
    setShouldAutoPlay(false);
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utterance: text }),
      });
      if (!res.ok) throw new Error("Analysis failed");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let lineBuf = "";
      let lastSectionCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        lineBuf += decoder.decode(value, { stream: true });
        const lines = lineBuf.split("\n");
        lineBuf = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const payload = trimmed.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const { text: t } = JSON.parse(payload);
            if (t) accumulated += t;
          } catch {
            /* skip malformed */
          }
        }

        const sections = extractCompleteSections(accumulated);
        const count = Object.keys(sections).length;
        if (count > lastSectionCount) {
          lastSectionCount = count;
          setResult(sections as AnalysisResult);
        }
      }

      // Final parse of the complete response
      const cleaned = accumulated
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      try {
        setResult(JSON.parse(cleaned));
      } catch {
        /* keep whatever we progressively parsed */
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeFromVoice = useCallback((text: string) => {
    voiceTriggered.current = true;
    setUtterance(text);
    analyze(text);
  }, [analyze]);

  const handleSampleClick = (index: number, value: string) => {
    setActiveIndex(index);
    setUtterance(value);
    setSidebarDrawerOpen(false); // auto-close drawer on mobile
    analyze(value);
  };

  const handleAnalyze = () => {
    analyze(utterance);
  };

  const handleSessionEnd = useCallback((callerUtterance: string) => {
    if (callerUtterance.trim()) {
      voiceTriggered.current = true;
      setUtterance(callerUtterance);
      analyze(callerUtterance);
    }
    setRealtimeOpen(false);
  }, [analyze]);

  return (
    <div
      data-sentiment={sentiment}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: "var(--s-bg)",
        transition: "all 0.5s ease",
      }}
    >
      <WelcomeModal />
      <AutoIVRPlayer
        text={result?.ivr.spoken_response ?? null}
        shouldPlay={shouldAutoPlay}
        onPlayComplete={() => setShouldAutoPlay(false)}
      />
      <Topbar
        onDrawerOpen={() => setSidebarDrawerOpen(true)}
        realtimeActive={realtimeOpen}
        onRealtimeToggle={() => setRealtimeOpen((o) => !o)}
      />
      <RealtimeSession
        isOpen={realtimeOpen}
        onClose={() => setRealtimeOpen(false)}
        onSessionEnd={handleSessionEnd}
      />
      <IntentBar
        intent={result?.intent.primary ?? ""}
        variant={result?.intent.variant ?? null}
        confidence={result?.intent.confidence ?? 0}
        sentiment={sentiment}
        isLoading={isLoading}
      />
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>

        {/* Mobile drawer overlay */}
        <div
          className={`cc-drawer-overlay${sidebarDrawerOpen ? " is-open" : ""}`}
          onClick={() => setSidebarDrawerOpen(false)}
        />

        {/* Sidebar — inline on desktop, fixed drawer on mobile */}
        <div className={`cc-sidebar-container${sidebarDrawerOpen ? " is-open" : ""}`}>
          <button
            className="cc-drawer-close"
            onClick={() => setSidebarDrawerOpen(false)}
            aria-label="Close sidebar"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
                stroke="var(--s-text-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Sidebar
            utterance={utterance}
            onUtteranceChange={setUtterance}
            onAnalyze={handleAnalyze}
            onVoiceAnalyze={analyzeFromVoice}
            activeIndex={activeIndex}
            onSampleClick={handleSampleClick}
            intent={result?.intent.primary ?? ""}
            confidence={result?.intent.confidence ?? 0}
            isLoading={isLoading}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            isMobileDrawer={sidebarDrawerOpen}
          />
        </div>

        <main
          style={{
            flex: 1,
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            overflowY: "auto",
            background: "var(--s-bg)",
            transition: "all 0.4s ease",
            minWidth: 0,
          }}
        >
          <div className="cc-panels-row">
            <div className="cc-panel-ivr">
              <ChannelPanel channel="ivr" result={result} isLoading={isLoading} />
            </div>
            <div className="cc-panel-right">
              <ChannelPanel channel="chatbot" result={result} isLoading={isLoading} />
              <ChannelPanel channel="agent_assist" result={result} isLoading={isLoading} />
            </div>
          </div>
          <NLUSection result={result} isLoading={isLoading} isExpanded={nluExpanded} onToggle={() => setNluExpanded((v) => !v)} />
        </main>
      </div>
    </div>
  );
}
