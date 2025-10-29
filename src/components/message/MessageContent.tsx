"use client";

import type { Message } from "@/types/chat-stream";

interface MessageContentProps {
  message: Message;
}

export default function MessageContent({ message }: MessageContentProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
        {message.text}
      </p>
    </div>
  );
}
