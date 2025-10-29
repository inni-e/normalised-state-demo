"use client";

import { parseXMLString } from "@/lib/xml-parser";
import type { Artifact } from "@/types/chat-stream";
import MessageContent from "../message/MessageContent";
import ArtifactButton from "../message/ArtifactButton";
import ClarificationMessage from "../message/ClarificationMessage";
import ErrorMessage from "../message/ErrorMessage";

interface BadStreamedMessageProps {
  rawStream: string;
  onArtifactClick: (artifact: Artifact) => void;
}

export default function BadStreamedMessage({
  rawStream,
  onArtifactClick,
}: BadStreamedMessageProps) {
  // Bad practice: Parse the entire XML string on every render
  // Only render complete XML tags (exclude currently streaming tags)
  const parsedComponents = parseXMLString(rawStream);

  // Get the raw stream with only INCOMPLETE XML tags (for showing streaming)
  // Remove complete XML tags to show only what's currently being streamed
  let streamWithIncompleteTags = rawStream;

  // Remove all complete self-closing tags
  streamWithIncompleteTags = streamWithIncompleteTags.replace(/<[^>]*\/>/g, "");

  // Remove all complete paired tags iteratively
  let previous = "";
  let iterations = 0;
  while (streamWithIncompleteTags !== previous && iterations < 10) {
    previous = streamWithIncompleteTags;
    streamWithIncompleteTags = streamWithIncompleteTags.replace(
      /<[^>]*>[\s\S]*?<\/[^>]*>/g,
      "",
    );
    iterations++;
  }

  // Extract plain text messages (text that's NOT inside XML tags)
  let cleanedText = rawStream;

  // First pass: Remove all self-closing tags like <tag/>
  cleanedText = cleanedText.replace(/<[^>]*\/>/g, "");

  // Second pass: Remove all paired tags with their content iteratively
  previous = "";
  iterations = 0;
  while (cleanedText !== previous && iterations < 10) {
    previous = cleanedText;
    cleanedText = cleanedText.replace(/<[^>]*>[\s\S]*?<\/[^>]*>/g, "");
    iterations++;
  }

  // Third pass: Remove incomplete opening tags (currently streaming)
  cleanedText = cleanedText.replace(/<[^>]*$/g, "");

  // Extract plain text chunks (text between XML tags or standalone text)
  // This is the actual message content, not content inside XML tags
  const plainTextChunks = cleanedText
    .split(/\.\s+|\n+/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 3 && !chunk.includes("<"));

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      {/* Agent Name */}
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-orange-500 text-white">
          <span className="text-sm font-bold">XML</span>
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Bad Implementation (XML Parsing)
        </span>
      </div>

      {/* Content - Only render complete XML tags */}
      <div className="space-y-2">
        {parsedComponents.map((section, idx) => {
          switch (section.type) {
            case "reasoning": {
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400">
                      💭
                    </span>
                    <p className="text-sm text-purple-900 dark:text-purple-100">
                      {section.text}
                    </p>
                  </div>
                </div>
              );
            }

            case "function_call": {
              const attrs = section.attributes ?? {};
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400">🔧</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Calling function: {attrs.name}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Status: {attrs.status}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            case "web_search": {
              const attrs = section.attributes ?? {};
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">
                      🔍
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Web Search
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        {attrs.query}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            case "staff_report_rule": {
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400">
                      📋
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        Staff Report: {section.attributes?.section_name}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        {section.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            case "message": {
              return (
                <MessageContent
                  key={idx}
                  message={{
                    id: section.id ?? `message-${idx}`,
                    text: section.text ?? "",
                  }}
                />
              );
            }

            case "artifact": {
              const attrs = section.attributes ?? {};
              const artifact: Artifact = {
                id: section.id ?? `artifact-${idx}`,
                text: section.text ?? "",
                language: attrs.language ?? "markdown",
              };
              return (
                <ArtifactButton
                  key={idx}
                  artifact={artifact}
                  onClick={() => onArtifactClick(artifact)}
                />
              );
            }

            case "clarification": {
              // Parse questions from XML text content (bad practice: parsing nested XML from string)
              const content = section.text ?? "";
              const questionMatches = [
                ...content.matchAll(/<question>(.*?)<\/question>/gs),
              ];
              const questions = questionMatches
                .map((match) => match[1] ?? "")
                .filter((q) => q);

              return (
                <ClarificationMessage
                  key={idx}
                  clarification={{
                    id: section.id ?? `clarification-${idx}`,
                    questions: questions.length > 0 ? questions : [content],
                  }}
                />
              );
            }

            case "error": {
              return (
                <ErrorMessage
                  key={idx}
                  error={{
                    id: section.id ?? `error-${idx}`,
                    text: section.text ?? "",
                    is_error: true,
                  }}
                />
              );
            }

            default:
              return null;
          }
        })}
      </div>

      {/* Plain text messages (no XML wrapping) */}
      {plainTextChunks.map((text, idx) => (
        <MessageContent
          key={`plain-${idx}`}
          message={{
            id: `plain-message-${idx}`,
            text,
          }}
        />
      ))}

      <span className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
        {streamWithIncompleteTags}
      </span>

      {/* Streaming cursor if still streaming */}
      {rawStream && !rawStream.includes("<stop/>") && (
        <div className="inline-block h-4 w-1 animate-pulse bg-red-900 dark:bg-red-100" />
      )}
    </div>
  );
}
