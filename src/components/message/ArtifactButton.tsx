"use client";

import type { Artifact } from "@/types/chat-stream";

interface ArtifactButtonProps {
  artifact: Artifact;
  onClick: () => void;
}

export default function ArtifactButton({
  artifact,
  onClick,
}: ArtifactButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group my-2 flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 transition-all hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md dark:border-indigo-800 dark:bg-indigo-950 dark:hover:border-indigo-700 dark:hover:bg-indigo-900"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
        <span className="text-xl">📄</span>
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
          View Artifact
        </p>
        <p className="text-xs text-indigo-600 dark:text-indigo-400">
          {artifact.language ?? "text"} • Click to expand
        </p>
      </div>
      <span className="text-indigo-600 transition-transform group-hover:translate-x-1 dark:text-indigo-400">
        →
      </span>
    </button>
  );
}
