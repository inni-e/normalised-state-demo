"use client";

import { useChatStreamStore } from "@/lib/store/chat-stream-store";
import { StreamChunkType } from "@/types/chat-stream";
import type { Artifact } from "@/types/chat-stream";
import ThinkingStream from "./thinking/ThinkingStream";
import MessageContent from "./message/MessageContent";
import ArtifactButton from "./message/ArtifactButton";
import ClarificationMessage from "./message/ClarificationMessage";
import ErrorMessage from "./message/ErrorMessage";

interface StreamedMessageProps {
  onArtifactClick: (artifact: Artifact) => void;
}

export default function StreamedMessage({
  onArtifactClick,
}: StreamedMessageProps) {
  const { streamingState, thinkingState } = useChatStreamStore();

  const hasContent =
    streamingState.renderSections.length > 0 ||
    thinkingState.renderSections.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      {/* Agent Name */}
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500 text-white">
          <span className="text-sm font-bold">AI</span>
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Assistant
        </span>
      </div>

      {/* Thinking Process */}
      <ThinkingStream />

      {/* Main Content */}
      <div className="space-y-2">
        {streamingState.renderSections.map((section) => {
          switch (section.type) {
            case StreamChunkType.MESSAGE: {
              const message = streamingState.messagesById[section.refId];
              if (!message) return null;
              return <MessageContent key={section.id} message={message} />;
            }

            case StreamChunkType.ARTIFACT: {
              const artifact = streamingState.artifactsById[section.refId];
              if (!artifact) return null;
              return (
                <ArtifactButton
                  key={section.id}
                  artifact={artifact}
                  onClick={() => onArtifactClick(artifact)}
                />
              );
            }

            case StreamChunkType.CLARIFICATION: {
              const clarification =
                streamingState.clarificationQuestionsById[section.refId];
              if (!clarification) return null;
              return (
                <ClarificationMessage
                  key={section.id}
                  clarification={clarification}
                />
              );
            }

            case StreamChunkType.ERROR: {
              const error = streamingState.errorMessageById[section.refId];
              if (!error) return null;
              return <ErrorMessage key={section.id} error={error} />;
            }

            default:
              return null;
          }
        })}
      </div>

      {/* Streaming cursor if still streaming */}
      {streamingState.renderSections.length > 0 && (
        <div className="inline-block h-4 w-1 animate-pulse bg-gray-900 dark:bg-gray-100" />
      )}
    </div>
  );
}
