"use client";

import { useState, useEffect, useCallback } from "react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import ChannelPanel from "@/components/ChannelPanel";
import NLUSection from "@/components/NLUSection";
import IntentBar from "@/components/IntentBar";
import { AnalysisResult, SAMPLE_UTTERANCES } from "@/lib/types";


export default function Home() {
  const [utterance, setUtterance] = useState<string>(SAMPLE_UTTERANCES[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sentiment = result?.intent.sentiment ?? "neutral";

  const analyze = useCallback(async (text: string) => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utterance: text }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    analyze(SAMPLE_UTTERANCES[0]);
  }, [analyze]);

  const handleSampleClick = (index: number, value: string) => {
    setActiveIndex(index);
    setUtterance(value);
    analyze(value);
  };

  const handleAnalyze = () => {
    analyze(utterance);
  };

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
      <Topbar />
      <IntentBar
        intent={result?.intent.primary ?? ""}
        variant={result?.intent.variant ?? null}
        confidence={result?.intent.confidence ?? 0}
        sentiment={sentiment}
        isLoading={isLoading}
      />
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>

        <Sidebar
          utterance={utterance}
          onUtteranceChange={setUtterance}
          onAnalyze={handleAnalyze}
          activeIndex={activeIndex}
          onSampleClick={handleSampleClick}
          intent={result?.intent.primary ?? ""}
          confidence={result?.intent.confidence ?? 0}
          isLoading={isLoading}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

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
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "stretch",
            }}
          >
            <div style={{ flex: "0 0 44%", minWidth: 0, display: "flex" }}>
              <ChannelPanel channel="ivr" result={result} isLoading={isLoading} />
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <ChannelPanel channel="chatbot" result={result} isLoading={isLoading} />
              <ChannelPanel channel="agent_assist" result={result} isLoading={isLoading} />
            </div>
          </div>
          <NLUSection result={result} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
}
