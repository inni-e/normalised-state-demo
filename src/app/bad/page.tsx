"use client";

import { useState, useEffect, useRef } from "react";
import type { Artifact } from "@/types/chat-stream";
import { useBadStream } from "@/hooks/use-bad-stream";
import BadStreamedMessage from "@/components/bad/BadStreamedMessage";
import BadArtifactPanel from "@/components/bad/BadArtifactPanel";

export default function BadPage() {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
    null,
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { rawStream, isStreaming, startSimulation } = useBadStream();

  const prevArtifactIdRef = useRef<string | null>(null);

  const handleArtifactClick = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setIsPanelOpen(true);
  };

  const handleSendMessage = () => {
    void startSimulation();
  };

  // Extract current artifact from raw stream
  // Bad practice: parsing on every render
  const extractCurrentArtifact = () => {
    if (!rawStream) return null;

    const artifactMatch = rawStream.match(
      /<artifact[^>]*language="([^"]*)"[^>]*>(.*?)<\/artifact>/s,
    );
    if (!artifactMatch) return null;

    // Find last artifact ID from the stream
    const allArtifacts = [
      ...rawStream.matchAll(/<artifact[^>]*>(.*?)<\/artifact>/gs),
    ];
    if (allArtifacts.length === 0) return null;

    const lastArtifact = allArtifacts[allArtifacts.length - 1];
    if (!lastArtifact) return null;

    const attrs =
      rawStream.match(/<artifact[^>]*language="([^"]*)"[^>]*>/) ?? [];
    const language = attrs[1] ?? "markdown";

    return {
      id: crypto.randomUUID(),
      text: lastArtifact[1] ?? "",
      language,
    };
  };

  const currentArtifact = extractCurrentArtifact();

  // Keep selectedArtifact in sync with currentArtifact and auto-open panel
  useEffect(() => {
    if (currentArtifact) {
      setSelectedArtifact(currentArtifact);

      const isNewArtifact = currentArtifact.id !== prevArtifactIdRef.current;
      if (isNewArtifact && !isPanelOpen) {
        setIsPanelOpen(true);
      }

      prevArtifactIdRef.current = currentArtifact.id;
    } else {
      prevArtifactIdRef.current = null;
    }
  }, [currentArtifact, isPanelOpen]);

  return (
    <>
      <main className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 py-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-bold text-red-900 dark:text-red-100">
                Bad XML Stream Implementation
              </h1>
              <p className="text-red-600 dark:text-red-400">
                ⚠️ Warning: This is a bad approach - streams are raw XML strings
                parsed on every render
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                No normalized state - components inferred from XML tags in a
                single string
              </p>
            </div>

            {/* Navigation */}
            <div className="mb-6 flex justify-center gap-4">
              <a
                href="/"
                className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-all hover:bg-purple-700 hover:shadow-lg"
              >
                ← Good Implementation
              </a>
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
                  disabled={isStreaming}
                  className="rounded-lg bg-linear-to-r from-red-600 to-orange-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-red-700 hover:to-orange-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-red-600 disabled:hover:to-orange-600"
                >
                  {isStreaming ? (
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
                This simulates streaming by appending XML strings to a single
                buffer
              </p>
            </div>

            {/* Messages Area */}
            <div className="space-y-4">
              <BadStreamedMessage
                rawStream={rawStream}
                onArtifactClick={handleArtifactClick}
              />
            </div>
          </div>
        </div>

        {/* Artifact Panel */}
        <BadArtifactPanel
          artifact={selectedArtifact}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
        />
      </main>
    </>
  );
}