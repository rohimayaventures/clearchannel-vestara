"use client";

import { useState, useEffect, useCallback } from "react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import ChannelPanel from "@/components/ChannelPanel";
import NLUSection from "@/components/NLUSection";
import { AnalysisResult, SAMPLE_UTTERANCES } from "@/lib/types";

export default function Home() {
  const [utterance, setUtterance] = useState<string>(SAMPLE_UTTERANCES[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Topbar />
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
            background: "var(--color-gray-bg)",
            transition: "all 0.25s ease",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0,1fr))",
              gap: "9px",
            }}
          >
            <ChannelPanel channel="ivr" result={result} isLoading={isLoading} />
            <ChannelPanel channel="chatbot" result={result} isLoading={isLoading} />
            <ChannelPanel channel="agent_assist" result={result} isLoading={isLoading} />
          </div>
          <NLUSection result={result} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
}