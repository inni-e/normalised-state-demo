"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useChatStreamStore } from "@/lib/store/chat-stream-store";
import { StreamChunkType } from "@/types/chat-stream";
import { useState, useEffect } from "react";

export default function ThinkingStream() {
  const { thinkingState } = useChatStreamStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(thinkingState.renderSections.map((section) => section.id)),
  );

  // Expand new sections as they stream in
  useEffect(() => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      thinkingState.renderSections.forEach((section) => {
        if (!prev.has(section.id)) {
          newSet.add(section.id);
        }
      });
      return newSet;
    });
  }, [thinkingState.renderSections]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (thinkingState.renderSections.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 space-y-2">
      <AnimatePresence>
        {thinkingState.renderSections.map((section) => {
          const isExpanded = expandedSections.has(section.id);

          switch (section.type) {
            case StreamChunkType.REASONING_TEXT: {
              const reasoning = thinkingState.reasoningTextById[section.refId];
              if (!reasoning) return null;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400">
                      💭
                    </span>
                    <p className="text-sm text-purple-900 dark:text-purple-100">
                      {reasoning.text}
                    </p>
                  </div>
                </motion.div>
              );
            }

            case StreamChunkType.FUNCTION_CALL: {
              const functionCall =
                thinkingState.functionCallsById[section.refId];
              if (!functionCall) return null;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-start gap-2 text-left"
                  >
                    <span className="text-blue-600 dark:text-blue-400">🔧</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Calling function: {functionCall.name}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Status: {functionCall.status}
                      </p>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400">
                      {isExpanded ? "▼" : "▶"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 overflow-hidden"
                      >
                        <pre className="rounded bg-blue-100 p-2 text-xs text-blue-900 dark:bg-blue-900 dark:text-blue-100">
                          {functionCall.arguments}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }

            case StreamChunkType.WEB_SEARCH: {
              const webSearch = thinkingState.webSearchById[section.refId];
              if (!webSearch) return null;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-start gap-2 text-left"
                  >
                    <span className="text-green-600 dark:text-green-400">
                      🔍
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Web Search
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        {webSearch.query}
                      </p>
                    </div>
                    <span className="text-green-600 dark:text-green-400">
                      {isExpanded ? "▼" : "▶"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-1 overflow-hidden"
                      >
                        {webSearch.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded bg-green-100 p-2 text-xs text-green-900 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800"
                          >
                            {source.title}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }

            case StreamChunkType.STAFF_REPORT_RULE: {
              const staffReport =
                thinkingState.staffReportRulesById[section.refId];
              if (!staffReport) return null;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-start gap-2 text-left"
                  >
                    <span className="text-amber-600 dark:text-amber-400">
                      📋
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        Staff Report Rules
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        {staffReport.rules.length} section(s)
                      </p>
                    </div>
                    <span className="text-amber-600 dark:text-amber-400">
                      {isExpanded ? "▼" : "▶"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-2 overflow-hidden"
                      >
                        {staffReport.rules.map((rule) => (
                          <div
                            key={rule.id}
                            className="rounded bg-amber-100 p-2 dark:bg-amber-900"
                          >
                            <p className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                              {rule.section_name}
                            </p>
                            <ul className="mt-1 ml-4 list-disc space-y-1">
                              {rule.rules.map((ruleText, idx) => (
                                <li
                                  key={idx}
                                  className="text-xs text-amber-800 dark:text-amber-200"
                                >
                                  {ruleText}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }

            default:
              return null;
          }
        })}
      </AnimatePresence>
    </div>
  );
}
