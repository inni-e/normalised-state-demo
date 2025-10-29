// Simplified types inspired by prophecy-core for demo purposes

export enum StreamChunkType {
  MESSAGE = "message",
  ARTIFACT = "artifact",
  CLARIFICATION = "clarification",
  FUNCTION_CALL = "function_call",
  WEB_SEARCH = "web_search",
  REASONING_TEXT = "reasoning_text",
  STAFF_REPORT_RULE = "staff_report_rule",
  ERROR = "error",
  STOP = "stop",
}

// Base types for each chunk data structure
export interface Message {
  id: string;
  text: string;
}

export interface Artifact {
  id: string;
  text: string;
  language?: string;
}

export interface ClarificationQuestions {
  id: string;
  questions: string[];
}

export interface ErrorMessage {
  id: string;
  text: string;
  is_error: true;
}

export interface ReasoningText {
  id: string;
  text: string;
}

export interface FunctionCall {
  id: string;
  name: string;
  arguments: string;
  status: "pending" | "executing" | "complete";
  call_id: string;
}

export interface WebSearch {
  id: string;
  query: string;
  sources: Array<{ title: string; url: string }>;
}

export interface StaffReportRule {
  id: string;
  section_name: string;
  rules: string[];
}

// Render section for maintaining order
export interface RenderSection {
  id: string;
  type: StreamChunkType;
  refId: string; // Reference to the actual data in the normalized stores
}

// Normalized state structures
export interface ChatState {
  messagesById: Record<string, Message>;
  artifactsById: Record<string, Artifact>;
  clarificationQuestionsById: Record<string, ClarificationQuestions>;
  errorMessageById: Record<string, ErrorMessage>;
  renderSections: RenderSection[];
}

export interface ThinkingState {
  staffReportRulesById: Record<
    string,
    { id: string; rules: StaffReportRule[] }
  >;
  reasoningTextById: Record<string, ReasoningText>;
  functionCallsById: Record<string, FunctionCall>;
  webSearchById: Record<string, WebSearch>;
  renderSections: RenderSection[];
}

// Stream chunk types (what comes from the "backend")
export type MessageChunk = {
  type: StreamChunkType.MESSAGE;
  text: string;
};

export type ArtifactChunk = {
  type: StreamChunkType.ARTIFACT;
  text: string;
  language?: string;
};

export type ClarificationChunk = {
  type: StreamChunkType.CLARIFICATION;
  questions: string[];
};

export type FunctionCallChunk = {
  type: StreamChunkType.FUNCTION_CALL;
  name: string;
  arguments: string;
  status: "pending" | "executing" | "complete";
  call_id: string;
};

export type WebSearchChunk = {
  type: StreamChunkType.WEB_SEARCH;
  query: string;
  sources: Array<{ title: string; url: string }>;
};

export type ReasoningTextChunk = {
  type: StreamChunkType.REASONING_TEXT;
  text: string;
};

export type StaffReportRuleChunk = {
  type: StreamChunkType.STAFF_REPORT_RULE;
  section_name: string;
  rule_text: string;
};

export type ErrorChunk = {
  type: StreamChunkType.ERROR;
  text: string;
};

export type StopChunk = {
  type: StreamChunkType.STOP;
};

export type StreamChunk =
  | MessageChunk
  | ArtifactChunk
  | ClarificationChunk
  | FunctionCallChunk
  | WebSearchChunk
  | ReasoningTextChunk
  | StaffReportRuleChunk
  | ErrorChunk
  | StopChunk;
