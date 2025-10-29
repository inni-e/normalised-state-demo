"use client";

import type { ErrorMessage as ErrorMessageType } from "@/types/chat-stream";

interface ErrorMessageProps {
  error: ErrorMessageType;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="my-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
      <div className="flex items-start gap-2">
        <span className="text-lg">⚠️</span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900 dark:text-red-100">
            Error
          </h3>
          <p className="mt-1 text-sm text-red-800 dark:text-red-200">
            {error.text}
          </p>
        </div>
      </div>
    </div>
  );
}
