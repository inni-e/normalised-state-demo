"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Artifact } from "@/types/chat-stream";
import { useEffect } from "react";

interface BadArtifactPanelProps {
  artifact: Artifact | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BadArtifactPanel({
  artifact,
  isOpen,
  onClose,
}: BadArtifactPanelProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && artifact && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "50%", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="h-full border-l border-red-200 bg-white shadow-lg dark:border-red-700 dark:bg-gray-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-red-200 bg-red-50 px-6 py-4 dark:border-red-700 dark:bg-red-950">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Artifact (XML Parsed)
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {artifact.language ?? "text"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              aria-label="Close panel"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="h-[calc(100vh-5rem)] overflow-y-auto p-6">
            <pre className="rounded-lg bg-gray-100 p-4 text-sm whitespace-pre-wrap text-gray-900 dark:bg-gray-800 dark:text-gray-100">
              {artifact.text}
            </pre>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
