"use client";

import type { ClarificationQuestions } from "@/types/chat-stream";

interface ClarificationMessageProps {
  clarification: ClarificationQuestions;
}

export default function ClarificationMessage({
  clarification,
}: ClarificationMessageProps) {
  return (
    <div className="my-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">❓</span>
        <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
          I have some questions to better assist you:
        </h3>
      </div>
      <ul className="space-y-2">
        {clarification.questions.map((question, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-sm text-yellow-900 dark:text-yellow-100"
          >
            <span className="mt-0.5 text-yellow-600 dark:text-yellow-400">
              {idx + 1}.
            </span>
            <span>{question}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
