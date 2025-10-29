"use client";

import { useState } from "react";
import StreamedMessage from "@/components/StreamedMessage";
import ArtifactPanel from "@/components/artifact/ArtifactPanel";
import type { Artifact } from "@/types/chat-stream";
import { useSimulatedStream } from "@/hooks/use-simulated-stream";
import { useChatStreamStore } from "@/lib/store/chat-stream-store";

export default function HomePage() {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
    null,
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { startSimulation } = useSimulatedStream();
  const { isStreamingResponse } = useChatStreamStore();

  const handleArtifactClick = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setIsPanelOpen(true);
  };

  const handleSendMessage = () => {
    void startSimulation();
  };

  return (
    <>
      <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
              Normalized State Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Showcasing type-safe streaming with normalized state management
            </p>
          </div>

          {/* Control Panel */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Controls
            </h2>
            <div className="flex gap-4">
              <button
                onClick={handleSendMessage}
                disabled={isStreamingResponse}
                className="rounded-lg bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-purple-600 disabled:hover:to-pink-600"
              >
                {isStreamingResponse ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Streaming...
                  </span>
                ) : (
                  "Send Demo Message"
                )}
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Click the button above to simulate a streaming response with
              various chunk types
            </p>
          </div>

          {/* Architecture Info */}
          <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
              <span>ℹ️</span>
              Architecture Overview
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p>
                <strong>Normalized State:</strong> Data is stored in flat
                dictionaries by ID (messagesById, artifactsById, etc.)
              </p>
              <p>
                <strong>Render Sections:</strong> Ordered array of references
                that determine display sequence
              </p>
              <p>
                <strong>Type Safety:</strong> Full TypeScript coverage with
                discriminated unions for chunks
              </p>
              <p>
                <strong>State Management:</strong> Zustand for global state with
                React hooks integration
              </p>
              <p>
                <strong>Chunk Types:</strong> MESSAGE, ARTIFACT, CLARIFICATION,
                FUNCTION_CALL, WEB_SEARCH, REASONING_TEXT, STAFF_REPORT_RULE,
                ERROR
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="space-y-4">
            <StreamedMessage onArtifactClick={handleArtifactClick} />
          </div>

          {/* Features List */}
          <div className="mt-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Demo Features
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <span className="text-xl">💭</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Reasoning Text
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Shows AI thinking process
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🔧</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Function Calls
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Expandable tool invocations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🔍</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Web Search
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Search results with sources
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">📋</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Staff Report Rules
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Structured rule sections
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">📄</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Artifacts
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Claude-style side panel
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">❓</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Clarifications
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Follow-up questions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Artifact Panel */}
      <ArtifactPanel
        artifact={selectedArtifact}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </>
  );
}
