import { useCallback } from "react";
import type { RenderSection, StreamChunk } from "@/types/chat-stream";
import { StreamChunkType } from "@/types/chat-stream";
import {
  useChatStreamStore,
  createEmptyChatState,
  createEmptyThinkingState,
} from "@/lib/store/chat-stream-store";
import { getRandomScenario } from "@/lib/mock-stream-data";

export function useSimulatedStream() {
  const {
    setStreamingState,
    setThinkingState,
    setIsStreamingResponse,
    setCurrentArtifactId,
  } = useChatStreamStore();

  const createNewSection = (
    type: RenderSection["type"],
    id: string,
  ): RenderSection => ({
    id: id,
    type,
    refId: id,
  });

  const handleChunk = useCallback(
    (chunk: StreamChunk) => {
      switch (chunk.type) {
        case StreamChunkType.REASONING_TEXT: {
          setThinkingState((prev) => {
            const newId = crypto.randomUUID();
            return {
              ...prev,
              reasoningTextById: {
                ...prev.reasoningTextById,
                [newId]: {
                  id: newId,
                  text: chunk.text,
                },
              },
              renderSections: [
                ...prev.renderSections,
                createNewSection(StreamChunkType.REASONING_TEXT, newId),
              ],
            };
          });
          break;
        }

        case StreamChunkType.FUNCTION_CALL: {
          setThinkingState((prev) => {
            const stableId = chunk.call_id;
            return {
              ...prev,
              functionCallsById: {
                ...prev.functionCallsById,
                [stableId]: {
                  id: stableId,
                  name: chunk.name,
                  arguments: chunk.arguments,
                  status: chunk.status,
                  call_id: chunk.call_id,
                },
              },
              renderSections: [
                ...prev.renderSections,
                createNewSection(StreamChunkType.FUNCTION_CALL, stableId),
              ],
            };
          });
          break;
        }

        case StreamChunkType.WEB_SEARCH: {
          setThinkingState((prev) => {
            const newId = crypto.randomUUID();
            return {
              ...prev,
              webSearchById: {
                ...prev.webSearchById,
                [newId]: {
                  id: newId,
                  query: chunk.query,
                  sources: chunk.sources,
                },
              },
              renderSections: [
                ...prev.renderSections,
                createNewSection(StreamChunkType.WEB_SEARCH, newId),
              ],
            };
          });
          break;
        }

        case StreamChunkType.STAFF_REPORT_RULE: {
          setThinkingState((prev) => {
            const lastSection =
              prev.renderSections[prev.renderSections.length - 1];

            // If the previous section was also a staff report rule, append to it
            if (
              lastSection?.type === StreamChunkType.STAFF_REPORT_RULE &&
              lastSection.refId
            ) {
              const lastStaffReportRule =
                prev.staffReportRulesById[lastSection.refId];

              if (!lastStaffReportRule) {
                // If for some reason the rule doesn't exist, create a new one
                const newId = crypto.randomUUID();
                return {
                  ...prev,
                  staffReportRulesById: {
                    ...prev.staffReportRulesById,
                    [newId]: {
                      id: newId,
                      rules: [
                        {
                          id: crypto.randomUUID(),
                          section_name: chunk.section_name,
                          rules: [chunk.rule_text],
                        },
                      ],
                    },
                  },
                  renderSections: [
                    ...prev.renderSections,
                    createNewSection(StreamChunkType.STAFF_REPORT_RULE, newId),
                  ],
                };
              }

              // Check if we should append to the same section
              const existingRule = lastStaffReportRule.rules.find(
                (r) => r.section_name === chunk.section_name,
              );

              if (existingRule) {
                // Append to existing rule
                const updatedStaffReportRule = {
                  ...lastStaffReportRule,
                  rules: lastStaffReportRule.rules.map((r) =>
                    r.section_name === chunk.section_name
                      ? { ...r, rules: [...r.rules, chunk.rule_text] }
                      : r,
                  ),
                };

                return {
                  ...prev,
                  staffReportRulesById: {
                    ...prev.staffReportRulesById,
                    [lastSection.refId]: updatedStaffReportRule,
                  },
                };
              } else {
                // Add new rule to the same group
                const updatedStaffReportRule = {
                  ...lastStaffReportRule,
                  rules: [
                    ...lastStaffReportRule.rules,
                    {
                      id: crypto.randomUUID(),
                      section_name: chunk.section_name,
                      rules: [chunk.rule_text],
                    },
                  ],
                };

                return {
                  ...prev,
                  staffReportRulesById: {
                    ...prev.staffReportRulesById,
                    [lastSection.refId]: updatedStaffReportRule,
                  },
                };
              }
            }

            // Create new section
            const newId = crypto.randomUUID();
            return {
              ...prev,
              staffReportRulesById: {
                ...prev.staffReportRulesById,
                [newId]: {
                  id: newId,
                  rules: [
                    {
                      id: crypto.randomUUID(),
                      section_name: chunk.section_name,
                      rules: [chunk.rule_text],
                    },
                  ],
                },
              },
              renderSections: [
                ...prev.renderSections,
                createNewSection(StreamChunkType.STAFF_REPORT_RULE, newId),
              ],
            };
          });
          break;
        }

        case StreamChunkType.MESSAGE: {
          setStreamingState((prev) => {
            const lastSection =
              prev.renderSections[prev.renderSections.length - 1];
            const lastSectionIsMessage =
              lastSection?.type === StreamChunkType.MESSAGE;

            // Try appending to the last message
            if (lastSectionIsMessage && lastSection.refId) {
              const lastMsgId = lastSection.refId;
              const lastMsg = prev.messagesById[lastMsgId];

              if (lastMsg) {
                return {
                  ...prev,
                  messagesById: {
                    ...prev.messagesById,
                    [lastMsgId]: {
                      ...lastMsg,
                      text: lastMsg.text + chunk.text,
                    },
                  },
                };
              }
            }

            // Create new message
            const newId = crypto.randomUUID();
            return {
              ...prev,
              messagesById: {
                ...prev.messagesById,
                [newId]: {
                  id: newId,
                  text: chunk.text,
                },
              },
              renderSections: [
                ...prev.renderSections,
                createNewSection(StreamChunkType.MESSAGE, newId),
              ],
            };
          });
          break;
        }

        case StreamChunkType.ARTIFACT: {
          setStreamingState((prev) => {
            const lastSection =
              prev.renderSections[prev.renderSections.length - 1];
            const lastSectionIsArtifact =
              lastSection?.type === StreamChunkType.ARTIFACT;

            // Try appending to the last artifact
            if (lastSectionIsArtifact && lastSection.refId) {
              const lastArtifactId = lastSection.refId;
              const lastArtifact = prev.artifactsById[lastArtifactId];

              if (lastArtifact) {
                return {
                  ...prev,
                  artifactsById: {
                    ...prev.artifactsById,
                    [lastArtifactId]: {
                      ...lastArtifact,
                      text: lastArtifact.text + chunk.text,
                    },
                  },
                };
              }
            }

            // Create new artifact
            const newId = crypto.randomUUID();
            // Set as current artifact in next tick to avoid state update conflict
            void Promise.resolve().then(() => {
              setCurrentArtifactId(newId);
            });
            return {
              ...prev,
              artifactsById: {
                ...prev.artifactsById,
                [newId]: {
                  id: newId,
                  text: chunk.text,
                  language: chunk.language,
                },
              },
              renderSections: [
                ...prev.renderSections,
                createNewSection(StreamChunkType.ARTIFACT, newId),
              ],
            };
          });
          break;
        }

        case StreamChunkType.CLARIFICATION: {
          setStreamingState((prev) => {
            const newId = crypto.randomUUID();
            return {
              ...prev,
              clarificationQuestionsById: {
                ...prev.clarificationQuestionsById,
                [newId]: {
                  id: newId,
                  questions: chunk.questions,
                },
              },
              renderSections: [
                ...prev.renderSections,
                createNewSection(StreamChunkType.CLARIFICATION, newId),
              ],
            };
          });
          break;
        }

        case StreamChunkType.ERROR: {
          setStreamingState((prev) => {
            const newId = crypto.randomUUID();
            return {
              ...prev,
              errorMessageById: {
                ...prev.errorMessageById,
                [newId]: {
                  id: newId,
                  text: chunk.text,
                  is_error: true,
                },
              },
              renderSections: [
                ...prev.renderSections,
                createNewSection(StreamChunkType.ERROR, newId),
              ],
            };
          });
          break;
        }

        case StreamChunkType.STOP: {
          setIsStreamingResponse(false);
          break;
        }
      }
    },
    [
      setStreamingState,
      setThinkingState,
      setIsStreamingResponse,
      setCurrentArtifactId,
    ],
  );

  const startSimulation = useCallback(async () => {
    // Reset state
    setStreamingState(createEmptyChatState());
    setThinkingState(createEmptyThinkingState());
    setIsStreamingResponse(true);
    setCurrentArtifactId(null);

    // Get chunks from external data - use random scenario for demo
    const chunks = getRandomScenario();

    // Stream chunks with realistic delays
    for (const chunk of chunks) {
      await new Promise((resolve) => {
        if (
          chunk.type === StreamChunkType.MESSAGE ||
          chunk.type === StreamChunkType.ARTIFACT
        ) {
          setTimeout(resolve, 20 + Math.random() * 20);
        } else {
          setTimeout(resolve, 500 + Math.random() * 1000);
        }
      });
      handleChunk(chunk);
    }
  }, [
    handleChunk,
    setStreamingState,
    setThinkingState,
    setIsStreamingResponse,
    setCurrentArtifactId,
  ]);

  return { startSimulation };
}
