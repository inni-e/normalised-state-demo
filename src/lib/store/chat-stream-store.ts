import { create } from "zustand";
import type { ChatState, ThinkingState } from "@/types/chat-stream";

export const createEmptyChatState = (): ChatState => ({
  messagesById: {},
  artifactsById: {},
  clarificationQuestionsById: {},
  errorMessageById: {},
  renderSections: [],
});

export const createEmptyThinkingState = (): ThinkingState => ({
  staffReportRulesById: {},
  reasoningTextById: {},
  functionCallsById: {},
  webSearchById: {},
  renderSections: [],
});

interface ChatStreamStore {
  streamingState: ChatState;
  thinkingState: ThinkingState;
  isStreamingResponse: boolean;
  currentArtifactId: string | null;
  setStreamingState: (
    state: ChatState | ((prev: ChatState) => ChatState),
  ) => void;
  setThinkingState: (
    state: ThinkingState | ((prev: ThinkingState) => ThinkingState),
  ) => void;
  setIsStreamingResponse: (isStreaming: boolean) => void;
  setCurrentArtifactId: (id: string | null) => void;
  resetStates: () => void;
}

export const useChatStreamStore = create<ChatStreamStore>((set) => ({
  streamingState: createEmptyChatState(),
  thinkingState: createEmptyThinkingState(),
  isStreamingResponse: false,
  currentArtifactId: null,

  setStreamingState: (state) =>
    set((store) => ({
      streamingState:
        typeof state === "function" ? state(store.streamingState) : state,
    })),

  setThinkingState: (state) =>
    set((store) => ({
      thinkingState:
        typeof state === "function" ? state(store.thinkingState) : state,
    })),

  setIsStreamingResponse: (isStreaming) =>
    set({ isStreamingResponse: isStreaming }),

  setCurrentArtifactId: (id) => set({ currentArtifactId: id }),

  resetStates: () =>
    set({
      streamingState: createEmptyChatState(),
      thinkingState: createEmptyThinkingState(),
      isStreamingResponse: false,
      currentArtifactId: null,
    }),
}));
