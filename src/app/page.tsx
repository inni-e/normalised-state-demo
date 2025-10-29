"use client";

import { useState, useEffect, useRef } from "react";
import StreamedMessage from "@/components/StreamedMessage";
import ArtifactPanel from "@/components/artifact/ArtifactPanel";
import type { Artifact } from "@/types/chat-stream";
import { useSimulatedStream } from "@/hooks/use-simulated-stream";
import { useChatStreamStore } from "@/lib/store/chat-stream-store";
import Link from "next/link";

export default function HomePage() {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
    null,
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { startSimulation } = useSimulatedStream();
  const { isStreamingResponse, streamingState, currentArtifactId } =
    useChatStreamStore();

  // Track the previous artifact ID to detect new artifacts
  const prevArtifactIdRef = useRef<string | null>(null);

  const handleArtifactClick = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setIsPanelOpen(true);
  };

  const handleSendMessage = () => {
    void startSimulation();
  };

  // Get current artifact from store
  const currentArtifact = currentArtifactId
    ? streamingState.artifactsById[currentArtifactId]
    : null;

  // Keep selectedArtifact in sync with currentArtifact and auto-open panel
  useEffect(() => {
    if (currentArtifact) {
      // Always update selected artifact when current artifact changes (handles text updates)
      setSelectedArtifact(currentArtifact);

      // Only auto-open if this is a NEW artifact (different ID than before)
      const isNewArtifact = currentArtifactId !== prevArtifactIdRef.current;
      if (isNewArtifact && !isPanelOpen) {
        setIsPanelOpen(true);
      }

      // Update the previous ID
      prevArtifactIdRef.current = currentArtifactId;
    } else {
      // No artifact, reset the ref
      prevArtifactIdRef.current = null;
    }
  }, [currentArtifact, currentArtifactId, isPanelOpen]);

  return (
    <>
      <main className="flex h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Main Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto">
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

            {/* Navigation */}
            <div className="mb-6 flex justify-center gap-4">
              <Link
                href="/"
                className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-all hover:bg-purple-700 hover:shadow-lg"
              >
                Good Implementation
              </Link>
              <a
                href="/bad"
                className="rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg"
              >
                Bad Implementation
              </a>
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

            {/* Messages Area */}
            <div className="space-y-4">
              <StreamedMessage onArtifactClick={handleArtifactClick} />
            </div>
          </div>
        </div>

        {/* Artifact Panel */}
        <ArtifactPanel
          artifact={selectedArtifact}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
        />
      </main>
    </>
  );
}
